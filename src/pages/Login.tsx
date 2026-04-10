import { useState, SVGProps } from "react";
import { useNavigate } from "react-router-dom";
import { CursorMark } from "@/components/CursorMark";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import { ArrowRight, Eye, EyeOff, Lock, Mail } from "lucide-react";

const GoogleIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg fill="currentColor" viewBox="0 0 24 24" {...props}>
    <path d="M3.06364 7.50914C4.70909 4.24092 8.09084 2 12 2C14.6954 2 16.959 2.99095 18.6909 4.60455L15.8227 7.47274C14.7864 6.48185 13.4681 5.97727 12 5.97727C9.39542 5.97727 7.19084 7.73637 6.40455 10.1C6.2045 10.7 6.09086 11.3409 6.09086 12C6.09086 12.6591 6.2045 13.3 6.40455 13.9C7.19084 16.2636 9.39542 18.0227 12 18.0227C13.3454 18.0227 14.4909 17.6682 15.3864 17.0682C16.4454 16.3591 17.15 15.3 17.3818 14.05H12V10.1818H21.4181C21.5364 10.8363 21.6 11.5182 21.6 12.2273C21.6 15.2727 20.5091 17.8363 18.6181 19.5773C16.9636 21.1046 14.7 22 12 22C8.09084 22 4.70909 19.7591 3.06364 16.4909C2.38638 15.1409 2 13.6136 2 12C2 10.3864 2.38638 8.85911 3.06364 7.50914Z" />
  </svg>
);

const Login = () => {
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    navigate("/dashboard");
  };

  return (
    <div className="flex min-h-dvh items-center justify-center bg-background px-4">
      <div className="mx-auto w-full max-w-xs space-y-6">
        <div className="space-y-5 text-center">
          <CursorMark className="mx-auto h-16 w-16 text-foreground" />
          <div className="space-y-3">
            <h1 className="text-balance text-2xl font-semibold tracking-[-0.03em] text-foreground sm:text-[1.6875rem]">
              {isSignUp ? "Create an account" : "Welcome to debil"}
            </h1>
            <blockquote className="mx-auto max-w-[min(100%,22rem)] border-none p-0">
              <p className="text-pretty text-center font-mono text-[0.8125rem] leading-[1.65] tracking-[-0.01em] text-muted-foreground sm:text-[0.84375rem]">
                <span className="text-muted-foreground/40" aria-hidden>
                  "
                </span>
                {isSignUp
                  ? "Upload materials. Tag what you know—and what you missed."
                  : "Bridge gaps from what you already know."}
                <span className="text-muted-foreground/40" aria-hidden>
                  "
                </span>
              </p>
            </blockquote>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          <Button
            variant="outline"
            size="lg"
            className="w-full justify-center gap-2 text-foreground"
            type="button"
            onClick={() => navigate("/dashboard")}
          >
            <GoogleIcon className="h-4 w-4" />
            {isSignUp ? "Continue with Google" : "Sign in with Google"}
          </Button>

          <div className="flex items-center gap-2">
            <Separator className="flex-1" />
            <span className="text-sm text-muted-foreground">
              {isSignUp ? "or sign up with email" : "or sign in with email"}
            </span>
            <Separator className="flex-1" />
          </div>

          <div className="space-y-6">
            {isSignUp && (
              <div>
                <Label htmlFor="username" className="text-foreground">
                  Username
                </Label>
                <div className="mt-2.5">
                  <Input
                    id="username"
                    autoComplete="username"
                    placeholder="Choose a username"
                  />
                </div>
              </div>
            )}

            <div>
              <Label htmlFor="email" className="text-foreground">
                Email
              </Label>
              <div className="relative mt-2.5">
                <Input
                  id="email"
                  className="peer ps-9"
                  type="email"
                  placeholder="meghamsh@connect.hku.hk"
                  autoComplete="email"
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-foreground/80 peer-disabled:opacity-50">
                  <Mail size={16} aria-hidden="true" />
                </div>
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between">
                <Label htmlFor="password" className="text-foreground">
                  Password
                </Label>
                {!isSignUp && (
                  <button
                    type="button"
                    className="text-sm text-foreground hover:underline"
                  >
                    Forgot Password?
                  </button>
                )}
              </div>
              <div className="relative mt-2.5">
                <Input
                  id="password"
                  className="peer ps-9 pe-9"
                  placeholder="Enter your password"
                  type={showPassword ? "text" : "password"}
                  autoComplete={isSignUp ? "new-password" : "current-password"}
                />
                <div className="pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3 text-foreground/80 peer-disabled:opacity-50">
                  <Lock size={16} aria-hidden="true" />
                </div>
                <button
                  className="absolute inset-y-0 end-0 flex h-full w-9 items-center justify-center rounded-e-md text-foreground/80 outline-none transition-[color,box-shadow] hover:text-foreground focus:z-10 focus-visible:border-ring focus-visible:ring-[3px] focus-visible:ring-ring/50 disabled:pointer-events-none disabled:cursor-not-allowed disabled:opacity-50"
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                  aria-pressed={showPassword}
                  aria-controls="password"
                >
                  {showPassword ? (
                    <EyeOff size={16} aria-hidden="true" />
                  ) : (
                    <Eye size={16} aria-hidden="true" />
                  )}
                </button>
              </div>
            </div>

            <div className="flex items-center gap-2 pt-1">
              {isSignUp ? (
                <>
                  <Checkbox id="terms" />
                  <Label htmlFor="terms" className="text-foreground">
                    I agree to the{" "}
                    <span className="underline-offset-4 hover:underline cursor-pointer">
                      Terms
                    </span>{" "}
                    and{" "}
                    <span className="underline-offset-4 hover:underline cursor-pointer">
                      Conditions
                    </span>
                  </Label>
                </>
              ) : (
                <>
                  <Checkbox id="remember-me" />
                  <Label htmlFor="remember-me" className="text-foreground">
                    Remember for 30 days
                  </Label>
                </>
              )}
            </div>
          </div>

          <Button size="lg" className="w-full" type="submit">
            {isSignUp ? "Create account" : "Sign in"}
            <ArrowRight className="h-4 w-4" />
          </Button>

          <div className="text-center text-sm text-foreground">
            {isSignUp ? "Already have an account?" : "No account?"}{" "}
            <button
              type="button"
              onClick={() => {
                setIsSignUp(!isSignUp);
                setShowPassword(false);
              }}
              className="font-medium text-foreground hover:underline"
            >
              {isSignUp ? "Sign in" : "Create an account"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
