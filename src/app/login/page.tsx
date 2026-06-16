"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { useStore } from "@/store/useStore";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { 
  LogIn, 
  UserPlus, 
  LogOut, 
  CheckCircle, 
  AlertCircle, 
  Sparkles, 
  Mail, 
  Lock, 
  User, 
  ArrowLeft, 
  Home,
  Phone
} from "lucide-react";
import { FaGoogle, FaApple, FaFacebookF } from "react-icons/fa";
import "./Login.scss";

// Validation schemas using Zod
const loginSchema = z.object({
  email: z.string().email("Please enter a valid email address"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  rememberMe: z.boolean().optional(),
});

const signupSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Please enter a valid email address"),
  mobileNumber: z.string().min(10, "Mobile number must be at least 10 digits"),
  password: z.string().min(6, "Password must be at least 6 characters"),
  confirmPassword: z.string(),
  agreeTerms: z.boolean().refine((val) => val === true, {
    message: "You must agree to the Terms & Conditions",
  }),
}).refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match",
  path: ["confirmPassword"],
});

export default function LoginPage() {
  const [activeTab, setActiveTab] = useState<"login" | "signup">("login");
  const [mounted, setMounted] = useState(false);
  const [successMsg, setSuccessMsg] = useState("");
  const [errorMsg, setErrorMsg] = useState("");

  const user = useStore((state) => state.user);
  const loginAction = useStore((state) => state.login);
  const signupAction = useStore((state) => state.signup);
  const logoutAction = useStore((state) => state.logout);

  const slides = [
    {
      id: 1,
      image: "https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=1200&q=80",
      title: "Varanasi Handlooms",
      subtitle: "Woven in Peeli Kothi",
      description: "Every garment is hand-woven by master craftsmen, carrying forward an unbroken heritage of Indian silk artistry since Peeli Kothi."
    },
    {
      id: 2,
      image: "https://images.unsplash.com/photo-1617627143750-d86bc21e42bb?auto=format&fit=crop&w=1200&q=80",
      title: "100% Pure Silk",
      subtitle: "Atelier Silk Certification",
      description: "We work exclusively with certified pure mulberry silks, organic cottons, and authentic hand-finished zardozi embroidery."
    },
    {
      id: 3,
      image: "https://images.unsplash.com/photo-1618220179428-22790b461013?auto=format&fit=crop&w=1200&q=80",
      title: "Designs of Dreams",
      subtitle: "Timeless Masterpieces",
      description: "Bridging the gap between ancient handloom cultures and contemporary, high-fashion silhouettes."
    }
  ];

  const [currentSlide, setCurrentSlide] = useState(0);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (!mounted) return;
    const slideInterval = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 6000);
    return () => clearInterval(slideInterval);
  }, [mounted]);

  // React Hook Form for Login
  const {
    register: registerLogin,
    handleSubmit: handleLoginSubmit,
    formState: { errors: loginErrors },
    reset: resetLoginForm
  } = useForm({
    resolver: zodResolver(loginSchema)
  });

  // React Hook Form for Signup
  const {
    register: registerSignup,
    handleSubmit: handleSignupSubmit,
    formState: { errors: signupErrors },
    reset: resetSignupForm
  } = useForm({
    resolver: zodResolver(signupSchema)
  });

  const onLogin = (data: any) => {
    setErrorMsg("");
    setSuccessMsg("");
    
    // Simulate API Call
    setTimeout(() => {
      const mockName = data.email.split("@")[0].charAt(0).toUpperCase() + data.email.split("@")[0].slice(1);
      loginAction(data.email, mockName);
      setSuccessMsg(`Welcome back, ${mockName}!`);
      resetLoginForm();
    }, 800);
  };

  const onSignup = (data: any) => {
    setErrorMsg("");
    setSuccessMsg("");

    // Simulate API Call
    setTimeout(() => {
      const fullName = `${data.firstName} ${data.lastName}`;
      signupAction(data.email, fullName);
      setSuccessMsg(`Welcome to Designs of Dreams, ${fullName}!`);
      resetSignupForm();
    }, 800);
  };

  const handleSocialLogin = (provider: string) => {
    setErrorMsg("");
    setSuccessMsg("");
    setTimeout(() => {
      loginAction(`user@${provider.toLowerCase()}.com`, `${provider} Guest`);
      setSuccessMsg(`Welcome back, connected with ${provider}!`);
    }, 800);
  };

  const handleLogout = () => {
    logoutAction();
    setSuccessMsg("Logged out successfully.");
    setTimeout(() => setSuccessMsg(""), 3000);
  };

  if (!mounted) return null;

  return (
    <main className="split-auth-page">
      {/* FULL-PAGE STORYTELLING SLIDER */}
      <div className="split-auth-bg-slider">
        <AnimatePresence mode="wait">
          <motion.div
            key={currentSlide}
            className="split-auth-bg-slide"
            initial={{ opacity: 0, scale: 1.05 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1.2 }}
            style={{ backgroundImage: `url(${slides[currentSlide].image})` }}
          >
            <div className="split-auth-bg-overlay" />
          </motion.div>
        </AnimatePresence>
      </div>

      {/* TOP BRANDING HEADER */}
      <header className="split-auth-header">
        <Link href="/" className="split-auth-logo">
          <img src="/logo.png" alt="Designs of Dreams" className="split-auth-logo__img" />
          <span className="split-auth-logo__text">DESIGNS OF DREAMS</span>
        </Link>
      </header>

      {/* FOREGROUND LAYOUT */}
      <div className="split-auth-container">
        {/* LEFT COLUMN: Narrative Text Overlay */}
        <div className="split-auth-story">
          <AnimatePresence mode="wait">
            <motion.div
              key={currentSlide}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.6 }}
              className="split-auth-story__content"
            >
              <span className="split-auth-story__tag">{slides[currentSlide].subtitle}</span>
              <h2 className="split-auth-story__title">{slides[currentSlide].title}</h2>
              <p className="split-auth-story__desc">{slides[currentSlide].description}</p>
            </motion.div>
          </AnimatePresence>

          {/* Dots indicator */}
          <div className="split-auth-dots">
            {slides.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentSlide(idx)}
                className={`carousel-dot ${currentSlide === idx ? "is-active" : ""}`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        </div>

        {/* RIGHT COLUMN: Centered Card */}
        <div className="split-auth-form-panel">
          {/* Decorative Background Pattern */}
          <div 
            className="absolute inset-0 opacity-[0.03] pointer-events-none" 
            style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3C/svg%3E\")" }} 
          />
          
          <div className="login-container">
            <AnimatePresence mode="wait">
              {user?.isLoggedIn ? (
                // LOGGED IN VIEW
                <motion.div 
                  key="logged-in"
                  className="auth-box auth-box--profile"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.5, ease: [0.16, 1, 0.3, 1] }}
                >
                  <div className="auth-box__header text-center">
                    <span className="auth-box__tag">
                      <Sparkles size={12} />
                      Atelier Account
                    </span>
                    <h3>Atelier Profile</h3>
                    <div className="profile-divider" />
                  </div>

                  <div className="profile-details text-center">
                    <div className="profile-avatar">
                      {user.name.charAt(0).toUpperCase()}
                    </div>
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                    <div className="profile-status">
                      <CheckCircle size={16} className="text-emerald-500" />
                      <span>Verified Atelier Member</span>
                    </div>
                  </div>

                  <div className="auth-profile-actions" style={{ width: '100%', display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <Link href="/" className="auth-btn auth-btn--home">
                      <Home size={16} />
                      Go to Homepage
                    </Link>
                    <button className="auth-btn auth-btn--logout" onClick={handleLogout}>
                      <LogOut size={16} />
                      Logout Session
                    </button>
                  </div>
                </motion.div>
              ) : (
                // AUTHENTICATION FORMS VIEW
                <motion.div 
                  key="auth-forms"
                  className="auth-box"
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -30 }}
                  transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
                >
                  {/* Tab Toggles */}
                  <div className="auth-tabs">
                    <button 
                      className={`auth-tabs__btn ${activeTab === "login" ? "is-active" : ""}`}
                      onClick={() => { setActiveTab("login"); setErrorMsg(""); }}
                    >
                      <LogIn size={16} />
                      Sign In
                    </button>
                    <button 
                      className={`auth-tabs__btn ${activeTab === "signup" ? "is-active" : ""}`}
                      onClick={() => { setActiveTab("signup"); setErrorMsg(""); }}
                    >
                      <UserPlus size={16} />
                      Sign Up
                    </button>
                    <span 
                      className="auth-tabs__bar" 
                      style={{ transform: activeTab === "signup" ? "translateX(100%)" : "translateX(0)" }}
                    />
                  </div>

                  {/* Status Notifications */}
                  {successMsg && (
                    <div className="auth-alert auth-alert--success">
                      <CheckCircle size={18} />
                      <span>{successMsg}</span>
                    </div>
                  )}

                  {errorMsg && (
                    <div className="auth-alert auth-alert--error">
                      <AlertCircle size={18} />
                      <span>{errorMsg}</span>
                    </div>
                  )}

                  <AnimatePresence mode="wait">
                    {activeTab === "login" ? (
                      // LOGIN FORM
                      <motion.form 
                        key="login-form"
                        onSubmit={handleLoginSubmit(onLogin)}
                        className="auth-form"
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: 10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="auth-form__group">
                          <Mail className="auth-form__icon" size={16} />
                          <input 
                            type="email" 
                            placeholder="Email Address"
                            className={`auth-form__input ${loginErrors.email ? "is-invalid" : ""}`}
                            {...registerLogin("email")}
                          />
                          <span className="auth-form__line" />
                          {loginErrors.email && <span className="auth-form__error-text">{(loginErrors.email.message as string)}</span>}
                        </div>

                        <div className="auth-form__group">
                          <Lock className="auth-form__icon" size={16} />
                          <input 
                            type="password" 
                            placeholder="Password"
                            className={`auth-form__input ${loginErrors.password ? "is-invalid" : ""}`}
                            {...registerLogin("password")}
                          />
                          <span className="auth-form__line" />
                          {loginErrors.password && <span className="auth-form__error-text">{(loginErrors.password.message as string)}</span>}
                        </div>

                        <div className="auth-form__helper">
                          <label className="auth-form__checkbox-label">
                            <input 
                              type="checkbox" 
                              className="auth-form__checkbox"
                              {...registerLogin("rememberMe")}
                            />
                            <span>Remember Me</span>
                          </label>
                          <a 
                            href="#" 
                            className="auth-forgot-link" 
                            onClick={(e) => { e.preventDefault(); alert("Password reset instructions have been sent to your email!"); }}
                          >
                            Forgot Password?
                          </a>
                        </div>

                        <button type="submit" className="auth-btn">
                          Sign In
                        </button>

                        <div className="auth-social-separator">
                          <span>Or continue with</span>
                        </div>

                        <div className="auth-social-group">
                          <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Google")} aria-label="Continue with Google">
                            <FaGoogle />
                            <span>Google</span>
                          </button>
                          <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Apple")} aria-label="Continue with Apple">
                            <FaApple />
                            <span>Apple</span>
                          </button>
                          <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Facebook")} aria-label="Continue with Facebook">
                            <FaFacebookF />
                            <span>Facebook</span>
                          </button>
                        </div>
                      </motion.form>
                    ) : (
                      // SIGNUP FORM
                      <motion.form 
                        key="signup-form"
                        onSubmit={handleSignupSubmit(onSignup)}
                        className="auth-form"
                        initial={{ opacity: 0, x: 10 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -10 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="auth-form__row">
                          <div className="auth-form__group">
                            <User className="auth-form__icon" size={16} />
                            <input 
                              type="text" 
                              placeholder="First Name"
                              className={`auth-form__input ${signupErrors.firstName ? "is-invalid" : ""}`}
                              {...registerSignup("firstName")}
                            />
                            <span className="auth-form__line" />
                            {signupErrors.firstName && <span className="auth-form__error-text">{(signupErrors.firstName.message as string)}</span>}
                          </div>

                          <div className="auth-form__group">
                            <User className="auth-form__icon" size={16} />
                            <input 
                              type="text" 
                              placeholder="Last Name"
                              className={`auth-form__input ${signupErrors.lastName ? "is-invalid" : ""}`}
                              {...registerSignup("lastName")}
                            />
                            <span className="auth-form__line" />
                            {signupErrors.lastName && <span className="auth-form__error-text">{(signupErrors.lastName.message as string)}</span>}
                          </div>
                        </div>

                        <div className="auth-form__group">
                          <Mail className="auth-form__icon" size={16} />
                          <input 
                            type="email" 
                            placeholder="Email Address"
                            className={`auth-form__input ${signupErrors.email ? "is-invalid" : ""}`}
                            {...registerSignup("email")}
                          />
                          <span className="auth-form__line" />
                          {signupErrors.email && <span className="auth-form__error-text">{(signupErrors.email.message as string)}</span>}
                        </div>

                        <div className="auth-form__group">
                          <Phone className="auth-form__icon" size={16} />
                          <input 
                            type="tel" 
                            placeholder="Mobile Number"
                            className={`auth-form__input ${signupErrors.mobileNumber ? "is-invalid" : ""}`}
                            {...registerSignup("mobileNumber")}
                          />
                          <span className="auth-form__line" />
                          {signupErrors.mobileNumber && <span className="auth-form__error-text">{(signupErrors.mobileNumber.message as string)}</span>}
                        </div>

                        <div className="auth-form__group">
                          <Lock className="auth-form__icon" size={16} />
                          <input 
                            type="password" 
                            placeholder="Password"
                            className={`auth-form__input ${signupErrors.password ? "is-invalid" : ""}`}
                            {...registerSignup("password")}
                          />
                          <span className="auth-form__line" />
                          {signupErrors.password && <span className="auth-form__error-text">{(signupErrors.password.message as string)}</span>}
                        </div>

                        <div className="auth-form__group">
                          <Lock className="auth-form__icon" size={16} />
                          <input 
                            type="password" 
                            placeholder="Confirm Password"
                            className={`auth-form__input ${signupErrors.confirmPassword ? "is-invalid" : ""}`}
                            {...registerSignup("confirmPassword")}
                          />
                          <span className="auth-form__line" />
                          {signupErrors.confirmPassword && <span className="auth-form__error-text">{(signupErrors.confirmPassword.message as string)}</span>}
                        </div>

                        <div className="auth-form__helper">
                          <label className="auth-form__checkbox-label">
                            <input 
                              type="checkbox" 
                              className="auth-form__checkbox"
                              {...registerSignup("agreeTerms")}
                            />
                            <span>I agree to <Link href="#" onClick={(e) => { e.preventDefault(); alert("Terms & Conditions Modal"); }}>Terms & Conditions</Link></span>
                          </label>
                        </div>
                        {signupErrors.agreeTerms && <span className="auth-form__error-text" style={{ marginTop: '-12px' }}>{(signupErrors.agreeTerms.message as string)}</span>}

                        <button type="submit" className="auth-btn">
                          Create Account
                        </button>

                        <div className="auth-social-separator">
                          <span>Or continue with</span>
                        </div>

                        <div className="auth-social-group">
                          <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Google")} aria-label="Continue with Google">
                            <FaGoogle />
                            <span>Google</span>
                          </button>
                          <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Apple")} aria-label="Continue with Apple">
                            <FaApple />
                            <span>Apple</span>
                          </button>
                          <button type="button" className="auth-social-btn" onClick={() => handleSocialLogin("Facebook")} aria-label="Continue with Facebook">
                            <FaFacebookF />
                            <span>Facebook</span>
                          </button>
                        </div>
                      </motion.form>
                    )}
                  </AnimatePresence>

                  <div className="auth-box__footer">
                    <Link href="/" className="auth-back-home">
                      <ArrowLeft size={14} />
                      Back to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </main>
  );
}
