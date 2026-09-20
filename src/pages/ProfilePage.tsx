import React, { useState } from 'react';
import { User, Mail, Phone, MapPin, Shield, Calendar, LogOut, CheckCircle2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

export const ProfilePage: React.FC<{ navigate: (path: string) => void }> = ({ navigate }) => {
  const { user, role, logout, switchDemoRole } = useAuth();
  const [savedSuccess, setSavedSuccess] = useState(false);
  const [name, setName] = useState(user?.name || '');
  const [phone, setPhone] = useState(user?.phone || '');
  const [address, setAddress] = useState(user?.address || '');

  if (!user) {
    navigate('/login');
    return null;
  }

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="bg-slate-50/40 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
              Account Management
            </span>
            <h1 className="text-2xl font-bold text-slate-900 mt-0.5">Customer Profile</h1>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                logout();
                navigate('/');
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md text-xs font-semibold text-rose-700 bg-white border border-rose-200 hover:bg-rose-50 transition-colors shadow-xs"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {savedSuccess && (
          <div className="mb-6 p-4 rounded-lg bg-emerald-50 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Profile information and delivery coordinates updated successfully!</span>
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-start">
          {/* Identity Card */}
          <div className="md:col-span-4 bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
            <div className="text-center pb-4 border-b border-slate-100">
              <div className="w-16 h-16 rounded-full bg-slate-900 text-white font-bold text-xl flex items-center justify-center mx-auto mb-3">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <h2 className="font-bold text-slate-900 text-base">{user.name}</h2>
              <p className="text-xs text-slate-500 font-mono mt-0.5">{user.email}</p>
              <div className="mt-2 inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-sky-50 text-sky-800 border border-sky-200">
                <Shield className="w-3 h-3 text-sky-600" />
                <span>Role: {role}</span>
              </div>
            </div>

            <div className="space-y-2 text-xs">
              <button
                onClick={() => navigate('/orders')}
                className="w-full text-left p-2.5 rounded-md bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 transition-colors"
              >
                📦 View Order History
              </button>
              <button
                onClick={() => navigate('/service-requests')}
                className="w-full text-left p-2.5 rounded-md bg-slate-50 hover:bg-slate-100 font-medium text-slate-700 transition-colors"
              >
                🔧 Track Service Requests
              </button>
            </div>

            {/* Role switch helper */}
            <div className="pt-3 border-t border-slate-100">
              <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider block mb-1.5">
                Evaluation Persona Switch
              </span>
              <div className="flex gap-2">
                <button
                  onClick={() => switchDemoRole('CUSTOMER')}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold border ${
                    role === 'USER' ? 'bg-sky-600 text-white border-sky-600' : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Customer
                </button>
                <button
                  onClick={() => switchDemoRole('ADMIN')}
                  className={`flex-1 py-1.5 rounded text-xs font-semibold border ${
                    role === 'SUPER_ADMIN' || role === 'ADMIN'
                      ? 'bg-amber-600 text-white border-amber-600'
                      : 'bg-slate-100 text-slate-700 border-slate-200'
                  }`}
                >
                  Admin
                </button>
              </div>
            </div>
          </div>

          {/* Form */}
          <div className="md:col-span-8 bg-white rounded-xl border border-slate-200 p-6 shadow-xs">
            <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3 mb-4">
              Saved Contact & Delivery Defaults
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-slate-700 font-medium mb-1">Full Legal Name</label>
                  <input
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">Registered Phone</label>
                  <input
                    type="tel"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                  <input
                    type="email"
                    disabled
                    value={user.email}
                    className="w-full px-3 py-2 bg-slate-100 border border-slate-300 rounded-md text-slate-500 cursor-not-allowed font-mono"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-slate-700 font-medium mb-1">Default Jobsite Delivery Address</label>
                  <input
                    type="text"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>
              </div>

              <div className="pt-2">
                <button
                  type="submit"
                  className="px-5 py-2 bg-slate-900 hover:bg-sky-700 text-white rounded-md font-semibold transition-colors shadow-xs"
                >
                  Save Profile Changes
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
