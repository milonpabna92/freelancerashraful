import React from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Check, Compass, Phone, MapPin, User, Heart, Globe, Award } from 'lucide-react';

export const About: React.FC = () => {
  const { personalInfo, professionalQualifications, referencePerson } = usePortfolioData();

  return (
    <section id="about" className="py-16 md:py-24 bg-white dark:bg-[#121110] border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#FD6F41] font-bold text-xs uppercase tracking-wider block mb-2 font-['Archivo',sans-serif]">
            Profile & Background
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight">
            About {personalInfo.name}
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2">
            A comprehensive look at professional background, qualifications, core capabilities, and personal declaration from the official curriculum vitae.
          </p>
        </div>

        {/* Top Split: Career Objective & Professional Qualifications */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mb-12">
          {/* Career Objective & Biography */}
          <div className="lg:col-span-6 bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 flex flex-col justify-between shadow-xs">
            <div>
              <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-4 flex items-center gap-2">
                <Compass className="w-5 h-5 text-[#FD6F41]" />
                <span>Career Objective & Vision</span>
              </h3>
              <p className="text-sm sm:text-base text-neutral-700 dark:text-neutral-300 leading-relaxed mb-6">
                "{personalInfo.careerObjective}"
              </p>
              <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed">
                {personalInfo.aboutStory || `With a specialized journey through commercial printing houses and creative agencies in Pabna, ${personalInfo.name} merges high-aesthetic vector design in Adobe Illustrator with the technical exactness needed for 4-color offset pre-press, die-cutting, spot finishes, and large-scale architectural digital signage.`}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-neutral-200/60 dark:border-neutral-800 grid grid-cols-2 gap-4 text-xs">
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block mb-0.5">Present Address</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-200">{personalInfo.presentAddress}</span>
              </div>
              <div>
                <span className="text-neutral-500 dark:text-neutral-400 block mb-0.5">Permanent Address</span>
                <span className="font-medium text-neutral-900 dark:text-neutral-200">{personalInfo.permanentAddress}</span>
              </div>
            </div>
          </div>

          {/* Professional Qualifications */}
          <div className="lg:col-span-6 bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-4 flex items-center gap-2">
              <Award className="w-5 h-5 text-[#FD6F41]" />
              <span>Professional Qualifications</span>
            </h3>
            <ul className="space-y-3.5">
              {professionalQualifications.map((item, idx) => (
                <li key={idx} className="flex items-start gap-3 text-xs sm:text-sm text-neutral-700 dark:text-neutral-300 leading-snug">
                  <span className="mt-0.5 p-1 rounded-md bg-orange-100 dark:bg-orange-950/40 text-[#FD6F41] shrink-0">
                    <Check className="w-3.5 h-3.5" />
                  </span>
                  <span>{item}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Middle Row: Personal Details & Languages */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-8 mb-12">
          {/* Personal Details Table */}
          <div className="lg:col-span-6 bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
            <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-4 flex items-center gap-2">
              <User className="w-5 h-5 text-[#FD6F41]" />
              <span>Personal Details (From CV)</span>
            </h3>
            <div className="divide-y divide-neutral-200/60 dark:divide-neutral-800 text-xs sm:text-sm">
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Full Name</span>
                <span className="font-semibold text-neutral-900 dark:text-neutral-100">{personalInfo.name}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Father's Name</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{personalInfo.personalDetails.fatherName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Mother's Name</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{personalInfo.personalDetails.motherName}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Date of Birth</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{personalInfo.personalDetails.dob}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Nationality</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">{personalInfo.personalDetails.nationality}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Blood Group</span>
                <span className="font-semibold text-rose-600 dark:text-rose-400">{personalInfo.personalDetails.bloodGroup}</span>
              </div>
              <div className="py-2.5 flex items-center justify-between">
                <span className="text-neutral-500 dark:text-neutral-400">Religion & Marital Status</span>
                <span className="font-medium text-neutral-800 dark:text-neutral-200">
                  {personalInfo.personalDetails.religion} · {personalInfo.personalDetails.maritalStatus}
                </span>
              </div>
            </div>
          </div>

          {/* Languages & References */}
          <div className="lg:col-span-6 flex flex-col gap-6">
            {/* Languages */}
            <div className="bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
              <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-4 flex items-center gap-2">
                <Globe className="w-5 h-5 text-[#FD6F41]" />
                <span>Languages</span>
              </h3>
              <div className="space-y-4">
                {personalInfo.languages.map((lang) => (
                  <div key={lang.name}>
                    <div className="flex justify-between items-center text-xs sm:text-sm mb-1.5">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-100">{lang.name}</span>
                      <span className="text-neutral-500 dark:text-neutral-400 text-xs">{lang.level}</span>
                    </div>
                    <div className="w-full h-2 rounded-full bg-neutral-200/70 dark:bg-neutral-800 overflow-hidden">
                      <div
                        className="h-full bg-gradient-to-r from-[#FD6F41] to-[#FF8C66] rounded-full transition-all duration-700"
                        style={{ width: `${lang.proficiency}%` }}
                      ></div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Reference Card */}
            <div className="bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xs">
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-base font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                  Official CV Reference
                </h3>
                <span className="text-xs text-neutral-500 dark:text-neutral-400">Verified Contact</span>
              </div>
              <div className="p-4 rounded-xl bg-white dark:bg-[#121110] border border-orange-100/60 dark:border-neutral-700/60">
                <p className="font-bold text-sm text-neutral-900 dark:text-neutral-100">{referencePerson.name}</p>
                <p className="text-xs text-[#FD6F41] font-semibold mb-1 font-['Archivo',sans-serif]">{referencePerson.role}</p>
                <div className="space-y-1 text-xs text-neutral-600 dark:text-neutral-400">
                  <p className="flex items-center gap-1.5">
                    <Phone className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{referencePerson.phone}</span>
                  </p>
                  <p className="flex items-center gap-1.5">
                    <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                    <span>{referencePerson.location}</span>
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Hobbies Section */}
        <div className="bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-8 shadow-xs">
          <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-2 flex items-center gap-2">
            <Heart className="w-5 h-5 text-rose-500" />
            <span>Hobbies & Personal Interests (From CV)</span>
          </h3>
          <p className="text-xs sm:text-sm text-neutral-500 dark:text-neutral-400 mb-6">
            Creative pursuits that inspire artistic perspective, visual composition, and balanced craftsmanship.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {personalInfo.hobbies.map((hobby) => (
              <div
                key={hobby.name}
                className="p-4 rounded-xl bg-white dark:bg-[#121110] border border-orange-100/60 dark:border-neutral-700/60 hover:border-[#FD6F41] transition-colors"
              >
                <h4 className="text-sm font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                  {hobby.name}
                </h4>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {hobby.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
