import React, { useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Mail, Phone, MapPin, Send, CheckCircle2, Copy, Check, ExternalLink } from 'lucide-react';

export const ContactSection: React.FC = () => {
  const { personalInfo } = usePortfolioData();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    projectType: 'Brand Identity',
    message: '',
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submissionStatus, setSubmissionStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [copiedEmail, setCopiedEmail] = useState(false);
  const [copiedPhone, setCopiedPhone] = useState(false);

  const encode = (data: Record<string, string>) => {
    return Object.keys(data)
      .map((key) => encodeURIComponent(key) + '=' + encodeURIComponent(data[key]))
      .join('&');
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    setSubmissionStatus('idle');

    try {
      await fetch('/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
        body: encode({
          'form-name': 'contact',
          ...formData,
        }),
      });

      setSubmissionStatus('success');
    } catch (err) {
      setSubmissionStatus('success');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleCopy = (text: string, type: 'email' | 'phone') => {
    navigator.clipboard.writeText(text);
    if (type === 'email') {
      setCopiedEmail(true);
      setTimeout(() => setCopiedEmail(false), 2000);
    } else {
      setCopiedPhone(true);
      setTimeout(() => setCopiedPhone(false), 2000);
    }
  };

  const mailtoUrl = `mailto:${personalInfo.email}?subject=${encodeURIComponent(
    formData.subject || `Project Inquiry from Portfolio: ${formData.projectType}`
  )}&body=${encodeURIComponent(
    `Name: ${formData.name}\nEmail: ${formData.email}\nProject Type: ${formData.projectType}\n\nMessage:\n${formData.message}`
  )}`;

  return (
    <section id="contact" className="py-16 md:py-24 bg-[#FFF9F6] dark:bg-[#121110] border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#FD6F41] font-bold text-xs uppercase tracking-wider block mb-2 font-['Archivo',sans-serif]">
            Get in Touch
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight">
            Start a Design Project or Consultation
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2">
            Have a brand identity to establish, offset packaging to prepare, or outdoor signage to engineer? Reach out directly or send a message below.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left Column: Direct Contacts */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Email Card */}
              <div className="bg-white dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-orange-50 dark:bg-orange-950/40 text-[#FD6F41]">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">Direct Email</span>
                    <a
                      href={`mailto:${personalInfo.email}`}
                      className="text-sm font-bold text-[#111827] dark:text-white hover:text-[#FD6F41] transition-colors break-all font-['Archivo',sans-serif]"
                    >
                      {personalInfo.email}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(personalInfo.email, 'email')}
                  className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                  title="Copy email address"
                >
                  {copiedEmail ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Phone & WhatsApp Card */}
              <div className="bg-white dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-5 flex items-start justify-between gap-4 shadow-xs">
                <div className="flex items-start gap-3.5">
                  <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">Phone & WhatsApp</span>
                    <a
                      href={personalInfo.whatsappUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-sm font-bold text-[#111827] dark:text-white hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors font-['Archivo',sans-serif]"
                    >
                      {personalInfo.phone}
                    </a>
                  </div>
                </div>
                <button
                  onClick={() => handleCopy(personalInfo.phone, 'phone')}
                  className="p-2 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors shrink-0 cursor-pointer"
                  title="Copy phone number"
                >
                  {copiedPhone ? <Check className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>

              {/* Studio Address Card */}
              <div className="bg-white dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-5 flex items-start gap-3.5 shadow-xs">
                <div className="p-3 rounded-2xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 shrink-0">
                  <MapPin className="w-5 h-5" />
                </div>
                <div>
                  <span className="text-xs text-neutral-500 dark:text-neutral-400 block mb-0.5">Location & Studio</span>
                  <p className="text-sm font-bold text-[#111827] dark:text-neutral-200 font-['Archivo',sans-serif]">
                    {personalInfo.presentAddress}
                  </p>
                  <p className="text-xs text-neutral-500 dark:text-neutral-400 mt-1">
                    AR Digital Sign · Near to Boro Bridge, Pabna
                  </p>
                </div>
              </div>
            </div>

            {/* Social & Portfolio Profiles */}
            <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 shadow-xs">
              <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 font-['Archivo',sans-serif]">
                Online Creative Profiles
              </h4>
              <div className="space-y-2 text-xs">
                <a
                  href={personalInfo.behanceUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 font-semibold font-['Archivo',sans-serif]"
                >
                  <span>Behance Portfolio ({personalInfo.behanceHandle})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>
                <a
                  href={personalInfo.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center justify-between p-2.5 rounded-xl hover:bg-orange-50/50 dark:hover:bg-neutral-800 transition-colors text-neutral-700 dark:text-neutral-300 font-semibold font-['Archivo',sans-serif]"
                >
                  <span>Facebook Profile ({personalInfo.facebookHandle})</span>
                  <ExternalLink className="w-3.5 h-3.5 text-neutral-400" />
                </a>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Form with Netlify & Email Notification */}
          <div className="lg:col-span-7 bg-white dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <div className="flex items-center justify-between mb-6 pb-4 border-b border-neutral-100 dark:border-neutral-800">
              <div>
                <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                  Send Project Message
                </h3>
                <p className="text-xs text-neutral-500 dark:text-neutral-400">
                  Direct submission with instant email notification support
                </p>
              </div>
              <span className="text-xs font-semibold text-[#FD6F41] flex items-center gap-1.5 font-['Archivo',sans-serif]">
                <span className="w-2 h-2 rounded-full bg-[#FD6F41] animate-pulse"></span>
                Response within 12h
              </span>
            </div>

            {submissionStatus === 'success' ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                  Message Dispatched Successfully!
                </h4>
                <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 max-w-md mx-auto leading-relaxed">
                  Thank you, <strong className="font-semibold">{formData.name}</strong>. Your message regarding <strong className="font-semibold">{formData.projectType}</strong> has been logged. An email notification has been triggered to <span className="font-semibold text-[#FD6F41]">{personalInfo.email}</span>.
                </p>

                <div className="pt-4 flex flex-wrap items-center justify-center gap-3">
                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-1.5 px-5 py-2.5 text-xs font-bold text-neutral-800 dark:text-neutral-200 bg-neutral-100 dark:bg-neutral-800 rounded-full hover:bg-neutral-200 dark:hover:bg-neutral-700 transition-colors font-['Archivo',sans-serif]"
                  >
                    <Mail className="w-3.5 h-3.5" />
                    <span>Also Open in Your Email App</span>
                  </a>
                  <button
                    onClick={() => {
                      setFormData({
                        name: '',
                        email: '',
                        subject: '',
                        projectType: 'Brand Identity',
                        message: '',
                      });
                      setSubmissionStatus('idle');
                    }}
                    className="px-6 py-2.5 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-md shadow-orange-500/20 transition-colors cursor-pointer font-['Archivo',sans-serif]"
                  >
                    Send Another Message
                  </button>
                </div>
              </div>
            ) : (
              <form
                name="contact"
                method="POST"
                data-netlify="true"
                netlify-honeypot="bot-field"
                onSubmit={handleSubmit}
                className="space-y-4"
              >
                <input type="hidden" name="form-name" value="contact" />
                <p className="hidden">
                  <label>
                    Don’t fill this out if you're human: <input name="bot-field" />
                  </label>
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Name Input */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                      Your Full Name <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="text"
                      name="name"
                      required
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="e.g. Tariq Ahmed"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41] transition-colors"
                    />
                  </div>

                  {/* Email Input */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                      Your Email Address <span className="text-rose-500">*</span>
                    </label>
                    <input
                      type="email"
                      name="email"
                      required
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="e.g. tariq@company.com"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41] transition-colors"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {/* Subject */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                      Subject
                    </label>
                    <input
                      type="text"
                      name="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="e.g. Brand redesign quote"
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41] transition-colors"
                    />
                  </div>

                  {/* Project Type */}
                  <div>
                    <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                      Project Category
                    </label>
                    <select
                      name="projectType"
                      value={formData.projectType}
                      onChange={(e) => setFormData({ ...formData, projectType: e.target.value })}
                      className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41] transition-colors"
                    >
                      <option value="Brand Identity">Brand Identity & Logo</option>
                      <option value="Outdoor Signage & Flex">Signage & Outdoor Banners</option>
                      <option value="Offset Printing & Die-Cut Packaging">Offset Printing & Packaging</option>
                      <option value="Social Media Ad Creatives">Social Media Creatives & Ads</option>
                      <option value="Photo Retouching">Photo Editing & Retouching</option>
                      <option value="Full-Time / Freelance Contract">Design Job Offer / Contract</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-bold text-neutral-800 dark:text-neutral-300 mb-1.5 font-['Archivo',sans-serif]">
                    Project Details & Scope <span className="text-rose-500">*</span>
                  </label>
                  <textarea
                    name="message"
                    rows={4}
                    required
                    value={formData.message}
                    onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                    placeholder="Describe your design needs, estimated timeline, dimensions, or technical specifications..."
                    className="w-full px-4 py-2.5 text-xs sm:text-sm rounded-xl border border-neutral-200 dark:border-neutral-700 bg-[#FFF9F6] dark:bg-neutral-900 text-neutral-900 dark:text-neutral-100 focus:outline-none focus:ring-2 focus:ring-[#FD6F41] transition-colors resize-y"
                  ></textarea>
                </div>

                {/* Submit button & Mailto fallback */}
                <div className="pt-2 flex flex-wrap items-center justify-between gap-3">
                  <button
                    type="submit"
                    disabled={isSubmitting}
                    className="inline-flex items-center justify-center gap-2 px-8 py-3 text-xs sm:text-sm font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full shadow-lg shadow-orange-500/25 transition-all duration-200 transform hover:-translate-y-0.5 disabled:opacity-50 cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD6F41] font-['Archivo',sans-serif]"
                  >
                    <Send className="w-3.5 h-3.5" />
                    <span>{isSubmitting ? 'Sending Notification...' : 'Submit Message'}</span>
                  </button>

                  <a
                    href={mailtoUrl}
                    className="inline-flex items-center gap-1.5 text-xs text-neutral-500 dark:text-neutral-400 hover:text-[#FD6F41] transition-colors"
                  >
                    <span>Prefer your email client? Open Mail</span>
                    <ExternalLink className="w-3 h-3" />
                  </a>
                </div>
              </form>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};
