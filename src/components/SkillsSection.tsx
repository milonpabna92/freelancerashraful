import React from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Printer } from 'lucide-react';

export const SkillsSection: React.FC = () => {
  const { skillBars, prepressChecklist, personalInfo } = usePortfolioData();

  const midPoint = Math.ceil(skillBars.length / 2);
  const leftSkills = skillBars.slice(0, midPoint);
  const rightSkills = skillBars.slice(midPoint);

  return (
    <section id="skills" className="py-16 md:py-24 bg-[#FFF9F6] dark:bg-[#121110] border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center max-w-2xl mx-auto mb-14">
          <span className="text-[#FD6F41] font-bold text-xs uppercase tracking-wider block mb-2 font-['Archivo',sans-serif]">
            Why Choose Me
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight">
            My Experience Area
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Technical mastery demonstrated across 7+ years of commercial print house and agency production.
          </p>
        </div>

        {/* 2-Column Progress Bar Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-6 max-w-5xl mx-auto mb-16">
          {/* Left Column */}
          <div className="space-y-6">
            {leftSkills.map((skill, idx) => (
              <div key={skill.id || idx}>
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-2 font-['Archivo',sans-serif]">
                  <span className="text-[#111827] dark:text-neutral-200">{skill.name}</span>
                  <span className="text-[#FD6F41] font-bold font-mono tabular-nums">{skill.percentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FD6F41] to-[#FF8C66] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>

          {/* Right Column */}
          <div className="space-y-6">
            {rightSkills.map((skill, idx) => (
              <div key={skill.id || idx}>
                <div className="flex justify-between items-center text-xs sm:text-sm font-bold mb-2 font-['Archivo',sans-serif]">
                  <span className="text-[#111827] dark:text-neutral-200">{skill.name}</span>
                  <span className="text-[#FD6F41] font-bold font-mono tabular-nums">{skill.percentage}%</span>
                </div>
                <div className="w-full h-2.5 rounded-full bg-neutral-200/70 dark:bg-neutral-800 overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-[#FD6F41] to-[#FF8C66] rounded-full transition-all duration-700 ease-out"
                    style={{ width: `${skill.percentage}%` }}
                  ></div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Specialized Feature: The Pre-Press & Offset Standard */}
        <div className="bg-white dark:bg-[#1C1A18] rounded-2xl p-6 sm:p-8 border border-neutral-200/80 dark:border-neutral-800 shadow-sm">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6 pb-6 border-b border-neutral-100 dark:border-neutral-800">
            <div>
              <div className="flex items-center gap-2 text-xs font-bold text-[#FD6F41] uppercase tracking-wider mb-1 font-['Archivo',sans-serif]">
                <Printer className="w-4 h-4" />
                <span>Production Specialization</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-black font-['Archivo',sans-serif] text-[#111827] dark:text-white">
                The Offset & Signage Pre-Press Standard
              </h3>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400 max-w-md">
              How {personalInfo.name} guarantees zero press-stops, color shifts, or misalignments when handing off vector artwork to commercial offset printers and large format plotters.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
            {prepressChecklist.map((item, i) => (
              <div key={item.id || i} className="p-4 rounded-xl bg-[#FFF9F6] dark:bg-[#141210] border border-orange-100/70 dark:border-neutral-800">
                <div className="flex items-center gap-2 text-sm font-bold font-['Archivo',sans-serif] text-[#111827] dark:text-neutral-200 mb-1.5">
                  <span className="w-5 h-5 rounded-full bg-orange-100 dark:bg-orange-950/60 text-[#FD6F41] flex items-center justify-center text-xs font-mono font-bold">
                    {i + 1}
                  </span>
                  <span>{item.title}</span>
                </div>
                <p className="text-xs text-neutral-600 dark:text-neutral-400 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};
