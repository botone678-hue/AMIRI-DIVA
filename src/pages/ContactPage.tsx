import React, { useState } from 'react';
import { useStore } from '../context/StoreContext';
import {
  MapPin,
  Phone,
  Mail,
  Smartphone,
  Clock,
  Send,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export const ContactPage: React.FC = () => {
  const { showToast } = useStore();
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !email || !message) return;
    setSubmitted(true);
    showToast('Thank you! Your message has been sent to our Eldoret Store Team.');
    setName('');
    setEmail('');
    setPhone('');
    setMessage('');
  };

  return (
    <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8 py-12 space-y-12">
      
      {/* Title */}
      <div className="text-center max-w-2xl mx-auto space-y-3">
        <span className="text-[10px] font-bold tracking-[0.25em] text-[#C5A059] uppercase">
          Eldoret Store & Customer Care
        </span>
        <h1 className="font-serif-display text-4xl sm:text-5xl font-semibold text-[#1A1412] uppercase">
          Get in Touch
        </h1>
        <p className="text-xs text-gray-600 font-light leading-relaxed">
          Have questions about our cosmetics, shade matching, or Pochi la Biashara order payments? Contact our store team in Eldoret, Kenya.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start">
        
        {/* Contact Info Sidebar */}
        <div className="space-y-6 bg-white p-6 sm:p-8 border border-[#E8D8CE] shadow-sm">
          <h2 className="font-serif-display text-xl font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-3">
            Contact Details
          </h2>

          <div className="space-y-4 text-xs font-light text-gray-700">
            <div className="flex items-start gap-3">
              <MapPin className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1412] uppercase">Store Location</p>
                <p>Amiri Diva Cosmetics Store</p>
                <p>Eldoret Town, Uasin Gishu County, Kenya</p>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Phone className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1412] uppercase">Phone & WhatsApp</p>
                <a href="tel:0741775878" className="hover:text-[#C5A059] font-mono text-sm font-semibold text-[#1A1412]">
                  0741775878
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Mail className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1412] uppercase">Email Care</p>
                <a href="mailto:amiridiva@gmail.com" className="hover:text-[#C5A059] text-gray-700">
                  amiridiva@gmail.com
                </a>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Smartphone className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1412] uppercase">Pochi la Biashara Number</p>
                <p className="font-mono text-base font-extrabold text-[#C5A059]">07417758</p>
                <p className="text-[10px] text-gray-400">AMIRI DIVA COSMETICS</p>
              </div>
            </div>

            <div className="flex items-start gap-3 pt-2 border-t border-[#F5F0EB]">
              <Clock className="h-5 w-5 text-[#C5A059] shrink-0 mt-0.5" />
              <div>
                <p className="font-bold text-[#1A1412] uppercase">Store Hours</p>
                <p>Monday – Saturday: 8:00 AM – 7:00 PM</p>
                <p>Sunday: 10:00 AM – 4:00 PM</p>
              </div>
            </div>
          </div>

        </div>

        {/* Form Column */}
        <div className="lg:col-span-2 bg-white p-6 sm:p-8 border border-[#E8D8CE] shadow-sm space-y-6">
          <h2 className="font-serif-display text-xl font-bold uppercase text-[#1A1412] border-b border-[#E8D8CE] pb-3">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="bg-emerald-50 p-6 border border-emerald-300 text-center space-y-3">
              <CheckCircle2 className="h-10 w-10 text-emerald-600 mx-auto" />
              <h3 className="font-serif-display text-lg font-bold text-emerald-900">
                Message Received!
              </h3>
              <p className="text-xs text-emerald-800 max-w-sm mx-auto font-light">
                Thank you for reaching out to Amiri Diva. One of our Eldoret beauty representatives will respond shortly.
              </p>
              <button
                onClick={() => setSubmitted(false)}
                className="bg-[#1A1412] text-[#FAF8F5] px-6 py-2 text-xs uppercase"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                    Your Name <span className="text-red-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    placeholder="e.g. Mercy Jebet"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>

                <div>
                  <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    placeholder="e.g. 0712345678"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                  />
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Email Address <span className="text-red-500">*</span>
                </label>
                <input
                  type="email"
                  required
                  placeholder="e.g. mercy@gmail.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-gray-700 block mb-1">
                  Message or Inquiry <span className="text-red-500">*</span>
                </label>
                <textarea
                  rows={4}
                  required
                  placeholder="How can we assist you with our cosmetics collection?"
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  className="w-full bg-[#FAF8F5] p-3 text-xs border border-[#E8D8CE] focus:outline-none focus:border-[#C5A059]"
                />
              </div>

              <button
                type="submit"
                className="bg-[#1A1412] text-[#FAF8F5] py-3.5 px-8 text-xs font-bold uppercase tracking-widest hover:bg-[#C5A059] hover:text-[#1A1412] transition-colors flex items-center gap-2"
              >
                <span>Send Message</span>
                <Send className="h-4 w-4" />
              </button>
            </form>
          )}

          {/* Interactive Eldoret Map Representation */}
          <div className="pt-6 border-t border-[#E8D8CE]">
            <h3 className="font-serif-display text-sm font-bold uppercase text-[#1A1412] mb-3">
              Eldoret Store Location
            </h3>
            <div className="relative h-48 w-full bg-[#1A1412] border border-[#C5A059]/40 flex flex-col items-center justify-center text-[#FAF8F5] p-6 text-center space-y-2">
              <MapPin className="h-8 w-8 text-[#C5A059] animate-bounce" />
              <p className="font-serif-display text-lg font-bold">AMIRI DIVA COSMETICS BOUTIQUE</p>
              <p className="text-xs text-[#E8D8CE]/80">Eldoret Central Business District, Kenya</p>
              <p className="text-[10px] text-[#C5A059] font-mono">Pochi la Biashara 07417758 • Call 0741775878</p>
            </div>
          </div>

        </div>

      </div>

    </div>
  );
};
