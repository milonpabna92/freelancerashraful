import React, { useRef, useState } from 'react';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ArrowUp, FileDown, ExternalLink } from 'lucide-react';

interface FooterProps {
  onOpenResume: () => void;
  onOpenDeployGuide: () => void;
  onOpenAdmin: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenResume, onOpenDeployGuide, onOpenAdmin }) => {
  const { personalInfo, downloadCv, isDownloading } = usePortfolioData();

  // Secret Gesture on the footer dot (same as Navbar dot: 3 clicks -> 4-7s hold -> 3 clicks)
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

    if (stageRef.current === 'WAIT_HOLD' || (stageRef.current === 'FIRST_CLICKS' && firstClicksRef.current >= 2)) {
      holdFeedbackTimerRef.current = setTimeout(() => {
        setDotVisualState('holding_ready');
      }, 4000);
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
        resetSecretSequence();
      }
      return;
    }

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

    if (holdDuration < 900) {
      if (stageRef.current === 'FIRST_CLICKS') {
        firstClicksRef.current += 1;
        if (firstClicksRef.current >= 3) {
          stageRef.current = 'WAIT_HOLD';
          scheduleInactivityReset(6000);
        } else {
          scheduleInactivityReset(3500);
        }
      } else if (stageRef.current === 'WAIT_HOLD') {
        firstClicksRef.current = 3;
        scheduleInactivityReset(6000);
      }
    } else {
      resetSecretSequence();
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <footer className="bg-white dark:bg-[#121110] border-t border-orange-100/80 dark:border-neutral-800 py-12 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6 pb-8 border-b border-neutral-200/60 dark:border-neutral-800">
          <div>
            <div className="flex items-center gap-0.5 mb-1 select-none">
              <span className="text-xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                {personalInfo.brandName || 'Ashraful'}
              </span>
              <span
                onPointerDown={handleDotPointerDown}
                onPointerUp={handleDotPointerUp}
                onContextMenu={(e) => e.preventDefault()}
                className={`text-2xl leading-none cursor-default select-none px-0.5 transition-all duration-200 ${
                  dotVisualState === 'holding_ready'
                    ? 'text-emerald-500 scale-150'
                    : dotVisualState === 'ready_for_final'
                    ? 'text-amber-500 scale-125'
                    : 'text-[#FD6F41]'
                }`}
              >
                .
              </span>
            </div>
            <p className="text-xs text-neutral-500 dark:text-neutral-400">
              {personalInfo.role} · {personalInfo.footerSubtitle || 'Pre-Press & Offset Printing Specialist'}
            </p>
          </div>

          <div className="flex flex-wrap items-center gap-3">
            {/* Guaranteed Direct CV Download */}
            <button
              onClick={downloadCv}
              disabled={isDownloading}
              className="inline-flex items-center gap-1.5 px-5 py-2 text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] rounded-full transition-colors shadow-sm cursor-pointer font-['Archivo',sans-serif]"
              title="Download official 2-page CV PDF"
            >
              <FileDown className="w-3.5 h-3.5" />
              <span>{isDownloading ? 'Downloading...' : 'Download CV (PDF)'}</span>
            </button>

            <button
              onClick={onOpenResume}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-neutral-700 dark:text-neutral-300 hover:text-[#FD6F41] dark:hover:text-[#FD6F41] transition-colors cursor-pointer font-['Archivo',sans-serif]"
            >
              <span>View Full CV</span>
            </button>

            <button
              onClick={onOpenDeployGuide}
              className="inline-flex items-center gap-1.5 px-3 py-2 text-xs font-bold text-neutral-400 hover:text-neutral-800 dark:hover:text-neutral-200 transition-colors cursor-pointer font-['Archivo',sans-serif]"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Deploy Guide</span>
            </button>

            <button
              onClick={scrollToTop}
              aria-label="Back to top"
              className="p-2.5 rounded-full bg-neutral-100 dark:bg-neutral-800 text-neutral-600 dark:text-neutral-300 hover:bg-orange-100/70 hover:text-[#FD6F41] transition-colors cursor-pointer"
            >
              <ArrowUp className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="pt-6 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-neutral-500 dark:text-neutral-400">
          <div className="flex flex-wrap items-center gap-3">
            <span className="select-none cursor-default">
              © {new Date().getFullYear()} {personalInfo.name}
            </span>
            <span aria-hidden="true">·</span>
            <span>Pabna, Bangladesh</span>
            <span aria-hidden="true">·</span>
            <a
              href={personalInfo.behanceUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FD6F41] transition-colors"
            >
              Behance
            </a>
            <span aria-hidden="true">·</span>
            <a
              href={personalInfo.facebookUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-[#FD6F41] transition-colors"
            >
              Facebook
            </a>
          </div>

          <div className="text-right">
            <span>Senior Graphic Designer Portfolio</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
