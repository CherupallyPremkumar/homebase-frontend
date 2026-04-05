'use client';

import { useState } from 'react';
import Link from 'next/link';
import {
  Eye,
  EyeOff,
  Mail,
  Lock,
  User,
  Phone,
  ShieldCheck,
  Package,
  RefreshCw,
  Home,
} from 'lucide-react';

// ---------------------------------------------------------------------------
// Password strength helper
// ---------------------------------------------------------------------------
function getPasswordStrength(password: string): { level: number; label: string; color: string } {
  if (!password) return { level: 0, label: '', color: '' };
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password) && /[a-z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  if (password.length >= 12) score++;

  if (score <= 2) return { level: 1, label: 'Weak', color: 'bg-red-500' };
  if (score <= 3) return { level: 2, label: 'Medium', color: 'bg-yellow-500' };
  return { level: 3, label: 'Strong', color: 'bg-green-500' };
}

// ---------------------------------------------------------------------------
// Google SVG icon (inline because it needs multi-color paths)
// ---------------------------------------------------------------------------
function GoogleIcon() {
  return (
    <svg className="w-5 h-5" viewBox="0 0 24 24">
      <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92a5.06 5.06 0 01-2.2 3.32v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.1z" fill="#4285F4" />
      <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853" />
      <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05" />
      <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335" />
    </svg>
  );
}

// ---------------------------------------------------------------------------
// LoginPage
// ---------------------------------------------------------------------------
export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<'login' | 'register'>('login');

  // Login state
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  const [showLoginPw, setShowLoginPw] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  // Register state
  const [regName, setRegName] = useState('');
  const [regEmail, setRegEmail] = useState('');
  const [regPhone, setRegPhone] = useState('');
  const [regPassword, setRegPassword] = useState('');
  const [regConfirm, setRegConfirm] = useState('');
  const [showRegPw, setShowRegPw] = useState(false);
  const [showConfirmPw, setShowConfirmPw] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);

  const strength = getPasswordStrength(regPassword);
  const passwordsMatch = regConfirm.length > 0 && regPassword === regConfirm;
  const passwordsMismatch = regConfirm.length > 0 && regPassword !== regConfirm;

  function handleLogin(e: React.FormEvent) {
    e.preventDefault();
    alert(`Mock login: ${loginEmail}`);
  }

  function handleRegister(e: React.FormEvent) {
    e.preventDefault();
    alert(`Mock register: ${regName} (${regEmail})`);
  }

  // Trust points for left panel
  const trustPoints = [
    { icon: Package, title: 'Millions of Products', desc: 'From trusted sellers nationwide' },
    { icon: ShieldCheck, title: 'Secure Payments', desc: '256-bit SSL encryption' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day money back guarantee' },
  ];

  return (
    <div className="flex-1 flex items-center justify-center py-10 px-4 bg-gray-50 min-h-[600px]">
      <div className="w-full max-w-5xl bg-white rounded-2xl shadow-lg overflow-hidden flex min-h-[600px]">
        {/* ---- Left Side: Brand Panel ---- */}
        <div className="hidden lg:flex lg:w-5/12 relative flex-col items-center justify-center p-10 text-white bg-gradient-to-br from-[#0F1B2D] to-[#1E3A5F]">
          {/* Decorative circles */}
          <div className="absolute right-0 top-0 w-64 h-64 bg-brand-500/10 rounded-full -translate-y-1/3 translate-x-1/3" />
          <div className="absolute left-0 bottom-0 w-48 h-48 bg-brand-400/10 rounded-full translate-y-1/4 -translate-x-1/4" />
          <div className="absolute right-10 bottom-20 w-32 h-32 bg-white/5 rounded-full" />

          <div className="relative z-10 text-center">
            <div className="w-16 h-16 rounded-2xl bg-brand-500 flex items-center justify-center mx-auto mb-6 shadow-lg">
              <Home className="w-9 h-9 text-white" />
            </div>
            <h2 className="text-2xl font-extrabold mb-2">
              Home<span className="text-brand-400">Base</span>
            </h2>
            <p className="text-sm text-gray-300 mb-10">India&apos;s #1 Online Marketplace</p>

            <div className="space-y-5 text-left max-w-xs mx-auto">
              {trustPoints.map((tp) => {
                const Icon = tp.icon;
                return (
                  <div key={tp.title} className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-sm flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-brand-400" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold">{tp.title}</p>
                      <p className="text-xs text-gray-400">{tp.desc}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

        {/* ---- Right Side: Auth Form ---- */}
        <div className="w-full lg:w-7/12 p-8 sm:p-10 flex flex-col justify-center">
          {/* Mobile brand heading */}
          <div className="lg:hidden text-center mb-6">
            <h2 className="text-lg font-bold text-navy-900">
              Welcome to Home<span className="text-brand-500">Base</span>
            </h2>
            <p className="text-sm text-gray-500">India&apos;s #1 Online Marketplace</p>
          </div>

          {/* Tabs */}
          <div className="flex border-b border-gray-200 mb-8">
            <button
              onClick={() => setActiveTab('login')}
              className={`pb-3 px-1 mr-8 text-sm font-semibold cursor-pointer border-b-2 transition-colors ${
                activeTab === 'login'
                  ? 'text-brand-500 border-brand-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Sign In
            </button>
            <button
              onClick={() => setActiveTab('register')}
              className={`pb-3 px-1 text-sm font-semibold cursor-pointer border-b-2 transition-colors ${
                activeTab === 'register'
                  ? 'text-brand-500 border-brand-500'
                  : 'text-gray-500 border-transparent hover:text-gray-700'
              }`}
            >
              Create Account
            </button>
          </div>

          {/* ========== LOGIN FORM ========== */}
          {activeTab === 'login' && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
              <h3 className="text-xl font-bold text-navy-900 mb-1">Welcome back</h3>
              <p className="text-sm text-gray-500 mb-6">Sign in to your HomeBase account</p>

              <form onSubmit={handleLogin} className="space-y-4">
                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 text-gray-400"><Mail className="w-5 h-5" /></span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 text-gray-400"><Lock className="w-5 h-5" /></span>
                    <input
                      type={showLoginPw ? 'text' : 'password'}
                      placeholder="Enter your password"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowLoginPw(!showLoginPw)}
                      className="pr-3.5 text-gray-400 hover:text-gray-600 transition"
                    >
                      {showLoginPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>

                {/* Remember + Forgot */}
                <div className="flex items-center justify-between">
                  <label className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      className="w-4 h-4 rounded border-gray-300 text-brand-500 accent-brand-500"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                    />
                    <span className="text-sm text-gray-600">Remember me</span>
                  </label>
                  <Link href="#" className="text-sm text-brand-500 font-medium hover:text-brand-600 hover:underline">
                    Forgot password?
                  </Link>
                </div>

                {/* Sign In */}
                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all hover:-translate-y-px hover:shadow-md"
                >
                  Sign In
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              {/* Social buttons */}
              <div className="space-y-3">
                <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition">
                  <GoogleIcon />
                  Sign in with Google
                </button>
                <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-brand-50 hover:border-brand-300 transition">
                  <Phone className="w-5 h-5 text-brand-500" />
                  Sign in with OTP
                </button>
              </div>

              <p className="text-center text-sm text-gray-500 mt-6">
                New to HomeBase?{' '}
                <button onClick={() => setActiveTab('register')} className="text-brand-500 font-semibold hover:text-brand-600 hover:underline cursor-pointer">
                  Create Account
                </button>
              </p>
            </div>
          )}

          {/* ========== REGISTER FORM ========== */}
          {activeTab === 'register' && (
            <div className="animate-in fade-in-0 slide-in-from-bottom-2 duration-200">
              <h3 className="text-xl font-bold text-navy-900 mb-1">Create your account</h3>
              <p className="text-sm text-gray-500 mb-6">Join millions of happy HomeBase shoppers</p>

              <form onSubmit={handleRegister} className="space-y-4">
                {/* Full Name */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Full Name</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 text-gray-400"><User className="w-5 h-5" /></span>
                    <input
                      type="text"
                      placeholder="Enter your full name"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={regName}
                      onChange={(e) => setRegName(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Email */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Email Address</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 text-gray-400"><Mail className="w-5 h-5" /></span>
                    <input
                      type="email"
                      placeholder="you@example.com"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={regEmail}
                      onChange={(e) => setRegEmail(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Phone */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Phone Number</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 pr-2 text-sm font-medium text-gray-500 border-r border-gray-200 flex items-center gap-1.5 shrink-0">
                      <Phone className="w-4 h-4 text-gray-400" />
                      +91
                    </span>
                    <input
                      type="tel"
                      placeholder="Enter your phone number"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={regPhone}
                      onChange={(e) => setRegPhone(e.target.value)}
                      required
                    />
                  </div>
                </div>

                {/* Password with strength */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Password</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 text-gray-400"><Lock className="w-5 h-5" /></span>
                    <input
                      type={showRegPw ? 'text' : 'password'}
                      placeholder="Create a password"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={regPassword}
                      onChange={(e) => setRegPassword(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowRegPw(!showRegPw)} className="pr-3.5 text-gray-400 hover:text-gray-600 transition">
                      {showRegPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {regPassword.length > 0 && (
                    <div className="mt-2">
                      <div className="flex gap-1.5 mb-1">
                        {[1, 2, 3].map((i) => (
                          <div key={i} className="h-1 flex-1 rounded-full bg-gray-200 overflow-hidden">
                            <div
                              className={`h-full rounded-full transition-all duration-300 ${strength.level >= i ? strength.color : ''}`}
                              style={{ width: strength.level >= i ? '100%' : '0%' }}
                            />
                          </div>
                        ))}
                      </div>
                      <p className={`text-xs font-medium ${
                        strength.level === 1 ? 'text-red-500' : strength.level === 2 ? 'text-yellow-500' : 'text-green-500'
                      }`}>
                        {strength.label}
                      </p>
                    </div>
                  )}
                </div>

                {/* Confirm Password */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1.5">Confirm Password</label>
                  <div className="flex items-center border border-gray-200 rounded-lg overflow-hidden bg-white focus-within:border-brand-500 focus-within:ring-1 focus-within:ring-brand-200 transition">
                    <span className="pl-3.5 text-gray-400"><Lock className="w-5 h-5" /></span>
                    <input
                      type={showConfirmPw ? 'text' : 'password'}
                      placeholder="Confirm your password"
                      className="flex-1 py-2.5 px-3 text-sm outline-none bg-transparent"
                      value={regConfirm}
                      onChange={(e) => setRegConfirm(e.target.value)}
                      required
                    />
                    <button type="button" onClick={() => setShowConfirmPw(!showConfirmPw)} className="pr-3.5 text-gray-400 hover:text-gray-600 transition">
                      {showConfirmPw ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                  {passwordsMatch && <p className="text-xs mt-1 text-green-500">Passwords match</p>}
                  {passwordsMismatch && <p className="text-xs mt-1 text-red-500">Passwords do not match</p>}
                </div>

                {/* Terms */}
                <div className="flex items-start gap-2">
                  <input
                    type="checkbox"
                    className="w-4 h-4 mt-0.5 rounded border-gray-300 text-brand-500 accent-brand-500"
                    checked={termsAccepted}
                    onChange={(e) => setTermsAccepted(e.target.checked)}
                    required
                  />
                  <span className="text-sm text-gray-600 leading-relaxed">
                    I agree to the{' '}
                    <Link href="#" className="text-brand-500 font-medium hover:underline">Terms of Service</Link> and{' '}
                    <Link href="#" className="text-brand-500 font-medium hover:underline">Privacy Policy</Link>
                  </span>
                </div>

                {/* Create Account */}
                <button
                  type="submit"
                  className="w-full bg-brand-500 hover:bg-brand-600 active:bg-brand-700 text-white font-semibold py-2.5 rounded-lg text-sm transition-all hover:-translate-y-px hover:shadow-md"
                >
                  Create Account
                </button>
              </form>

              {/* Divider */}
              <div className="flex items-center gap-4 my-6">
                <div className="flex-1 h-px bg-gray-200" />
                <span className="text-xs text-gray-400 font-medium uppercase">or</span>
                <div className="flex-1 h-px bg-gray-200" />
              </div>

              <button className="w-full flex items-center justify-center gap-3 border border-gray-200 rounded-lg py-2.5 text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-300 transition">
                <GoogleIcon />
                Sign up with Google
              </button>

              <p className="text-center text-sm text-gray-500 mt-6">
                Already have an account?{' '}
                <button onClick={() => setActiveTab('login')} className="text-brand-500 font-semibold hover:text-brand-600 hover:underline cursor-pointer">
                  Sign In
                </button>
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
