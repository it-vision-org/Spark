"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import { toast } from "react-hot-toast";
import BackButton from "@/components/ui/BackButton";
import { PhoneNumberInput } from "@/components/ui/PhoneNumberInput";

export default function SignupPage() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
    phoneNumber: "",
    countryCode: "+216",
    userType: "STUDENT",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { countryCode, ...rest } = formData;
      const payload = {
        ...rest,
        phoneNumber: formData.phoneNumber
          ? `${countryCode} ${formData.phoneNumber}`.trim()
          : "",
      };
      const response = await fetch("/api/auth/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || "Registration failed");
      }

      toast.success("Account created successfully! Redirecting to login...");
      setTimeout(() => {
        router.push("/auth/login");
      }, 1500);
    } catch (error: any) {
      toast.error(error.message || "An error occurred during registration");
    } finally {
      setIsLoading(false);
    }
  };

  const userTypeOptions = [
    { value: "STUDENT", label: "Student", icon: "🎓", desc: "I'm here to learn & share" },
    { value: "TEACHER", label: "Teacher", icon: "📚", desc: "I guide & inspire" },
    { value: "PARENT", label: "Parent", icon: "🏠", desc: "I support & engage" },
  ];

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
          <div className="fixed top-28.5 text-center px-12 text-white">
            {/* Spark Icon */}
            <div 
              className="w-20 h-20 mx-auto mb-8 rounded-3xl flex items-center justify-center animate-glow"
              style={{
                background: 'rgba(255, 255, 255, 0.2)',
                backdropFilter: 'blur(10px)',
                border: '1px solid rgba(255, 255, 255, 0.3)'
              }}
            >
              <svg className="w-10 h-10 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path d="M7,2V13H10V22L17,10H13L17,2H7Z" />
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
              Wake Up<br />And Spark
            </h1>

            {/* Subtitle */}
            <p className="text-lg opacity-90 leading-relaxed max-w-xs mx-auto">
              A community where students, teachers, and parents grow together through shared wisdom.
            </p>

            {/* Features List */}
            <div className="mt-10 text-left max-w-[280px] mx-auto space-y-3">
              {[
                'Share thoughts & moral lessons',
                'Post anonymously if you prefer',
                'Discover inspiring books & articles',
                'Join events & community meetings'
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
            className="absolute -top-[30% w-[500px] h-[500px] rounded-full"
            style={{
              background: 'radial-gradient(circle, rgba(59, 130, 246, 0.08) 0%, transparent 70%)'
              /* Orange: radial-gradient(circle, rgba(251, 146, 60, 0.08) 0%, transparent 70%) */
            }}
          />

          {/* Back Button (Mobile Only) */}
          <div className="absolute top-6 left-6 z-20 lg:hidden">
            <BackButton 
              color="var(--color-primary-600)" /* Orange: #ea580c */
              path="/" 
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
                <svg className="w-6 h-6 fill-white" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M7,2V13H10V22L17,10H13L17,2H7Z" />
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
              Join Our Community
            </h2>
            <p 
              className="text-[0.95rem] mb-7"
              style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}
            >
              Start your journey of growth and inspiration
            </p>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-[1.1rem]">
              {/* Full Name */}
              <div className="animate-field-in delay-100">
                <label 
                  htmlFor="name" 
                  className="block text-[0.85rem] font-semibold mb-[0.4rem]"
                  style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                >
                  Full Name
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
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                    <circle cx="12" cy="7" r="4" />
                  </svg>
                  <input
                    id="name"
                    name="name"
                    type="text"
                    required
                    className="w-full py-[0.85rem] pl-11 pr-4 rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none"
                    style={{
                      border: '2px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                      color: 'var(--color-neutral-900)' /* Orange: #292524 */
                    }}
                    placeholder="Enter your full name"
                    value={formData.name}
                    onChange={handleChange}
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
              </div>

              {/* Email */}
              <div className="animate-field-in delay-150">
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
                    value={formData.email}
                    onChange={handleChange}
                    onFocus={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-400)';
                      e.target.style.boxShadow = '0 0 0 4px rgba(59, 130, 246, 0.1)';
                    }}
                    onBlur={(e) => {
                      e.target.style.borderColor = 'var(--color-primary-100)';
                      e.target.style.boxShadow = 'none';
                    }}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="animate-field-in delay-200">
                <label 
                  htmlFor="password" 
                  className="block text-[0.85rem] font-semibold mb-[0.4rem]"
                  style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                >
                  Password
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
                    autoComplete="new-password"
                    required
                    className="w-full py-[0.85rem] pl-11 pr-11 rounded-xl text-[0.95rem] bg-white transition-all duration-300 outline-none"
                    style={{
                      border: '2px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                      color: 'var(--color-neutral-900)' /* Orange: #292524 */
                    }}
                    placeholder="Create a strong password"
                    value={formData.password}
                    onChange={handleChange}
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
                <p 
                  className="text-xs mt-[0.35rem]"
                  style={{ color: 'var(--color-neutral-500)' /* Orange: #78716c */ }}
                >
                  Must be at least 8 characters
                </p>
              </div>

              {/* Phone Number */}
              <div className="animate-field-in delay-250">
              <PhoneNumberInput 
                formData={formData} 
                setFormData={setFormData} 
              />
              </div>

              {/* User Type */}
              <div className="animate-field-in delay-300">
                <label 
                  className="block text-[0.85rem] font-semibold mb-[0.4rem]"
                  style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                >
                  I am a
                </label>
                <div className="grid grid-cols-3 gap-3">
                  {userTypeOptions.map((opt) => (
                    <label key={opt.value} className="relative cursor-pointer">
                      <input
                        type="radio"
                        name="userType"
                        value={opt.value}
                        checked={formData.userType === opt.value}
                        onChange={handleChange}
                        className="absolute opacity-0 w-0 h-0"
                      />
                      <div 
                        className={`flex flex-col items-center py-4 px-2 rounded-2xl bg-white transition-all duration-300 text-center ${
                          formData.userType === opt.value 
                            ? 'shadow-lg -translate-y-0.5' 
                            : 'hover:-translate-y-0.5'
                        }`}
                        style={{
                          border: formData.userType === opt.value 
                            ? '2px solid var(--color-primary-500)' /* Orange: #f97316 */
                            : '2px solid var(--color-primary-100)', /* Orange: #ffedd5 */
                          background: formData.userType === opt.value 
                            ? 'linear-gradient(135deg, var(--color-primary-50), var(--color-primary-100))' /* Orange: linear-gradient(135deg, #fff7ed, #ffedd5) */
                            : 'white',
                          boxShadow: formData.userType === opt.value 
                            ? '0 4px 16px rgba(59, 130, 246, 0.15)' /* Orange: rgba(251, 146, 60, 0.15) */
                            : 'none'
                        }}
                      >
                        <span className="text-[1.75rem] mb-[0.4rem]">{opt.icon}</span>
                        <span 
                          className="text-[0.85rem] font-semibold"
                          style={{ color: 'var(--color-neutral-700)' /* Orange: #44403c */ }}
                        >
                          {opt.label}
                        </span>
                        <span 
                          className="text-[0.65rem] mt-[0.2rem] leading-tight"
                          style={{ color: 'var(--color-neutral-500)' /* Orange: #78716c */ }}
                        >
                          {opt.desc}
                        </span>
                      </div>
                    </label>
                  ))}
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isLoading}
                className="w-full py-[0.95rem] rounded-xl font-semibold text-white transition-all duration-300 mt-2 disabled:opacity-55 disabled:cursor-not-allowed"
                style={{
                  background: 'linear-gradient(135deg, var(--color-primary-500) 0%, var(--color-accent-400) 100%)',
                  /* Orange: linear-gradient(135deg, #f97316 0%, #fbbf24 100%) */
                  boxShadow: '0 4px 16px rgba(59, 130, 246, 0.25)'
                  /* Orange: 0 4px 16px rgba(251, 146, 60, 0.25) */
                }}
                onMouseEnter={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(-2px)', e.currentTarget.style.boxShadow = '0 8px 24px rgba(59, 130, 246, 0.35)' /* Orange: rgba(251, 146, 60, 0.35) */)}
                onMouseLeave={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)', e.currentTarget.style.boxShadow = '0 4px 16px rgba(59, 130, 246, 0.25)')}
                onMouseDown={(e) => !isLoading && (e.currentTarget.style.transform = 'translateY(0)')}
              >
                {isLoading ? (
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
                    Creating your account...
                  </span>
                ) : (
                  "Create Account"
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
            <div 
              className="text-center text-[0.9rem]"
              style={{ color: 'var(--color-neutral-600)' /* Orange: #57534e */ }}
            >
              Already have an account?{" "}
              <Link 
                href="/auth/login"
                className="font-semibold relative inline-block transition-colors duration-200 group"
                style={{ color: 'var(--color-primary-600)' /* Orange: #ea580c */ }}
                onMouseEnter={(e) => e.currentTarget.style.color = 'var(--color-primary-700)'}
                onMouseLeave={(e) => e.currentTarget.style.color = 'var(--color-primary-600)'}
              >
                Sign in
                <span 
                  className="absolute left-0 bottom-0 h-0.5 w-0 transition-all duration-300 group-hover:w-full"
                  style={{
                    background: 'linear-gradient(90deg, var(--color-primary-500), var(--color-accent-400))'
                    /* Orange: linear-gradient(90deg, #f97316, #fbbf24) */
                  }}
                />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
