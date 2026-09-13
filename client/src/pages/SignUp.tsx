import { useState } from "react";
import { useLocation } from "wouter";
import {
  createUserWithEmailAndPassword,
  GoogleAuthProvider,
  signInWithPopup,
  updateProfile,
  signOut,
} from "firebase/auth";
import { Eye, EyeOff, Lock, Mail, User, UserPlus } from "lucide-react";
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
    case "auth/email-already-in-use":
      return "An account with this email already exists. Please sign in.";
    case "auth/invalid-email":
      return "Please enter a valid college email address.";
    case "auth/weak-password":
      return "Password should be at least 6 characters.";
    case "auth/popup-closed-by-user":
      return "Google sign-in was cancelled.";
    case "auth/configuration-not-found":
    case "auth/operation-not-allowed":
      return "Firebase Auth provider is not enabled for this project yet.";
    default:
      return error instanceof Error
        ? error.message
        : "Unable to create your account. Please try again.";
  }
}

export default function SignUp() {
  const [, setLocation] = useLocation();
  const firebaseLogin = trpc.auth.firebaseLogin.useMutation();
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
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

    if (!fullName.trim()) {
      setError("Please enter your full name.");
      return;
    }
    if (!email.trim()) {
      setError("Please enter your college email.");
      return;
    }
    if (password.length < 6) {
      setError("Password should be at least 6 characters.");
      return;
    }
    if (password !== confirmPassword) {
      setError("Passwords do not match.");
      return;
    }

    setBusy(true);
    try {
      assertFirebaseConfigured();
      const credential = await createUserWithEmailAndPassword(
        firebaseAuth,
        email.trim(),
        password,
      );
      await updateProfile(credential.user, { displayName: fullName.trim() });
      // Account created — send user to Sign In as requested.
      await signOut(firebaseAuth);
      setLocation(`/signin?registered=1&email=${encodeURIComponent(email.trim())}`);
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
          Already have an account? <AuthLink href="/signin">Sign In</AuthLink>
        </span>
      }
    >
      <div className="mb-6">
        <h1 className="text-[1.65rem] font-bold tracking-tight text-[#0b2a4a]">
          Create Your Account
        </h1>
        <p className="mt-2 text-sm leading-relaxed text-[#6b7c8f]">
          Join SVCE CampNavi and start exploring your campus with ease.
        </p>
      </div>

      <form className="space-y-4" onSubmit={onSubmit}>
        <AuthField
          id="fullName"
          label="Full Name"
          placeholder="Enter your full name"
          value={fullName}
          onChange={setFullName}
          autoComplete="name"
          leftIcon={<User className="h-4 w-4" />}
        />
        <AuthField
          id="email"
          label="College Email"
          type="email"
          placeholder="Enter your college email (e.g. name@svce.ac.in)"
          value={email}
          onChange={setEmail}
          autoComplete="email"
          leftIcon={<Mail className="h-4 w-4" />}
        />
        <AuthField
          id="password"
          label="Password"
          type={showPassword ? "text" : "password"}
          placeholder="Create a password"
          value={password}
          onChange={setPassword}
          autoComplete="new-password"
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
        <AuthField
          id="confirmPassword"
          label="Confirm Password"
          type={showConfirm ? "text" : "password"}
          placeholder="Re-enter your password"
          value={confirmPassword}
          onChange={setConfirmPassword}
          autoComplete="new-password"
          leftIcon={<Lock className="h-4 w-4" />}
          rightSlot={
            <button
              type="button"
              className="rounded p-1 text-[#8a97a8] hover:text-[#0b2a4a]"
              onClick={() => setShowConfirm(v => !v)}
              aria-label={showConfirm ? "Hide password" : "Show password"}
            >
              {showConfirm ? (
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
          <UserPlus className="h-4 w-4" />
          {busy ? "Please wait…" : "Create Account"}
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

      <p className="mt-5 text-center text-[0.75rem] leading-relaxed text-[#7b8a9b]">
        By creating an account, you agree to our{" "}
        <a href="#" className="font-medium text-[#1a73e8] hover:underline">
          Terms of Service
        </a>{" "}
        and{" "}
        <a href="#" className="font-medium text-[#1a73e8] hover:underline">
          Privacy Policy
        </a>
        .
      </p>
    </AuthSplitLayout>
  );
}
