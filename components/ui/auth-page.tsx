'use client';

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  AtSignIcon,
  ChevronLeftIcon,
  EyeIcon,
  EyeOffIcon,
  LockIcon,
  MailCheckIcon,
  SparklesIcon,
} from 'lucide-react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { createClient } from '@/lib/supabase/client';
import { toast } from 'sonner';
import { cn } from '@/lib/utils';
import { Input } from './input';
import { Button } from './button';
import { TestimonialsMinimal } from './minimal-testimonial';

function FloatingPaths({ position }: { position: number }) {
  const paths = Array.from({ length: 36 }, (_, i) => ({
    id: i,
    d: `M-${380 - i * 5 * position} -${189 + i * 6}C-${
      380 - i * 5 * position
    } -${189 + i * 6} -${312 - i * 5 * position} ${216 - i * 6} ${
      152 - i * 5 * position
    } ${343 - i * 6}C${616 - i * 5 * position} ${470 - i * 6} ${
      684 - i * 5 * position
    } ${875 - i * 6} ${684 - i * 5 * position} ${875 - i * 6}`,
    width: 0.5 + i * 0.03,
  }));

  return (
    <div className="pointer-events-none absolute inset-0">
      <svg
        className="h-full w-full text-slate-950 dark:text-white"
        viewBox="0 0 696 316"
        fill="none"
      >
        <title>Background Paths</title>
        {paths.map((path) => (
          <motion.path
            key={path.id}
            d={path.d}
            stroke="currentColor"
            strokeWidth={path.width}
            strokeOpacity={0.1 + path.id * 0.03}
            initial={{ pathLength: 0.3, opacity: 0.6 }}
            animate={{
              pathLength: 1,
              opacity: [0.3, 0.6, 0.3],
              pathOffset: [0, 1, 0],
            }}
            transition={{
              duration: 20 + Math.random() * 10,
              repeat: Number.POSITIVE_INFINITY,
              ease: 'linear',
            }}
          />
        ))}
      </svg>
    </div>
  );
}

type AuthMode = 'signin' | 'signup';

export function AuthPage() {
  const [mode, setMode] = useState<AuthMode>('signin');
  const [emailSent, setEmailSent] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const router = useRouter();
  const supabase = createClient();

  const switchMode = (newMode: AuthMode) => {
    setMode(newMode);
    setEmailSent(false);
    setPassword('');
    setConfirmPassword('');
    setShowPassword(false);
    setShowConfirmPassword(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) return;

    if (mode === 'signup') {
      if (password.length < 6) {
        toast.error('Password must be at least 6 characters.');
        return;
      }
      if (password !== confirmPassword) {
        toast.error('Passwords do not match.');
        return;
      }

      setLoading(true);
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            typeof window !== 'undefined'
              ? `${window.location.origin}/dashboard`
              : undefined,
        },
      });
      setLoading(false);

      if (error) {
        toast.error(error.message);
      } else if (data.session) {
        toast.success('Account created! Welcome to AntarYatra.');
        router.push('/dashboard');
        router.refresh();
      } else {
        setEmailSent(true);
      }
    } else {
      setLoading(true);
      const { error } = await supabase.auth.signInWithPassword({
        email,
        password,
      });
      setLoading(false);

      if (error) {
        toast.error(error.message);
      } else {
        toast.success('Welcome back!');
        router.push('/dashboard');
        router.refresh();
      }
    }
  };

  return (
    <main className="relative md:h-screen md:overflow-hidden lg:grid lg:grid-cols-2">
      {/* Left Panel */}
      <div className="bg-muted/60 relative hidden h-full flex-col border-r p-10 lg:flex">
        <div className="from-background absolute inset-0 z-10 bg-gradient-to-t to-transparent" />

        <div className="z-10 flex items-center gap-2">
          <SparklesIcon className="size-6" />
          <p className="text-xl font-semibold">AntarYatra</p>
        </div>

        <div className="z-10 mt-auto">
          <TestimonialsMinimal />
        </div>

        <div className="absolute inset-0">
          <FloatingPaths position={1} />
          <FloatingPaths position={-1} />
        </div>
      </div>

      {/* Right Panel */}
      <div className="relative flex min-h-screen flex-col justify-center p-4">
        <Button variant="ghost" className="absolute top-7 left-5" asChild>
          <Link href="/">
            <ChevronLeftIcon className="size-4 me-2" />
            Home
          </Link>
        </Button>

        <div className="mx-auto w-full max-w-sm space-y-6 px-4">
          {/* Mobile brand */}
          <div className="flex items-center gap-2 lg:hidden">
            <SparklesIcon className="size-6" />
            <p className="text-xl font-semibold">AntarYatra</p>
          </div>

          <AnimatePresence mode="wait">
            {emailSent ? (
              /* Email verification sent */
              <motion.div
                key="verify"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5 text-center"
              >
                <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
                  <MailCheckIcon className="size-8 text-primary" />
                </div>
                <div className="space-y-2">
                  <h1 className="text-2xl font-bold tracking-tight">
                    Check your inbox
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    We sent a verification link to{' '}
                    <span className="font-medium text-foreground">{email}</span>.
                    Click the link in the email to confirm your account and begin
                    your journey.
                  </p>
                </div>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={() => setEmailSent(false)}
                >
                  Use a different email
                </Button>
              </motion.div>
            ) : (
              /* Auth form */
              <motion.div
                key="form"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.3 }}
                className="space-y-5"
              >
                <div className="flex flex-col space-y-1">
                  <h1 className="text-2xl font-bold tracking-tight">
                    {mode === 'signin' ? 'Welcome back' : 'Create account'}
                  </h1>
                  <p className="text-muted-foreground text-sm">
                    {mode === 'signin'
                      ? 'Sign in to continue your inner journey.'
                      : 'Start your mental wellness journey today.'}
                  </p>
                </div>

                {/* Mode toggle */}
                <div className="flex rounded-lg border p-1 gap-1">
                  <button
                    type="button"
                    onClick={() => switchMode('signin')}
                    className={cn(
                      'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                      mode === 'signin'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Sign In
                  </button>
                  <button
                    type="button"
                    onClick={() => switchMode('signup')}
                    className={cn(
                      'flex-1 rounded-md py-1.5 text-sm font-medium transition-all',
                      mode === 'signup'
                        ? 'bg-background shadow-sm text-foreground'
                        : 'text-muted-foreground hover:text-foreground'
                    )}
                  >
                    Sign Up
                  </button>
                </div>

                <form onSubmit={handleSubmit} className="space-y-3">
                  {/* Email */}
                  <div className="relative">
                    <Input
                      placeholder="you@example.com"
                      className="ps-9"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                      <AtSignIcon className="size-4" aria-hidden="true" />
                    </div>
                  </div>

                  {/* Password */}
                  <div className="relative">
                    <Input
                      placeholder="Password"
                      className="ps-9 pe-10"
                      type={showPassword ? 'text' : 'password'}
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      disabled={loading}
                    />
                    <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                      <LockIcon className="size-4" aria-hidden="true" />
                    </div>
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 hover:text-foreground transition-colors"
                      tabIndex={-1}
                    >
                      {showPassword ? (
                        <EyeOffIcon className="size-4" />
                      ) : (
                        <EyeIcon className="size-4" />
                      )}
                    </button>
                  </div>

                  {/* Confirm Password — Sign Up only */}
                  <AnimatePresence>
                    {mode === 'signup' && (
                      <motion.div
                        key="confirm-password"
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        transition={{ duration: 0.2 }}
                        className="relative overflow-hidden"
                      >
                        <Input
                          placeholder="Confirm password"
                          className="ps-9 pe-10"
                          type={showConfirmPassword ? 'text' : 'password'}
                          value={confirmPassword}
                          onChange={(e) => setConfirmPassword(e.target.value)}
                          required={mode === 'signup'}
                          disabled={loading}
                        />
                        <div className="text-muted-foreground pointer-events-none absolute inset-y-0 start-0 flex items-center justify-center ps-3">
                          <LockIcon className="size-4" aria-hidden="true" />
                        </div>
                        <button
                          type="button"
                          onClick={() =>
                            setShowConfirmPassword(!showConfirmPassword)
                          }
                          className="text-muted-foreground absolute inset-y-0 end-0 flex items-center justify-center pe-3 hover:text-foreground transition-colors"
                          tabIndex={-1}
                        >
                          {showConfirmPassword ? (
                            <EyeOffIcon className="size-4" />
                          ) : (
                            <EyeIcon className="size-4" />
                          )}
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>

                  {mode === 'signin' && (
                    <div className="flex justify-end">
                      <Link
                        href="/reset-password"
                        className="text-muted-foreground text-xs hover:text-foreground transition-colors"
                      >
                        Forgot password?
                      </Link>
                    </div>
                  )}

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full"
                    disabled={loading}
                  >
                    {loading
                      ? mode === 'signin'
                        ? 'Signing in…'
                        : 'Creating account…'
                      : mode === 'signin'
                      ? 'Sign In'
                      : 'Create Account'}
                  </Button>
                </form>

                <p className="text-muted-foreground text-xs text-center">
                  By continuing, you agree to our{' '}
                  <Link
                    href="#"
                    className="hover:text-primary underline underline-offset-4"
                  >
                    Terms of Service
                  </Link>{' '}
                  and{' '}
                  <Link
                    href="#"
                    className="hover:text-primary underline underline-offset-4"
                  >
                    Privacy Policy
                  </Link>
                  .
                </p>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </main>
  );
}
