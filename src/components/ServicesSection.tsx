import React from 'react';
import { PenTool, Printer, Megaphone, Sparkles, ArrowRight } from 'lucide-react';

export const ServicesSection: React.FC = () => {
  const services = [
    {
      title: "Brand Identity & Logo",
      desc: "Distinctive vector monograms, typography hierarchy, comprehensive brand guidelines, stationery, and corporate identity systems.",
      tools: "Adobe Illustrator",
      badgeLight: "bg-purple-50 text-purple-600 dark:bg-purple-950/40 dark:text-purple-400",
      icon: PenTool,
    },
    {
      title: "Pre-Press & Offset Setup",
      desc: "4-color CMYK process separation, Pantone spot inks, die-cut packaging cartons, trapping, overprint control, and plate exposure files.",
      tools: "Pre-press & Packaging",
      badgeLight: "bg-amber-50 text-amber-600 dark:bg-amber-950/40 dark:text-amber-400",
      icon: Printer,
    },
    {
      title: "Outdoor Signage & Flex",
      desc: "Large-format outdoor billboards, architectural digital signs, acrylic 3D letters, backlit flex banners, and vinyl plot production.",
      tools: "AR Digital Sign",
      badgeLight: "bg-orange-50 text-[#FD6F41] dark:bg-orange-950/40 dark:text-orange-400",
      icon: Megaphone,
    },
    {
      title: "Social Media & Ad Creatives",
      desc: "High-conversion Facebook & Instagram banners, carousel storytelling, digital promotional campaigns, and photo retouching.",
      tools: "Adobe Photoshop",
      badgeLight: "bg-teal-50 text-teal-600 dark:bg-teal-950/40 dark:text-teal-400",
      icon: Sparkles,
    },
  ];

  return (
    <section id="services" className="py-16 md:py-24 bg-white dark:bg-[#121110] border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching reference */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
          <div>
            <span className="text-[#FD6F41] font-bold text-xs uppercase tracking-wider block mb-2 font-['Archivo',sans-serif]">
              Services
            </span>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight max-w-xl">
              I Provide Wide Range of Creative Services
            </h2>
          </div>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 max-w-md">
            Delivering print-ready files and digital marketing assets backed by 7+ years of hands-on agency and printing house production.
          </p>
        </div>

        {/* 4 Service Cards Grid (Matching download.png) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map((srv, idx) => {
            const Icon = srv.icon;
            return (
              <div
                key={idx}
                className="bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl p-6 sm:p-7 flex flex-col justify-between hover:shadow-xl hover:shadow-orange-500/10 hover:border-[#FD6F41]/40 transition-all duration-300 transform hover:-translate-y-1 group"
              >
                <div>
                  {/* Colorful Circular Icon Badge matching reference */}
                  <div className={`w-14 h-14 rounded-2xl ${srv.badgeLight} flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-7 h-7" />
                  </div>

                  <h3 className="text-base sm:text-lg font-bold text-[#111827] dark:text-white font-['Archivo',sans-serif] mb-2.5">
                    {srv.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 leading-relaxed mb-6">
                    {srv.desc}
                  </p>
                </div>

                <div className="pt-4 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                  <span className="font-semibold text-neutral-800 dark:text-neutral-300">{srv.tools}</span>
                  <a
                    href="#contact"
                    className="text-[#FD6F41] font-semibold flex items-center gap-1 group-hover:translate-x-1 transition-transform"
                  >
                    <span>Inquire</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
