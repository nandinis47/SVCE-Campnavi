import { Link } from "wouter";
import { Bot, MapPin, Navigation, Route } from "lucide-react";
import type { ReactNode } from "react";

const FEATURES = [
  { icon: MapPin, label: "Campus Map" },
  { icon: Route, label: "Route Planner" },
  { icon: Bot, label: "Student AI" },
  { icon: Navigation, label: "Find Your Way" },
] as const;

/**
 * Split layout matching the CampNavi Sign Up / Sign In design.
 * Logo already includes "SVCE CAMPNAVI" — no duplicate title is rendered below it.
 */
export function AuthSplitLayout({
  children,
  topRight,
}: {
  children: ReactNode;
  topRight?: ReactNode;
}) {
  return (
    <div className="auth-split relative min-h-screen w-full overflow-x-hidden bg-[#e8eef5] text-[#0b2a4a]">
      <div className="flex justify-center bg-[#0b2a4a] px-4 py-5 md:hidden">
        <img
          src="/branding/campnavi-logo.png"
          alt="SVCE CampNavi"
          className="h-20 w-20 rounded-full object-cover"
        />
      </div>

      <div className="auth-split__left absolute inset-y-0 left-0 z-0 hidden md:block">
        <div
          className="absolute inset-0 bg-cover bg-center"
          style={{ backgroundImage: "url(/branding/campus-bg.jpg)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-black/35 to-black/60" />
        <div className="relative z-10 flex h-full flex-col items-center px-8 pb-12 pt-14 text-center text-white">
          <img
            src="/branding/campnavi-logo.png"
            alt="SVCE CampNavi"
            className="h-[9.75rem] w-[9.75rem] rounded-full object-cover shadow-[0_12px_40px_rgba(0,0,0,0.35)]"
          />
          <p className="mt-6 text-[1.2rem] font-semibold tracking-wide drop-shadow">
            Explore • Navigate • Discover
          </p>
          <p className="mt-3 max-w-[19.5rem] text-[0.95rem] leading-relaxed text-white/90 drop-shadow">
            Your smart campus companion for seamless navigation and a better SVCE
            experience.
          </p>
          <div className="mt-auto flex w-full max-w-md items-start justify-between gap-1 pt-12">
            {FEATURES.map(({ icon: Icon, label }, index) => (
              <div key={label} className="flex flex-1 items-start justify-center">
                {index > 0 ? (
                  <div className="mr-1 mt-1 h-10 w-px bg-white/35" aria-hidden />
                ) : null}
                <div className="flex flex-1 flex-col items-center gap-2 px-1">
                  <Icon className="h-6 w-6 stroke-[1.5]" aria-hidden />
                  <span className="text-[0.68rem] font-medium leading-tight">
                    {label}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="auth-split__right relative z-10 ml-0 flex min-h-[calc(100vh-7.5rem)] items-center justify-center px-4 py-8 md:ml-[38%] md:min-h-screen md:px-8 lg:ml-[40%]">
        <div className="w-full max-w-[440px]">
          {topRight ? (
            <div className="mb-4 flex justify-end text-sm text-[#5b6b7c]">
              {topRight}
            </div>
          ) : null}
          <div className="rounded-2xl border border-white/80 bg-white px-7 py-8 shadow-[0_18px_50px_rgba(15,35,70,0.12)] sm:px-9 sm:py-9">
            {children}
          </div>
        </div>
      </div>

      <style>{`
        .auth-split__left {
          width: 46%;
          clip-path: polygon(0 0, 100% 0, 78% 100%, 0 100%);
        }
        @media (min-width: 1024px) {
          .auth-split__left {
            width: 48%;
            clip-path: polygon(0 0, 100% 0, 82% 100%, 0 100%);
          }
        }
      `}</style>
    </div>
  );
}

export function AuthField({
  id,
  label,
  type = "text",
  placeholder,
  value,
  onChange,
  autoComplete,
  leftIcon,
  rightSlot,
}: {
  id: string;
  label: string;
  type?: string;
  placeholder: string;
  value: string;
  onChange: (value: string) => void;
  autoComplete?: string;
  leftIcon: ReactNode;
  rightSlot?: ReactNode;
}) {
  return (
    <div className="space-y-1.5">
      <label htmlFor={id} className="block text-sm font-semibold text-[#0b2a4a]">
        {label}
      </label>
      <div className="relative">
        <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-[#8a97a8]">
          {leftIcon}
        </span>
        <input
          id={id}
          type={type}
          value={value}
          onChange={e => onChange(e.target.value)}
          placeholder={placeholder}
          autoComplete={autoComplete}
          className="h-11 w-full rounded-lg border border-[#d5dde7] bg-white pl-10 pr-10 text-sm text-[#0b2a4a] outline-none transition placeholder:text-[#9aa6b5] focus:border-[#0b2a4a] focus:ring-2 focus:ring-[#0b2a4a]/15"
        />
        {rightSlot ? (
          <span className="absolute right-2 top-1/2 -translate-y-1/2">
            {rightSlot}
          </span>
        ) : null}
      </div>
    </div>
  );
}

export function AuthLink({
  href,
  children,
}: {
  href: string;
  children: ReactNode;
}) {
  return (
    <Link href={href} className="font-semibold text-[#1a73e8] hover:underline">
      {children}
    </Link>
  );
}

export function GoogleGlyph({ className }: { className?: string }) {
  return (
    <svg className={className} viewBox="0 0 24 24" aria-hidden>
      <path
        fill="#4285F4"
        d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 0 1-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z"
      />
      <path
        fill="#34A853"
        d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
      />
      <path
        fill="#FBBC05"
        d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18A10.96 10.96 0 0 0 1 12c0 1.77.42 3.45 1.18 4.93l3.66-2.84z"
      />
      <path
        fill="#EA4335"
        d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
      />
    </svg>
  );
}
