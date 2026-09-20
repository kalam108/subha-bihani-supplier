import React, { useState } from 'react';
import { Phone, Mail, MapPin, Clock, Send, CheckCircle2, ShieldAlert } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    inquiryType: 'Wholesale Supplies',
    message: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="bg-slate-50/40 min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-3xl mb-10">
          <span className="text-xs font-semibold text-sky-700 uppercase tracking-wider">
            Contractor Desk & Warehouse Inquiries
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold text-slate-900 mt-1">
            Contact Subbha Bihani Suppliers
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            Reach out for commercial bill-of-materials quotations, wholesale distributor accounts, or rapid technician dispatch.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Contact Details & Operating Hours */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-xs space-y-4">
              <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                Corporate Headquarters & Central Depot
              </h3>

              <div className="space-y-3.5 text-xs text-slate-600">
                <div className="flex items-start gap-3">
                  <MapPin className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Main Facility & Showroom:</strong>
                    <span>Subbha Bihani Commercial Complex, Main Road, Biratnagar, Nepal</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Phone className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Dispatch & Hotline:</strong>
                    <span>+977 984-1234567 / (021) 534890</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Mail className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Email Desk:</strong>
                    <span>orders@subbhabihani.com • sales@subbhabihani.com</span>
                  </div>
                </div>

                <div className="flex items-start gap-3">
                  <Clock className="w-4 h-4 text-sky-600 shrink-0 mt-0.5" />
                  <div>
                    <strong className="text-slate-900 block">Business Hours:</strong>
                    <span>Sunday – Friday: 7:30 AM – 7:00 PM</span>
                    <span className="block text-slate-400">Emergency breakdown unit on call 24/7</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Emergency Hotline Alert */}
            <div className="p-4 rounded-xl bg-slate-900 text-white flex items-start gap-3 shadow-xs">
              <ShieldAlert className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
              <div>
                <h4 className="font-bold text-xs sm:text-sm">24/7 Emergency Line</h4>
                <p className="text-[11px] text-slate-300 mt-1">
                  For active electrical faults, sparking, or catastrophic pipe bursts, call our priority contractor line immediately at <strong>+977 984-1234567</strong>.
                </p>
              </div>
            </div>
          </div>

          {/* Contact & Inquiry Form */}
          <div className="lg:col-span-7 bg-white rounded-xl border border-slate-200 p-6 sm:p-8 shadow-xs">
            {submitted ? (
              <div className="text-center py-12 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-600 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Message Received</h3>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Thank you for reaching out to Subbha Bihani Suppliers. Our commercial sales engineer will review your inquiry and follow up within 2 business hours.
                </p>
                <button
                  onClick={() => {
                    setSubmitted(false);
                    setFormData({ name: '', email: '', phone: '', inquiryType: 'Wholesale Supplies', message: '' });
                  }}
                  className="px-4 py-2 bg-slate-900 text-white rounded-md text-xs font-semibold hover:bg-sky-700 transition-colors mt-2"
                >
                  Submit Another Inquiry
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4 text-xs">
                <h3 className="font-bold text-slate-900 text-sm border-b border-slate-100 pb-3">
                  Send a Message or Request Contractor Quote
                </h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Your Full Name *</label>
                    <input
                      type="text"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Anil Shrestha"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Mobile Phone *</label>
                    <input
                      type="tel"
                      required
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+977 98XXXXXXXX"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Email Address *</label>
                    <input
                      type="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="name@example.com"
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                    />
                  </div>

                  <div>
                    <label className="block text-slate-700 font-medium mb-1">Inquiry Category</label>
                    <select
                      value={formData.inquiryType}
                      onChange={(e) => setFormData({ ...formData, inquiryType: e.target.value })}
                      className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                    >
                      <option value="Wholesale Supplies">Bulk Wholesale Supplies</option>
                      <option value="Contractor Quotation">Jobsite BOM Quotation</option>
                      <option value="Technician Dispatch">Licensed Field Technician</option>
                      <option value="Dealership Inquiry">Dealership & Brand Partnership</option>
                      <option value="Other">Other Query</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-slate-700 font-medium mb-1">
                    Details / Material Specifications *
                  </label>
                  <textarea
                    required
                    rows={4}
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="List required items, quantities, pipe diameters, wire gauges, or jobsite coordinates..."
                    className="w-full p-2.5 border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500"
                  />
                </div>

                <button
                  type="submit"
                  className="px-5 py-2.5 bg-slate-900 hover:bg-sky-700 text-white rounded-md font-semibold flex items-center gap-2 transition-colors shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Transmit Inquiry</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
