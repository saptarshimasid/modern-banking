'use client';

import React, { useState, useRef } from 'react';
import { Sidebar } from '@/components/Sidebar';
import { TopAppBar } from '@/components/TopAppBar';
import { Shield, Smartphone, Key, Award, Link2, Camera } from 'lucide-react';

const securityLogs = [
  { action: 'Login Approved', device: 'Aether Cryptokey v2', ip: '185.22.90.12', time: '2026-07-01 12:44' },
  { action: 'Transfer Cryptokey Signature', device: 'Vault Controller M2', ip: '185.22.90.12', time: '2026-06-29 18:10' },
  { action: 'Secondary Authorization Setup', device: 'Aether Auth App', ip: '185.22.90.12', time: '2026-06-25 09:30' },
];

const defaultProfilePic = "https://lh3.googleusercontent.com/aida-public/AB6AXuC3y_TrWy7OK5WtjG21md01_BSQENZ5zAeOiy7EIvGMWFy3Ftoojw09N1WHydbobz3OTwLcerNhoIV4z533vplERXvJJtmToiOKbjvj_ImFGMVWj1xHac5fY5ILpb5i5Rk6QzVL8jio5frYyFNV8Kde1am2I7qs4iidhRIAMIKGbHCvJpsNhJBrRkpTAxp1F0NASaLD4-zPIoHddQoxA4LEFuKWmOhF2Kh9GArveZmGm5H9YziFvFtYIJTkhqzj9v8_LXMjmTLPRFdU";

export default function ProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profilePic, setProfilePic] = useState<string>(defaultProfilePic);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleEditToggle = () => {
    if (isEditing) {
      // Save changes action
      setIsEditing(false);
    } else {
      setIsEditing(true);
    }
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfilePic(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  return (
    <div className="flex min-h-screen relative">
      <Sidebar />

      <div className="flex-1 flex flex-col min-w-0 md:ml-64 relative z-10">
        <TopAppBar />

        <main className="flex-1 px-6 md:px-16 py-8 overflow-y-auto">
          <div className="max-w-[1000px] mx-auto space-y-8">
            
            {/* Header */}
            <div className="flex justify-between items-center">
              <div>
                <h2 className="font-sora text-3xl font-bold text-white">Vault Profile</h2>
                <p className="font-geist text-sm text-on-surface-variant mt-1">
                  Elite access keys and identity security.
                </p>
              </div>
            </div>

            {/* Profile Overview Card */}
            <div className="glass-card rounded-xl p-8 relative overflow-hidden">
              <div className="noise-overlay" />
              <div className="relative z-10 flex flex-col md:flex-row items-center gap-8 justify-between">
                <div className="flex flex-col md:flex-row items-center gap-8 flex-1">
                  <div className="relative group">
                    <div className="w-24 h-24 rounded-full overflow-hidden border-2 border-primary-container/40 glow-primary relative">
                      <img
                        alt="User Profile"
                        className="w-full h-full object-cover"
                        src={profilePic}
                      />
                      {isEditing && (
                        <div 
                          onClick={triggerFileInput}
                          className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center cursor-pointer hover:bg-black/80 transition-colors"
                        >
                          <Camera className="w-5 h-5 text-white" />
                          <span className="text-[10px] text-white/80 font-space-grotesk mt-1">Upload</span>
                        </div>
                      )}
                    </div>
                    {isEditing && (
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="hidden"
                      />
                    )}
                  </div>
                  <div className="text-center md:text-left space-y-2">
                    <div className="flex flex-col md:flex-row items-center gap-2">
                      <h3 className="font-sora text-2xl font-bold text-white">Aether User Node #0</h3>
                      <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-primary-container/10 border border-primary-container/20 text-primary-container text-[10px] font-mono uppercase tracking-wider">
                        <Award className="w-3 h-3" /> Elite Tier
                      </span>
                    </div>
                    <p className="font-mono text-xs text-on-surface-variant">Node ID: 0xbc98f7e2a3456bde10447a</p>
                    <p className="font-geist text-sm text-on-surface-variant max-w-md">
                      Authorized for high-value assets simulations, compliances offsets investments, and automated multi-agent wealth advice.
                    </p>
                  </div>
                </div>
                
                {/* Action Button */}
                <div className="w-full md:w-auto mt-4 md:mt-0">
                  <button 
                    onClick={handleEditToggle}
                    className="w-full md:w-auto py-2.5 px-6 btn-primary-cyan font-space-grotesk text-xs tracking-wider uppercase rounded-full shadow-[0_0_15px_rgba(42,241,254,0.3)] hover:scale-102 active:scale-98 transition-all duration-200"
                  >
                    {isEditing ? 'Save' : 'Edit Profile'}
                  </button>
                </div>
              </div>
            </div>

            {/* Profile Configurations columns */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              
              {/* Telemetry settings */}
              <div className="glass-card rounded-xl p-8 relative overflow-hidden">
                <div className="noise-overlay" />
                <h4 className="font-sora text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Shield className="w-5 h-5 text-primary-container" /> Security Keys
                </h4>
                <div className="space-y-4">
                  <div className="flex justify-between items-center p-4 bg-white/3 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Key className="w-5 h-5 text-primary-container" />
                      <div>
                        <p className="text-sm font-semibold text-white">Cryptographic Key Signature</p>
                        <p className="text-[10px] text-on-surface-variant font-mono">Active (Aether Protocol v4)</p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-container font-mono">Verified</span>
                  </div>
                  <div className="flex justify-between items-center p-4 bg-white/3 border border-white/10 rounded-lg">
                    <div className="flex items-center gap-3">
                      <Smartphone className="w-5 h-5 text-secondary-fixed" />
                      <div>
                        <p className="text-sm font-semibold text-white">Secondary Auth Telemetry</p>
                        <p className="text-[10px] text-on-surface-variant font-mono">Push notification validation</p>
                      </div>
                    </div>
                    <span className="text-xs text-primary-container font-mono">Enabled</span>
                  </div>
                </div>
              </div>

              {/* Security audit logs */}
              <div className="glass-card rounded-xl p-8 relative overflow-hidden">
                <div className="noise-overlay" />
                <h4 className="font-sora text-lg font-semibold text-white mb-6 flex items-center gap-2">
                  <Link2 className="w-5 h-5 text-primary-container" /> Telemetry Access Log
                </h4>
                <div className="space-y-4">
                  {securityLogs.map((log, idx) => (
                    <div key={idx} className="flex justify-between items-start text-xs border-b border-white/5 pb-3">
                      <div>
                        <p className="font-semibold text-white">{log.action}</p>
                        <p className="text-on-surface-variant mt-1">{log.device} • {log.ip}</p>
                      </div>
                      <span className="font-mono text-on-surface-variant text-[10px]">{log.time}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>

          </div>
        </main>
      </div>
    </div>
  );
}
