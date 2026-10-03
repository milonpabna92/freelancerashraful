import React from 'react';
import { experiences, educationList } from '../data/portfolioData';
import { Briefcase, GraduationCap, MapPin, Calendar, CheckCircle } from 'lucide-react';

export const ExperienceEducation: React.FC = () => {
  return (
    <section id="experience" className="py-16 md:py-24 bg-white dark:bg-[#121110] border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-12">
          <span className="text-[#FD6F41] font-bold text-xs uppercase tracking-wider block mb-2 font-['Archivo',sans-serif]">
            Career Journey & Credentials
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight">
            Work Experience & Education
          </h2>
          <p className="text-sm sm:text-base text-neutral-600 dark:text-neutral-400 mt-2">
            A chronological timeline of agency and print production roles alongside academic commerce certifications from the Rajshahi Education Board.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Work Experience Column */}
          <div className="lg:col-span-7">
            <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-6 flex items-center gap-2">
              <Briefcase className="w-5 h-5 text-[#FD6F41]" />
              <span>Work Experience</span>
            </h3>

            <div className="space-y-8 relative before:absolute before:inset-0 before:left-3 before:w-0.5 before:bg-orange-200/60 dark:before:bg-neutral-800">
              {experiences.map((exp, idx) => (
                <div key={idx} className="relative pl-8 group">
                  {/* Timeline Dot */}
                  <div className={`absolute left-1.5 top-1.5 w-3.5 h-3.5 rounded-full border-2 bg-white dark:bg-[#121110] transition-colors ${
                    exp.current
                      ? 'border-[#FD6F41] bg-[#FD6F41] ring-4 ring-orange-500/20'
                      : 'border-neutral-400 dark:border-neutral-600'
                  }`}></div>

                  <div className="bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xs group-hover:border-[#FD6F41] transition-all duration-300">
                    <div className="flex flex-wrap items-baseline justify-between gap-2 mb-2">
                      <h4 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                        {exp.role}
                      </h4>
                      <span className="text-xs font-semibold tabular-nums text-[#FD6F41] font-['Archivo',sans-serif]">
                        {exp.period}
                      </span>
                    </div>

                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-neutral-600 dark:text-neutral-400 mb-4">
                      <span className="font-semibold text-neutral-900 dark:text-neutral-200">
                        {exp.company}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span className="flex items-center gap-1">
                        <MapPin className="w-3.5 h-3.5 text-neutral-400" />
                        {exp.location}
                      </span>
                      <span aria-hidden="true">·</span>
                      <span>{exp.type}</span>
                    </div>

                    <ul className="space-y-2.5 mb-5">
                      {exp.achievements.map((item, i) => (
                        <li key={i} className="flex items-start gap-2.5 text-xs sm:text-sm text-neutral-600 dark:text-neutral-300">
                          <CheckCircle className="w-3.5 h-3.5 text-[#FD6F41] mt-1 shrink-0" />
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Tools used line - unboxed text */}
                    <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex flex-wrap items-center gap-2 text-xs text-neutral-500 dark:text-neutral-400">
                      <span className="font-medium text-neutral-700 dark:text-neutral-300">Tools & Skills:</span>
                      {exp.toolsUsed.map((tool, tIdx) => (
                        <React.Fragment key={tool}>
                          <span>{tool}</span>
                          {tIdx < exp.toolsUsed.length - 1 && <span aria-hidden="true">·</span>}
                        </React.Fragment>
                      ))}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Education Column */}
          <div className="lg:col-span-5">
            <h3 className="text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-6 flex items-center gap-2">
              <GraduationCap className="w-5 h-5 text-[#FD6F41]" />
              <span>Academic Education</span>
            </h3>

            <div className="space-y-6">
              {educationList.map((edu, idx) => (
                <div
                  key={idx}
                  className="bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-7 shadow-xs hover:border-[#FD6F41] transition-all duration-300"
                >
                  <div className="flex items-center justify-between gap-2 mb-2">
                    <span className="text-xs font-semibold uppercase tracking-wider text-[#FD6F41] font-['Archivo',sans-serif]">
                      Commerce Group
                    </span>
                    <span className="text-xs font-bold tabular-nums text-neutral-500 dark:text-neutral-400 flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5" />
                      Passed {edu.passingYear}
                    </span>
                  </div>

                  <h4 className="text-base font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-1">
                    {edu.degree}
                  </h4>

                  <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300 mb-3">
                    {edu.institute}
                  </p>

                  <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-600 dark:text-neutral-400">
                    <div>
                      <span className="text-neutral-400 block text-[11px]">Board</span>
                      <span className="font-semibold text-neutral-800 dark:text-neutral-200">{edu.board}</span>
                    </div>
                    <div className="text-right">
                      <span className="text-neutral-400 block text-[11px]">Result</span>
                      <span className="font-bold text-[#FD6F41] tabular-nums font-['Archivo',sans-serif]">{edu.result}</span>
                    </div>
                  </div>
                </div>
              ))}

              {/* Verified declaration notice from CV */}
              <div className="p-5 rounded-2xl bg-white dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 text-xs text-neutral-600 dark:text-neutral-400 shadow-xs">
                <p className="font-bold text-[#111827] dark:text-neutral-200 mb-1 font-['Archivo',sans-serif]">
                  Official CV Declaration
                </p>
                <p className="italic leading-relaxed">
                  "I hereby declare that all the information provided in this CV is true, accurate, and complete to the best of my knowledge and belief. I take full responsibility for the authenticity of the information mentioned above and assure that I will perform my duties with sincerity, dedication, and professionalism."
                </p>
                <p className="mt-2 font-medium text-[#111827] dark:text-neutral-200 not-italic">
                  — Md. Ashraful Islam
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
