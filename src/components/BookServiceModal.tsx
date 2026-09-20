import React, { useState } from 'react';
import { X, Calendar, Clock, MapPin, Wrench, CheckCircle, AlertCircle, Phone, User, Mail } from 'lucide-react';
import { ServiceItem, ServiceRequest } from '../types';
import { useAuth } from '../context/AuthContext';
import { api } from '../services/api';

interface BookServiceModalProps {
  service: ServiceItem | null;
  onClose: () => void;
  onSuccess: (request: ServiceRequest, wasOffline?: boolean) => void;
}

export const BookServiceModal: React.FC<BookServiceModalProps> = ({ service, onClose, onSuccess }) => {
  const { user } = useAuth();

  const [customerName, setCustomerName] = useState(user?.name || '');
  const [customerPhone, setCustomerPhone] = useState(user?.phone || '');
  const [customerEmail, setCustomerEmail] = useState(user?.email || '');
  const [address, setAddress] = useState(user?.address || '');
  const [city, setCity] = useState('Kathmandu');
  const [preferredDate, setPreferredDate] = useState(() => {
    const d = new Date();
    d.setDate(d.getDate() + 1);
    return d.toISOString().split('T')[0];
  });
  const [preferredTimeSlot, setPreferredTimeSlot] = useState('9:00 AM - 12:00 PM');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  if (!service) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage('');

    if (!customerName || !customerPhone || !address || !description) {
      setErrorMessage('Please fill in all required fields (Name, Phone, Address, Issue details).');
      return;
    }

    setIsSubmitting(true);

    try {
      const payload = {
        customerId: user?.id || 'guest',
        customerName,
        customerPhone,
        customerEmail: customerEmail || 'guest@example.com',
        serviceId: service.id,
        serviceName: service.name,
        category: service.category,
        description,
        address,
        city,
        preferredDate,
        preferredTimeSlot,
      };

      const { request, queuedOffline } = await api.createServiceRequest(payload);
      onSuccess(request, queuedOffline);
    } catch (err: any) {
      setErrorMessage(err.message || 'Failed to submit service request. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/60 backdrop-blur-xs flex items-center justify-center p-4 sm:p-6">
      <div
        className="bg-white rounded-xl shadow-2xl max-w-xl w-full overflow-hidden border border-slate-200 relative animate-in fade-in duration-200"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="bg-slate-900 text-white p-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-lg bg-sky-500/20 text-sky-400 border border-sky-500/30 flex items-center justify-center">
              <Wrench className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base leading-snug">Book Technician Service</h3>
              <p className="text-xs text-slate-300 font-medium">{service.name} ({service.category})</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 text-xs">
          {/* Rate Notice */}
          <div className="p-3 bg-sky-50 rounded-lg border border-sky-100 flex items-center justify-between">
            <span className="text-slate-700 font-medium">Standard Estimated Rate:</span>
            <span className="font-bold text-sky-900 text-sm">{service.standardRate}</span>
          </div>

          {errorMessage && (
            <div className="p-3 bg-rose-50 text-rose-700 rounded-md border border-rose-200 flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0" />
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Customer Information */}
          <div className="space-y-3">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Customer & Contact Details
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Full Name *</label>
                <div className="relative">
                  <User className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="e.g. Ramesh Thapa"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Phone Number *</label>
                <div className="relative">
                  <Phone className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="tel"
                    required
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="+977 98XXXXXXXX"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Email Address</label>
                <div className="relative">
                  <Mail className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="name@example.com"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Jobsite Location */}
          <div className="space-y-3 pt-2">
            <h4 className="font-bold text-slate-900 uppercase tracking-wider text-[11px]">
              Jobsite Location & Schedule
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <div className="sm:col-span-2">
                <label className="block text-slate-700 font-medium mb-1">Service Street Address *</label>
                <div className="relative">
                  <MapPin className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="text"
                    required
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    placeholder="House/Apartment #, Ward, Area"
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">City / Region *</label>
                <select
                  value={city}
                  onChange={(e) => setCity(e.target.value)}
                  className="w-full px-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                >
                  <option value="Kathmandu">Kathmandu</option>
                  <option value="Lalitpur">Lalitpur</option>
                  <option value="Bhaktapur">Bhaktapur</option>
                  <option value="Pokhara">Pokhara</option>
                  <option value="Biratnagar">Biratnagar</option>
                  <option value="Other">Other Region</option>
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Date *</label>
                <div className="relative">
                  <Calendar className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <input
                    type="date"
                    required
                    min={new Date().toISOString().split('T')[0]}
                    value={preferredDate}
                    onChange={(e) => setPreferredDate(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  />
                </div>
              </div>

              <div>
                <label className="block text-slate-700 font-medium mb-1">Preferred Time Window *</label>
                <div className="relative">
                  <Clock className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
                  <select
                    value={preferredTimeSlot}
                    onChange={(e) => setPreferredTimeSlot(e.target.value)}
                    className="w-full pl-8 pr-3 py-2 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
                  >
                    <option value="8:00 AM - 11:00 AM">8:00 AM - 11:00 AM (Early Morning)</option>
                    <option value="11:00 AM - 2:00 PM">11:00 AM - 2:00 PM (Midday)</option>
                    <option value="2:00 PM - 5:00 PM">2:00 PM - 5:00 PM (Afternoon)</option>
                    <option value="5:00 PM - 8:00 PM">5:00 PM - 8:00 PM (Evening)</option>
                  </select>
                </div>
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="pt-2">
            <label className="block text-slate-700 font-medium mb-1">
              Describe the Issue / Scope of Work *
            </label>
            <textarea
              required
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Please describe symptoms, pipe diameter, breaker capacity, or any special access instructions..."
              className="w-full p-2.5 bg-white border border-slate-300 rounded-md focus:outline-none focus:ring-1 focus:ring-sky-500 text-xs"
            />
          </div>

          <div className="pt-4 border-t border-slate-200 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-md text-xs font-semibold text-slate-600 hover:bg-slate-100 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-md text-xs font-semibold bg-slate-900 hover:bg-sky-700 text-white transition-colors shadow-xs flex items-center gap-1.5"
            >
              {isSubmitting ? (
                <span>Registering Ticket...</span>
              ) : (
                <>
                  <CheckCircle className="w-3.5 h-3.5" />
                  <span>Confirm & Dispatch Ticket</span>
                </>
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
