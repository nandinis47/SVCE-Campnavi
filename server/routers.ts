import { z } from "zod";
import { COOKIE_NAME, ONE_YEAR_MS } from "@shared/const";
import { TRPCError } from "@trpc/server";
import { getSessionCookieOptions } from "./_core/cookies";
import {
  firebaseLoginMethod,
  firebaseOpenId,
  verifyFirebaseIdToken,
} from "./_core/firebaseAuth";
import { sdk } from "./_core/sdk";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { campusLocations } from "../drizzle/schema";
import * as db from "./db";
import { getDb } from "./db";
import {
  findShortestRouteFromDatabase,
  getRouteNodeById,
  listRouteNodes,
} from "./routeGraphService";

export const appRouter = router({
  system: systemRouter,
  auth: router({
    me: publicProcedure.query(({ ctx }) => ctx.user),
    logout: publicProcedure.mutation(({ ctx }) => {
      const cookieOptions = getSessionCookieOptions(ctx.req);
      ctx.res.clearCookie(COOKIE_NAME, { ...cookieOptions, maxAge: -1 });
      return { success: true } as const;
    }),
    /**
     * Exchange a verified Firebase ID token for the existing app session cookie
     * and upsert into the shared users table (no separate auth database).
     */
    firebaseLogin: publicProcedure
      .input(z.object({ idToken: z.string().min(1) }))
      .mutation(async ({ ctx, input }) => {
        let claims;
        try {
          claims = await verifyFirebaseIdToken(input.idToken);
        } catch (error) {
          console.error("[Auth] Firebase token verification failed", error);
          throw new TRPCError({
            code: "UNAUTHORIZED",
            message: "Invalid Firebase credentials",
          });
        }

        const openId = firebaseOpenId(claims.uid);
        const name =
          claims.name?.trim() ||
          claims.email?.split("@")[0] ||
          "CampNavi User";
        const loginMethod = firebaseLoginMethod(claims.signInProvider);

        await db.upsertUser({
          openId,
          name,
          email: claims.email,
          loginMethod,
          lastSignedIn: new Date(),
        });

        const sessionToken = await sdk.createSessionToken(openId, {
          name,
          expiresInMs: ONE_YEAR_MS,
        });
        const cookieOptions = getSessionCookieOptions(ctx.req);
        ctx.res.cookie(COOKIE_NAME, sessionToken, {
          ...cookieOptions,
          maxAge: ONE_YEAR_MS,
        });

        const user = await db.getUserByOpenId(openId);
        return { success: true as const, user: user ?? null };
      }),
  }),

  campus: router({
    nodes: publicProcedure.query(() => listRouteNodes()),
    locations: publicProcedure.query(async () => {
      const db = await getDb();
      if (!db) throw new Error("DATABASE_URL is not configured");
      return db.select().from(campusLocations);
    }),
    route: publicProcedure
      .input(z.object({ startId: z.string().min(1), endId: z.string().min(1) }))
      .query(({ input }) => findShortestRouteFromDatabase(input.startId, input.endId)),
    node: publicProcedure
      .input(z.object({ id: z.string().min(1) }))
      .query(({ input }) => getRouteNodeById(input.id)),
  }),
});

export type AppRouter = typeof appRouter;
