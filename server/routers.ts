import { z } from "zod";
import { COOKIE_NAME } from "@shared/const";
import { getSessionCookieOptions } from "./_core/cookies";
import { systemRouter } from "./_core/systemRouter";
import { publicProcedure, router } from "./_core/trpc";
import { campusLocations } from "../drizzle/schema";
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
