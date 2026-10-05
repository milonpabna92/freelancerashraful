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
  const { personalInfo, downloadCv, isDownloading } = usePortfolioData();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Secret Gesture on the brand dot:
  // 1) 3 clicks -> 2) Hold for 4 to 7 seconds -> 3) 3 clicks -> Opens Admin Login Window
  const stageRef = useRef<'FIRST_CLICKS' | 'WAIT_HOLD' | 'FINAL_CLICKS'>('FIRST_CLICKS');
  const firstClicksRef = useRef(0);
  const finalClicksRef = useRef(0);
  const pointerDownTimeRef = useRef<number | null>(null);
  const resetTimerRef = useRef<any>(null);
  const holdFeedbackTimerRef = useRef<any>(null);
  const holdExpiredTimerRef = useRef<any>(null);

  const [dotVisualState, setDotVisualState] = useState<'normal' | 'holding_ready' | 'ready_for_final'>('normal');

  const resetSecretSequence = () => {
    stageRef.current = 'FIRST_CLICKS';
    firstClicksRef.current = 0;
    finalClicksRef.current = 0;
    pointerDownTimeRef.current = null;
    setDotVisualState('normal');
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (holdFeedbackTimerRef.current) clearTimeout(holdFeedbackTimerRef.current);
    if (holdExpiredTimerRef.current) clearTimeout(holdExpiredTimerRef.current);
  };

  const scheduleInactivityReset = (ms = 5000) => {
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    resetTimerRef.current = setTimeout(() => {
      resetSecretSequence();
    }, ms);
  };

  const handleDotPointerDown = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    pointerDownTimeRef.current = Date.now();
    if (resetTimerRef.current) clearTimeout(resetTimerRef.current);
    if (holdFeedbackTimerRef.current) clearTimeout(holdFeedbackTimerRef.current);
    if (holdExpiredTimerRef.current) clearTimeout(holdExpiredTimerRef.current);

    // If user is in WAIT_HOLD (after 3 clicks) or on the 3rd click itself (firstClicks >= 2)
    if (stageRef.current === 'WAIT_HOLD' || (stageRef.current === 'FIRST_CLICKS' && firstClicksRef.current >= 2)) {
      // At 4 seconds (4000ms), show subtle ready indicator on the dot
      holdFeedbackTimerRef.current = setTimeout(() => {
        setDotVisualState('holding_ready');
      }, 4000);

      // After 7.5 seconds, hold window expires
      holdExpiredTimerRef.current = setTimeout(() => {
        setDotVisualState('normal');
      }, 7500);
    }
  };

  const handleDotPointerUp = (e: React.PointerEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (holdFeedbackTimerRef.current) clearTimeout(holdFeedbackTimerRef.current);
    if (holdExpiredTimerRef.current) clearTimeout(holdExpiredTimerRef.current);

    if (pointerDownTimeRef.current === null) return;
    const holdDuration = Date.now() - pointerDownTimeRef.current;
    pointerDownTimeRef.current = null;

    // Stage 3: Final 3 clicks after valid 4-7s hold
    if (stageRef.current === 'FINAL_CLICKS') {
      if (holdDuration < 900) {
        finalClicksRef.current += 1;
        if (finalClicksRef.current >= 3) {
          resetSecretSequence();
          onOpenAdmin();
        } else {
          scheduleInactivityReset(5000);
        }
      } else {
        // Held too long during final clicks
        resetSecretSequence();
      }
      return;
    }

    // Stage 2: Checking for 4 to 7 second hold (3800ms to 7500ms tolerance)
    if (
      (stageRef.current === 'WAIT_HOLD' || (stageRef.current === 'FIRST_CLICKS' && firstClicksRef.current >= 2)) &&
      holdDuration >= 3800 &&
      holdDuration <= 7500
    ) {
      stageRef.current = 'FINAL_CLICKS';
      finalClicksRef.current = 0;
      setDotVisualState('ready_for_final');
      scheduleInactivityReset(6000);
      return;
    }

    // Stage 1: First 3 short clicks
    if (holdDuration < 900) {
      if (stageRef.current === 'FIRST_CLICKS') {
        firstClicksRef.current += 1;
        if (firstClicksRef.current >= 3) {
          stageRef.current = 'WAIT_HOLD';
          // Give user up to 6 seconds to start the 4-7 second hold
          scheduleInactivityReset(6000);
        } else {
          scheduleInactivityReset(3500);
        }
      } else if (stageRef.current === 'WAIT_HOLD') {
        // Extra short click while in WAIT_HOLD keeps it ready for the hold
        firstClicksRef.current = 3;
        scheduleInactivityReset(6000);
      }
    } else {
      // Invalid hold duration (e.g., 1-3 seconds or > 7.5 seconds) -> reset
      resetSecretSequence();
    }
  };

  return (
    <header className="sticky top-0 z-40 w-full backdrop-blur-md bg-[#FFF9F6]/90 dark:bg-[#121110]/90 border-b border-orange-100/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-18 flex items-center justify-between gap-4">
        {/* Zone 1: Single element brand mark (e.g. "Ashraful.") with hidden admin trigger on the dot */}
        <div className="flex items-center select-none">
          <a
            href="#"
            className="text-2xl font-black tracking-tight text-[#111827] dark:text-white font-['Archivo',sans-serif] hover:opacity-90 transition-opacity whitespace-nowrap"
          >
            {personalInfo.brandName || 'Ashraful'}
          </a>
          {/* The secret dot: 3 clicks -> 4-7s hold -> 3 clicks opens the admin login window */}
          <span
            onPointerDown={handleDotPointerDown}
            onPointerUp={handleDotPointerUp}
            onContextMenu={(e) => e.preventDefault()}
            onClick={(e) => {
              e.preventDefault();
              e.stopPropagation();
            }}
            className={`text-3xl leading-none cursor-default select-none px-0.5 transition-all duration-200 ${
              dotVisualState === 'holding_ready'
                ? 'text-emerald-500 scale-150 drop-shadow-[0_0_8px_rgba(16,185,129,0.8)]'
                : dotVisualState === 'ready_for_final'
                ? 'text-amber-500 scale-125'
                : 'text-[#FD6F41] active:scale-125'
            }`}
            title=""
          >
            .
          </span>
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
