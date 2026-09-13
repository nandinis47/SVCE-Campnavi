import { createRemoteJWKSet, jwtVerify } from "jose";
import { ENV } from "./env";

const FIREBASE_JWKS = createRemoteJWKSet(
  new URL(
    "https://www.googleapis.com/service_accounts/v1/jwk/securetoken@system.gserviceaccount.com",
  ),
);

export type FirebaseIdTokenClaims = {
  uid: string;
  email: string | null;
  name: string | null;
  picture: string | null;
  signInProvider: string | null;
};

/**
 * Verify a Firebase ID token with Google's published JWKS and map claims
 * into the existing users/openId session model.
 */
export async function verifyFirebaseIdToken(
  idToken: string,
): Promise<FirebaseIdTokenClaims> {
  const projectId = ENV.firebaseProjectId;
  if (!projectId) {
    throw new Error("FIREBASE_PROJECT_ID / VITE_FIREBASE_PROJECT_ID is not configured");
  }

  const { payload } = await jwtVerify(idToken, FIREBASE_JWKS, {
    issuer: `https://securetoken.google.com/${projectId}`,
    audience: projectId,
  });

  const uid = typeof payload.sub === "string" ? payload.sub : "";
  if (!uid) {
    throw new Error("Firebase token missing subject");
  }

  const firebaseClaim = payload.firebase as
    | { sign_in_provider?: string }
    | undefined;

  return {
    uid,
    email: typeof payload.email === "string" ? payload.email : null,
    name: typeof payload.name === "string" ? payload.name : null,
    picture: typeof payload.picture === "string" ? payload.picture : null,
    signInProvider: firebaseClaim?.sign_in_provider ?? null,
  };
}

export function firebaseOpenId(uid: string): string {
  return `firebase:${uid}`;
}

export function firebaseLoginMethod(provider: string | null): string {
  if (provider === "google.com") return "google";
  if (provider === "password") return "email";
  return provider ?? "firebase";
}
