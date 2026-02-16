"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/auth/forgetPassword", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });

      const result = await response.json();

      if (response.ok) {
        toast.success(
          "Password reset email sent successfully! Please check your inbox."
        );
        // setTimeout(() => router.push("/auth/login"), 2000);
      } else {
        toast.error(result.message || "Failed to send password reset email");
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
            {/* Lock Icon */}
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
                <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
              Reset Your<br />Password
            </h1>

            {/* Subtitle */}
            <p className="text-lg opacity-90 leading-relaxed max-w-xs mx-auto">
              No worries! Enter your email and we'll send you instructions to reset your password.
            </p>

            {/* Features List */}
            <div className="mt-10 text-left max-w-[280px] mx-auto space-y-3">
              {[
                'Secure password reset process',
                'Email sent within minutes',
                'Link valid for 24 hours',
                'Get back to inspiring others'
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
                  <rect width="18" height="11" x="3" y="11" rx="2" ry="2" />
                  <path d="M7 11V7a5 5 0 0 1 10 0v4" />
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
              Forgot Password
            </h2>
            <p 
              className="text-[0.95rem] mb-7"
              style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}
            >
              Enter your email to receive a password reset link
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
              {/* Email */}
              <div className="animate-field-in delay-100">
                <label 
                  htmlFor="email" 
                  className="block text-[0.85rem] font-semibold mb-[0.4rem]"
                  style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                >
                  Email Address
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
                    <rect width="20" height="16" x="2" y="4" rx="2" />
                    <path d="m22 7-8.97 5.7a1.94 1.94 0 0 1-2.06 0L2 7" />
                  </svg>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    className="w-full py-[0.85rem] pl-11 pr-4 rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none"
                    style={{
                      border: '2px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                      color: 'var(--color-neutral-900)' /* Orange: #292524 */
                    }}
                    placeholder="your.email@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-400)'; /* Orange: #fb923c */
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)'; /* Orange: rgba(251, 146, 60, 0.1) */
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-100)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
                <p 
                  className="mt-2 text-xs flex items-start gap-1"
                  style={{ color: 'var(--color-neutral-500)' /* Orange: #78716c */ }}
                >
                  <svg 
                    className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" 
                    viewBox="0 0 24 24" 
                    fill="none" 
                    stroke="currentColor" 
                    strokeWidth="2" 
                    strokeLinecap="round" 
                    strokeLinejoin="round"
                    style={{ color: 'var(--color-primary-600)' /* Orange: #ea580c */ }}
                  >
                    <circle cx="12" cy="12" r="10" />
                    <line x1="12" y1="16" x2="12" y2="12" />
                    <line x1="12" y1="8" x2="12.01" y2="8" />
                  </svg>
                  <span>We'll send a recovery link to this email address</span>
                </p>
              </div>

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
                    Sending...
                  </span>
                ) : (
                  "Send Reset Link"
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

            {/* Help Text */}
            <div 
              className="mt-8 p-4 rounded-xl text-sm"
              style={{ 
                background: 'var(--color-accent-50)', /* Orange: #fffbeb */
                border: '1px solid var(--color-accent-200)' /* Orange: #fde68a */
              }}
            >
              <div className="flex gap-3">
                <svg 
                  className="w-5 h-5 flex-shrink-0 mt-0.5" 
                  viewBox="0 0 24 24" 
                  fill="none" 
                  stroke="currentColor" 
                  strokeWidth="2" 
                  strokeLinecap="round" 
                  strokeLinejoin="round"
                  style={{ color: 'var(--color-accent-600)' /* Orange: #d97706 */ }}
                >
                  <path d="m21.73 18-8-14a2 2 0 0 0-3.48 0l-8 14A2 2 0 0 0 4 21h16a2 2 0 0 0 1.73-3Z" />
                  <line x1="12" y1="9" x2="12" y2="13" />
                  <line x1="12" y1="17" x2="12.01" y2="17" />
                </svg>
                <div>
                  <p 
                    className="font-semibold mb-1"
                    style={{ color: 'var(--color-neutral-800)' /* Orange: #292524 */ }}
                  >
                    Didn't receive the email?
                  </p>
                  <p style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}>
                    Check your spam folder or wait a few minutes before trying again.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}