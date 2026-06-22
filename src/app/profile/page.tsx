"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useStore } from "@/store/useStore";
import { motion, AnimatePresence } from "framer-motion";
import { 
  User, 
  Lock, 
  Camera, 
  Edit3, 
  ArrowLeft, 
  CheckCircle2, 
  ShieldAlert,
  LogIn
} from "lucide-react";
import "./Profile.scss";

type TabType = "info" | "edit" | "password" | "photo";

export default function ProfilePage() {
  const router = useRouter();
  const [mounted, setMounted] = useState(false);
  const [activeTab, setActiveTab] = useState<TabType>("info");
  const [saveSuccess, setSaveSuccess] = useState("");
  
  // Zustand Store
  const user = useStore((state) => state.user);
  const loginAction = useStore((state) => state.login);

  // Form states
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("9876543210");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    setMounted(true);
    if (user?.isLoggedIn && user?.name) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Handle URL Hash change to pre-select section
  useEffect(() => {
    if (typeof window !== "undefined") {
      const hash = window.location.hash;
      if (hash === "#edit") setActiveTab("edit");
      else if (hash === "#password") setActiveTab("password");
      else if (hash === "#photo") setActiveTab("photo");
      else setActiveTab("info");
    }
  }, [mounted]);

  if (!mounted) return null;

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    if (user?.isLoggedIn) {
      loginAction(email, name);
      setSaveSuccess("Profile details updated successfully!");
      setTimeout(() => {
        setSaveSuccess("");
        setActiveTab("info");
      }, 2000);
    }
  };

  const handleChangePassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      alert("New passwords do not match!");
      return;
    }
    setSaveSuccess("Password changed successfully!");
    setCurrentPassword("");
    setNewPassword("");
    setConfirmPassword("");
    setTimeout(() => {
      setSaveSuccess("");
      setActiveTab("info");
    }, 2000);
  };

  const handleTabChange = (tab: TabType) => {
    setActiveTab(tab);
    if (typeof window !== "undefined") {
      window.location.hash = tab === "info" ? "" : tab;
    }
  };

  return (
    <main className="relative pt-[120px] pb-[100px] bg-white min-h-screen">
      {/* Decorative background pattern */}
      <div 
        className="absolute inset-0 opacity-5 pointer-events-none" 
        style={{ backgroundImage: "url(\"data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Ccircle cx='40' cy='40' r='38' fill='none' stroke='%23000000' stroke-width='0.5'/%3E%3C/svg%3E\")" }} 
      />

      <div className="profile-page-container">
        {!user?.isLoggedIn ? (
          // NOT LOGGED IN WARNING
          <div className="flex flex-col items-center justify-center py-16 text-center">
            <div className="w-16 h-16 rounded-full bg-orange-100 flex items-center justify-center text-orange-500 mb-6">
              <ShieldAlert size={32} />
            </div>
            <h2 className="text-2xl font-bold text-zinc-900 mb-2">Access Denied</h2>
            <p className="text-zinc-500 max-w-sm mb-8">You must be signed in to view your profile and account information.</p>
            <Link href="/login" className="btn-profile-submit flex items-center gap-2">
              <LogIn size={16} />
              Sign In to Account
            </Link>
          </div>
        ) : (
          <>
            {/* Header */}
            <div className="profile-header">
              <h2>Atelier Account Settings</h2>
              <p>Manage your Designs of Dreams profile credentials, passwords, and photos.</p>
            </div>

            {/* Notification */}
            <AnimatePresence>
              {saveSuccess && (
                <motion.div 
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className="mb-8 p-4 bg-emerald-50 border border-emerald-200 text-emerald-700 rounded-xl flex items-center gap-3 font-semibold text-sm shadow-sm"
                >
                  <CheckCircle2 size={18} />
                  {saveSuccess}
                </motion.div>
              )}
            </AnimatePresence>

            {/* Layout Grid */}
            <div className="profile-layout">
              {/* Sidebar Tabs */}
              <aside className="profile-sidebar">
                <div className="sidebar-user-info">
                  <div className="user-avatar-circle">
                    {user.name.charAt(0).toUpperCase()}
                  </div>
                  <div className="user-details">
                    <h4>{user.name}</h4>
                    <p>{user.email}</p>
                  </div>
                </div>

                <div className="sidebar-nav-links">
                  <button 
                    className={`sidebar-btn ${activeTab === "info" ? "is-active" : ""}`}
                    onClick={() => handleTabChange("info")}
                  >
                    <User size={16} />
                    Personal Info
                  </button>
                  <button 
                    className={`sidebar-btn ${activeTab === "edit" ? "is-active" : ""}`}
                    onClick={() => handleTabChange("edit")}
                  >
                    <Edit3 size={16} />
                    Edit Profile
                  </button>
                  <button 
                    className={`sidebar-btn ${activeTab === "password" ? "is-active" : ""}`}
                    onClick={() => handleTabChange("password")}
                  >
                    <Lock size={16} />
                    Change Password
                  </button>
                  <button 
                    className={`sidebar-btn ${activeTab === "photo" ? "is-active" : ""}`}
                    onClick={() => handleTabChange("photo")}
                  >
                    <Camera size={16} />
                    Profile Photo
                  </button>
                </div>
              </aside>

              {/* Main Content Area */}
              <div className="profile-content-area">
                <AnimatePresence mode="wait">
                  {activeTab === "info" && (
                    <motion.div 
                      key="info-card"
                      className="profile-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3>Personal Information</h3>
                      <div className="info-display-grid">
                        <div className="info-item">
                          <span className="label">Full Name</span>
                          <span className="val">{user.name}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Email Address</span>
                          <span className="val">{user.email}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Mobile Number</span>
                          <span className="val">+91 {phone}</span>
                        </div>
                        <div className="info-item">
                          <span className="label">Account Status</span>
                          <span className="val text-emerald-600">Verified Atelier Member</span>
                        </div>
                      </div>
                    </motion.div>
                  )}

                  {activeTab === "edit" && (
                    <motion.div 
                      key="edit-card"
                      className="profile-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3>Edit Profile Details</h3>
                      <form onSubmit={handleUpdateProfile} className="profile-form">
                        <div className="profile-form-grid">
                          <div className="profile-form-group">
                            <label>Full Name</label>
                            <input 
                              type="text" 
                              required 
                              value={name} 
                              onChange={(e) => setName(e.target.value)}
                            />
                          </div>
                          <div className="profile-form-group">
                            <label>Email Address</label>
                            <input 
                              type="email" 
                              required 
                              value={email} 
                              onChange={(e) => setEmail(e.target.value)}
                            />
                          </div>
                          <div className="profile-form-group">
                            <label>Mobile Number</label>
                            <input 
                              type="tel" 
                              required 
                              pattern="[0-9]{10}"
                              value={phone} 
                              onChange={(e) => setPhone(e.target.value)}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn-profile-submit">
                          Save Changes
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "password" && (
                    <motion.div 
                      key="password-card"
                      className="profile-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3>Change Password</h3>
                      <form onSubmit={handleChangePassword} className="profile-form">
                        <div className="profile-form-group">
                          <label>Current Password</label>
                          <input 
                            type="password" 
                            required 
                            placeholder="Type current password"
                            value={currentPassword} 
                            onChange={(e) => setCurrentPassword(e.target.value)}
                          />
                        </div>
                        <div className="profile-form-grid">
                          <div className="profile-form-group">
                            <label>New Password</label>
                            <input 
                              type="password" 
                              required 
                              placeholder="At least 6 characters"
                              value={newPassword} 
                              onChange={(e) => setNewPassword(e.target.value)}
                            />
                          </div>
                          <div className="profile-form-group">
                            <label>Confirm New Password</label>
                            <input 
                              type="password" 
                              required 
                              placeholder="Confirm new password"
                              value={confirmPassword} 
                              onChange={(e) => setConfirmPassword(e.target.value)}
                            />
                          </div>
                        </div>
                        <button type="submit" className="btn-profile-submit">
                          Update Password
                        </button>
                      </form>
                    </motion.div>
                  )}

                  {activeTab === "photo" && (
                    <motion.div 
                      key="photo-card"
                      className="profile-card"
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.25 }}
                    >
                      <h3>Profile Photo</h3>
                      <div className="photo-upload-section">
                        <div className="photo-preview-box">
                          <div className="photo-fallback">
                            {user.name.charAt(0).toUpperCase()}
                          </div>
                        </div>
                        <div className="photo-controls">
                          <p>Upload a new avatar picture. JPEGs or PNGs are supported up to 5MB.</p>
                          <div className="upload-btn-row">
                            <button 
                              type="button" 
                              className="btn-profile-submit"
                              onClick={() => {
                                setSaveSuccess("Avatar photo updated!");
                                setTimeout(() => setSaveSuccess(""), 2500);
                              }}
                            >
                              Upload Photo
                            </button>
                            <button 
                              type="button" 
                              className="btn-profile-submit" 
                              style={{ backgroundColor: "transparent", color: "rgba(0, 0, 0, 0.6)", border: "1px solid rgba(0,0,0,0.1)" }}
                              onClick={() => alert("Avatar removed.")}
                            >
                              Remove
                            </button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </div>
          </>
        )}
      </div>
    </main>
  );
}
