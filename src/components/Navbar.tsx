import React, { useState, useRef } from 'react';
import { useTheme } from '../context/ThemeContext';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { Sun, Moon, FileDown, Menu, X } from 'lucide-react';

interface NavbarProps {
  onOpenResume: () => void;
  onOpenDeployGuide: () => void;
  onOpenAdmin: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenResume, onOpenDeployGuide, onOpenAdmin }) => {
  const { theme, toggleTheme } = useTheme();
  const { downloadCv, isDownloading } = usePortfolioData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Secret Triple-Click on the brand dot opens the hidden Admin Panel
  const clickCountRef = useRef(0);
  const clickTimerRef = useRef<any>(null);

  const handleSecretBrandDotClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    clickCountRef.current += 1;

    if (clickTimerRef.current) {
      clearTimeout(clickTimerRef.current);
    }

    if (clickCountRef.current >= 3) {
      clickCountRef.current = 0;
      onOpenAdmin();
    } else {
      clickTimerRef.current = setTimeout(() => {
        clickCountRef.current = 0;
      }, 1000);
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFF9F6]/90 dark:bg-[#121110]/90 border-b border-orange-100/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand mark (e.g. "Ashraful.") with hidden admin trigger on the dot */}
        <div className="flex items-center">
          <a
            href="#"
            className="text-2xl font-black tracking-tight text-[#111827] dark:text-white font-['Archivo',sans-serif] hover:opacity-90 transition-opacity whitespace-nowrap flex items-center select-none"
          >
            <span>Ashraful</span>
            {/* The secret dot: Triple-click this orange dot to secretly open the admin panel */}
            <span
              onClick={handleSecretBrandDotClick}
              className="text-[#FD6F41] text-3xl leading-none cursor-default active:scale-125 transition-transform"
              title=""
            >
              .
            </span>
          </a>
        </div>

        {/* Zone 2: Clean, professional navigation links (no admin clutter for visitors) */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-bold text-neutral-600 dark:text-neutral-400 font-['Archivo',sans-serif]">
          <a href="#" className="text-[#FD6F41]">Home</a>
          <a href="#services" className="hover:text-[#FD6F41] transition-colors">Services</a>
          <a href="#skills" className="hover:text-[#FD6F41] transition-colors">Experience</a>
          <a href="#projects" className="hover:text-[#FD6F41] transition-colors">Works</a>
          <a href="#about" className="hover:text-[#FD6F41] transition-colors">About</a>
          <a href="#contact" className="hover:text-[#FD6F41] transition-colors">Contact</a>
        </nav>

        {/* Zone 3: Actions + Theme Toggle & CV Download */}
        <div className="flex items-center gap-2 sm:gap-3">
          {/* Theme Toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 text-neutral-600 hover:text-neutral-900 dark:text-neutral-400 dark:hover:text-white rounded-full hover:bg-orange-100/60 dark:hover:bg-neutral-800 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD6F41] cursor-pointer"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-neutral-700" />}
          </button>

          {/* Guaranteed Direct CV Download Button */}
          <button
            onClick={downloadCv}
            disabled={isDownloading}
            className="flex items-center gap-1.5 px-5 sm:px-6 py-2.5 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full transition-all shadow-md shadow-orange-500/20 whitespace-nowrap focus:outline-none focus-visible:ring-2 focus-visible:ring-[#FD6F41] cursor-pointer font-['Archivo',sans-serif]"
            title="Download official CV PDF"
          >
            <FileDown className="w-3.5 h-3.5" />
            <span>{isDownloading ? 'Downloading...' : 'Download CV'}</span>
          </button>

          {/* Mobile menu trigger */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle menu"
            className="md:hidden p-2 text-neutral-600 dark:text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-900 transition-colors"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu dropdown */}
      {mobileMenuOpen && (
        <div className="md:hidden px-4 pt-2 pb-6 bg-[#FFF9F6] dark:bg-[#121110] border-b border-orange-100 dark:border-neutral-800 space-y-3 font-['Archivo',sans-serif]">
          <a
            href="#"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-[#FD6F41]"
          >
            Home
          </a>
          <a
            href="#services"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          >
            Services
          </a>
          <a
            href="#skills"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          >
            Experience
          </a>
          <a
            href="#projects"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          >
            Works
          </a>
          <a
            href="#about"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          >
            About
          </a>
          <a
            href="#contact"
            onClick={() => setMobileMenuOpen(false)}
            className="block text-sm font-bold text-neutral-700 dark:text-neutral-300"
          >
            Contact
          </a>

          <div className="pt-2 flex flex-col gap-2">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                onOpenResume();
              }}
              className="flex items-center justify-center gap-1.5 py-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-xs font-bold text-neutral-800 dark:text-neutral-200"
            >
              <span>View Full CV</span>
            </button>
          </div>
        </div>
      )}
    </header>
  );
};
