"use client";

import { useState, Suspense } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";

function ResetPasswordForm() {
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const searchParams = useSearchParams();
  const token = searchParams.get("token");
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    if (password !== confirmPassword) {
      toast.error("Passwords do not match");
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await fetch("/api/auth/resetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token, password }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success("Password reset successfully!");
        setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(result.message || "Failed to reset password");
      }
    } catch (error) {
      toast.error("An error occurred. Please try again later.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <>
      <div className="min-h-screen flex relative overflow-hidden" style={{ fontFamily: 'Inter, sans-serif' }}>
        {/* ═══════════════════════════════════════════════════════════
            LEFT PANEL (Desktop Only) 
        ═══════════════════════════════════════════════════════════ */}
        <div 
          className="hidden lg:flex lg:w-[42%] relative overflow-hidden items-center justify-center flex-col"
          style={{
            background: 'linear-gradient(160deg, var(--color-primary-600) 0%, var(--color-primary-500) 40%, var(--color-accent-400) 100%)' 
            /* Orange: linear-gradient(160deg, #ea580c 0%, #f97316 40%, #fbbf24 100%) */
          }}
        >
          {/* Floating Orb 1 */}
          <div 
            className="absolute -top-[20%] -right-[20%] w-[500px] h-[500px] rounded-full animate-drift"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.12) 0%, transparent 70%)'
            }}
          />
          
          {/* Floating Orb 2 */}
          <div 
            className="absolute -bottom-[15%] -left-[10%] w-[400px] h-[400px] rounded-full animate-drift-reverse"
            style={{
              background: 'radial-gradient(circle, rgba(255, 255, 255, 0.08) 0%, transparent 70%)'
            }}
          />

          {/* Panel Content */}
          <div className="relative z-10 text-center px-12 text-white">
            {/* Shield Check Icon */}
            <div 
              className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center animate-glow"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <svg 
                className="w-10 h-10 stroke-white" 
                viewBox="0 0 24 24" 
                fill="none" 
                strokeWidth="2" 
                strokeLinecap="round" 
                strokeLinejoin="round"
              >
                <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                <path d="m9 12 2 2 4-4" />
              </svg>
            </div>

            {/* Title */}
            <h1 
              className="text-5xl font-bold leading-tight mb-4"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                textShadow: '0 2px 10px rgba(0, 0, 0, 0.1)'
              }}
            >
              Create New<br />Password
            </h1>

            {/* Subtitle */}
            <p className="text-lg opacity-90 leading-relaxed max-w-xs mx-auto">
              Choose a strong password to secure your account and protect your personal information.
            </p>

            {/* Features List */}
            <div className="mt-10 text-left max-w-[280px] mx-auto space-y-3">
              {[
                'Use at least 8 characters',
                'Mix letters, numbers & symbols',
                'Avoid common passwords',
                'Keep it unique and secure'
              ].map((feature, idx) => (
                <div key={idx} className="flex items-center gap-3 opacity-90">
                  <span className="w-2 h-2 rounded-full bg-white flex-shrink-0" />
                  <span className="text-[0.95rem]">{feature}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════
            RIGHT FORM AREA 
        ═══════════════════════════════════════════════════════════ */}
        <div 
          className="flex-1 flex items-center justify-center relative overflow-y-auto px-8 py-8"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-accent-50) 50%, var(--color-primary-50) 100%)'
            /* Orange: linear-gradient(135deg, #fffaf5 0%, #fff5eb 50%, #fff9f3 100%) */
          }}
        >
          {/* Background Orb */}
          <div 
            className="absolute -top-[30%] w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
              /* Orange: radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, transparent 70%) */
            }}
          />

          {/* Back Button (Mobile Only) */}
          <div className="absolute top-6 left-6 z-20 lg:hidden">
            <BackButton 
              color="var(--color-primary-600)" /* Orange: #ea580c */
              path="/auth/login" 
            />
          </div>

          {/* Form Card */}
          <div className="w-full max-w-[480px] relative z-10 animate-card-in py-4">
            {/* Mobile Logo (Mobile Only) */}
            <div className="flex items-center gap-3 mb-6 lg:hidden">
              <div 
                className="w-11 h-11 rounded-xl flex items-center justify-center shadow-lg"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary-500), var(--color-accent-400))'
                  /* Orange: linear-gradient(135deg, #f97316, #fbbf24) */
                }}
              >
                <svg 
                  className="w-6 h-6 stroke-white" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                  <path d="m9 12 2 2 4-4" />
                </svg>
              </div>
              <span 
                className="text-xl font-bold bg-clip-text text-transparent"
                style={{ 
                  fontFamily: 'Playfair Display, serif',
                  background: 'linear-gradient(135deg, var(--color-primary-700), var(--color-primary-600))',
                  WebkitBackgroundClip: 'text',
                  WebkitTextFillColor: 'transparent'
                  /* Orange: linear-gradient(135deg, #c2410c, #ea580c) */
                }}
              >
                Wake Up & Spark
              </span>
            </div>

            {/* Heading */}
            <h2 
              className="text-3xl font-bold mb-2"
              style={{ 
                fontFamily: 'Playfair Display, serif',
                color: 'var(--color-neutral-900)' /* Orange: #292524 */
              }}
            >
              Reset Password
            </h2>
            <p 
              className="text-[0.95rem] mb-7"
              style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}
            >
              Create a new password for your account
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
              {/* New Password */}
              <div className="animate-field-in delay-100">
                <label 
                  htmlFor="password" 
                  className="block text-[0.85rem] font-semibold mb-[0.4rem]"
                  style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                >
                  New Password
                </label>
                <div className="relative">
                  <svg 
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" 
                    style={{ color: 'var(--color-neutral-400)' /* Orange: #a8a29e */ }}
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                  </svg>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? "text" : "password"}
                    required
                    className="w-full py-[0.85rem] pl-11 pr-11 rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none"
                    style={{
                      border: '2px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                      color: 'var(--color-neutral-900)' /* Orange: #292524 */
                    }}
                    placeholder="Enter new password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-400)'; /* Orange: #fb923c */
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'; /* Orange: rgba(251, 146, 60, 0.1) */
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-100)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer transition-colors duration-200"
                    style={{ color: 'var(--color-neutral-400)' /* Orange: #a8a29e */ }}
                    onClick={() => setShowPassword(!showPassword)}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-neutral-600)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-neutral-400)'}
                    aria-label="Toggle password visibility"
                  >
                    {showPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Confirm Password */}
              <div className="animate-field-in delay-150">
                <label 
                  htmlFor="confirmPassword" 
                  className="block text-[0.85rem] font-semibold mb-[0.4rem]"
                  style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                >
                  Confirm Password
                </label>
                <div className="relative">
                  <svg 
                    className="absolute left-4 top-1/2 -translate-y-1/2 pointer-events-none" 
                    style={{ color: 'var(--color-neutral-400)' /* Orange: #a8a29e */ }}
                    width="18" 
                    height="18" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                  >
                    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
                    <path d="m9 12 2 2 4-4" />
                  </svg>
                  <input
                    id="confirmPassword"
                    name="confirmPassword"
                    type={showConfirmPassword ? "text" : "password"}
                    required
                    className="w-full py-[0.85rem] pl-11 pr-11 rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none"
                    style={{
                      border: '2px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                      color: 'var(--color-neutral-900)' /* Orange: #292524 */
                    }}
                    placeholder="Confirm new password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-400)';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-100)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                  <button 
                    type="button" 
                    className="absolute right-4 top-1/2 -translate-y-1/2 p-0 bg-transparent border-none cursor-pointer transition-colors duration-200"
                    style={{ color: 'var(--color-neutral-400)' /* Orange: #a8a29e */ }}
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-neutral-600)'}
                    onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-neutral-400)'}
                    aria-label="Toggle confirm password visibility"
                  >
                    {showConfirmPassword ? (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94" />
                        <path d="M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19" />
                        <line x1="1" y1="1" x2="23" y2="23" />
                      </svg>
                    ) : (
                      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                        <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z" />
                        <circle cx="12" cy="12" r="3" />
                      </svg>
                    )}
                  </button>
                </div>
                <p 
                  className="mt-2 text-xs flex items-start gap-1"
                  style={{ color: 'var(--color-neutral-500)' /* Orange: #78716c */ }}
                >
                  <span style={{ color: 'var(--color-primary-600)' /* Orange: #ea580c */ }}>*</span>
                  <span>Passwords must match</span>
                </p>
              </div>

              {/* Password Strength Indicator */}
              {password && (
                <div className="animate-field-in delay-200">
                  <div className="flex items-center justify-between mb-2">
                    <span 
                      className="text-xs font-semibold"
                      style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}
                    >
                      Password Strength
                    </span>
                    <span 
                      className="text-xs font-semibold"
                      style={{ 
                        color: password.length >= 8 
                          ? 'var(--color-success-500)' 
                          : 'var(--color-neutral-400)'
                      }}
                    >
                      {password.length >= 8 ? 'Strong' : 'Weak'}
                    </span>
                  </div>
                  <div 
                    className="h-2 rounded-full overflow-hidden"
                    style={{ background: 'var(--color-neutral-200)' /* Orange: #e7e5e4 */ }}
                  >
                    <div 
                      className="h-full transition-all duration-300 rounded-full"
                      style={{ 
                        width: `${Math.min((password.length / 12) * 100, 100)}%`,
                        background: password.length >= 8 
                          ? 'linear-gradient(90deg, var(--color-success-500), var(--color-accent-400))'
                          : 'linear-gradient(90deg, var(--color-primary-400), var(--color-primary-600))'
                      }}
                    />
                  </div>
                </div>
              )}

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-[0.95rem] rounded-xl font-semibold text-white transition-all duration-300 mt-4 disabled:opacity-55 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 100%)',
                  /* Orange: linear-gradient(135deg, #f97316 0%, #fbbf24 100%) */
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)'
                  /* Orange: 0 4px 16px rgba(251, 146, 60, 0.25) */
                }}
                onMouseEnter={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.35)' /* Orange: rgba(251, 146, 60, 0.35) */)}
                onMouseLeave={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.25)')}
                onMouseDown={(e) => !isSubmitting && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isSubmitting ? (
                  <span className="flex items-center justify-center gap-2">
                    <svg width="20" height="20" viewBox="0 0 24 24" className="animate-spin">
                      <circle 
                        cx="12" 
                        cy="12" 
                        r="10" 
                        stroke="white" 
                        strokeWidth="3" 
                        fill="none" 
                        strokeDasharray="31.4 31.4" 
                        strokeLinecap="round" 
                      />
                    </svg>
                    Resetting...
                  </span>
                ) : (
                  "Reset Password"
                )}
              </button>
            </form>

            {/* Divider */}
            <div className="flex items-center gap-4 my-6">
              <div 
                className="flex-1 h-px"
                style={{ background: 'var(--color-primary-200)' /* Orange: #fed7aa */ }}
              />
              <span 
                className="text-xs"
                style={{ color: 'var(--color-neutral-400)' /* Orange: #a8a29e */ }}
              >
                or
              </span>
              <div 
                className="flex-1 h-px"
                style={{ background: 'var(--color-primary-200)' /* Orange: #fed7aa */ }}
              />
            </div>

            {/* Footer Link */}
            <div className="text-center">
              <button
                type="button"
                onClick={() => router.push("/auth/login")}
                className="text-[0.9rem] font-semibold relative inline-block transition-colors duration-200 group"
                style={{ color: 'var(--color-primary-600)' /* Orange: #ea580c */ }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-700)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
              >
                <svg 
                  className="inline-block w-4 h-4 mr-2 -mt-0.5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                >
                  <line x1="19" y1="12" x2="5" y2="12" />
                  <polyline points="12 19 5 12 12 5" />
                </svg>
                Back to login
                <span 
                  className="absolute left-0 bottom-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-accent-400))'
                    /* Orange: linear-gradient(90deg, #f97316, #fbbf24) */
                  }}
                />
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

// Main component that wraps the form in Suspense
export default function ResetPasswordPage() {
  return (
    <Suspense
      fallback={
        <div 
          className="flex min-h-screen items-center justify-center"
          style={{
            background: 'linear-gradient(135deg, var(--color-primary-50) 0%, var(--color-accent-50) 50%, var(--color-primary-50) 100%)'
            /* Orange: linear-gradient(135deg, #fffaf5 0%, #fff5eb 50%, #fff9f3 100%) */
          }}
        >
          <div className="text-center">
            <div 
              className="w-16 h-16 mx-auto mb-4 rounded-full animate-spin"
              style={{
                border: '3px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                borderTopColor: 'var(--color-primary-600)' /* Orange: #ea580c */
              }}
            />
            <p 
              className="text-sm font-medium"
              style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}
            >
              Loading...
            </p>
          </div>
        </div>
      }
    >
      <ResetPasswordForm />
    </Suspense>
  );
}