import { useMemo, useState } from "react";
import { useLocation, useSearch } from "wouter";
import {
  GoogleAuthProvider,
  signInWithEmailAndPassword,
  signInWithPopup,
} from "firebase/auth";
import { Eye, EyeOff, Lock, LogIn, Mail } from "lucide-react";
import {
  AuthField,
  AuthLink,
  AuthSplitLayout,
  GoogleGlyph,
} from "@/components/AuthSplitLayout";
import { assertFirebaseConfigured, firebaseAuth } from "@/lib/firebase";
import { trpc } from "@/lib/trpc";

function mapFirebaseError(error: unknown): string {
  const code =
    typeof error === "object" && error && "code" in error
      ? String((error as { code?: string }).code)
      : "";
  switch (code) {
    case "auth/invalid-credential":
    case "auth/wrong-password":
    case "auth/user-not-found":
      return "Incorrect email or password.";
    case "auth/invalid-email":
      return "Please enter a valid college email address.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/configuration-not-found":
    case "auth/operation-not-allowed":
      return "Firebase Auth provider is not enabled for this project yet.";
    default:
      return error instanceof Error
        ? error.message
        : "Unable to sign in. Please try again.";
  }
}

export default function SignIn() {
  const [, setLocation] = useLocation();
  const search = useSearch();
  const firebaseLogin = trpc.auth.firebaseLogin.useMutation();
  const query = useMemo(() => new URLSearchParams(search), [search]);
  const registered = query.get("registered") === "1";
  const [email, setEmail] = useState(query.get("email") ?? "");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState(false);

  const exchangeAndEnter = async () => {
    const idToken = await firebaseAuth.currentUser?.getIdToken(true);
    if (!idToken) throw new Error("Missing Firebase ID token");
    await firebaseLogin.mutateAsync({ idToken });
    setLocation("/");
  };

  const onSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setError(null);
    if (!email.trim() || !password) {
      setError("Please enter your email and password.");
      return;
    }
    setBusy(true);
    try {
      assertFirebaseConfigured();
      await signInWithEmailAndPassword(firebaseAuth, email.trim(), password);
      await exchangeAndEnter();
    } catch (err) {
      setError(mapFirebaseError(err));
    } finally {
      setBusy(false);
    }
  };

  const onGoogle = async () => {
    setError(null);
    setBusy(true);
    try {
      assertFirebaseConfigured();
      const provider = new GoogleAuthProvider();
      provider.setCustomParameters({ prompt: "select_account" });
      await signInWithPopup(firebaseAuth, provider);
      await exchangeAndEnter();
    } catch (err) {
      setError(mapFirebaseError(err));
    } finally {
      setBusy(false);
    }
  };

  return (
    <AuthSplitLayout
      topRight={
        <span>
          New to CampNavi? <AuthLink href="/signup">Sign Up</AuthLink>
        </span>
      }
    >
      <div className="mb-6">
        <h1 className="text-[1.65rem] font-bold tracking-tight text-[#0b2a4a]">
          Welcome Back
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7c8f]">
          Sign in to continue to your SVCE CampNavi dashboard.
        </p>
      </div>

      {registered ? (
        <p className="mb-4 rounded-lg bg-emerald-50 px-3 py-2 text-sm text-emerald-700">
          Account created successfully. Please sign in to continue.
        </p>
      ) : null}

      <form className="space-y-4" onSubmit={onSubmit}>
        <AuthField
          id="email"
          label="Email Address"
          type="email"
          placeholder="Enter your college email"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
        />
        <AuthField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Enter your password"
          value={password}
          onChange={setPassword}
          autoComplete="current-password"
          leftIcon={<Lock className="h-4 w-4" />}
          rightSlot={
            <button
              type="button"
              className="rounded p-1 text-[#8a97a8] hover:text-[#0b2a4a]"
              onClick={() => setShowPassword(v => !v)}
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? (
                <EyeOff className="h-4 w-4" />
              ) : (
                <Eye className="h-4 w-4" />
              )}
            </button>
          }
        />

        {error ? (
          <p className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-600">
            {error}
          </p>
        ) : null}

        <button
          type="submit"
          disabled={busy}
          className="flex h-11 w-full items-center justify-center gap-2 rounded-lg bg-[#0b2a4a] text-sm font-semibold text-white transition hover:bg-[#0a2340] disabled:cursor-not-allowed disabled:opacity-70"
        >
          <LogIn className="h-4 w-4" />
          {busy ? "Please wait…" : "Sign In"}
        </button>
      </form>

      <div className="my-5 flex items-center gap-3">
        <div className="h-px flex-1 bg-[#d9e0ea]" />
        <span className="text-xs font-medium tracking-wide text-[#9aa6b5]">
          OR
        </span>
        <div className="h-px flex-1 bg-[#d9e0ea]" />
      </div>

      <button
        type="button"
        disabled={busy}
        onClick={onGoogle}
        className="flex h-11 w-full items-center justify-center gap-2 rounded-lg border border-[#d5dde7] bg-white text-sm font-semibold text-[#3c4a5a] transition hover:bg-[#f7f9fc] disabled:cursor-not-allowed disabled:opacity-70"
      >
        <GoogleGlyph className="h-5 w-5" />
        Continue with Google
      </button>
    </AuthSplitLayout>
  );
}
