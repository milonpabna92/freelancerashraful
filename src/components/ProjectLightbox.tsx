import React, { useEffect, useState } from 'react';
import { Project } from '../types';
import { FormattedDescription } from './FormattedDescription';
import { X, ChevronLeft, ChevronRight, Check, ZoomIn, ZoomOut, ExternalLink } from 'lucide-react';

interface ProjectLightboxProps {
  project: Project | null;
  projects: Project[];
  onClose: () => void;
  onSelectProject: (p: Project) => void;
}

export const ProjectLightbox: React.FC<ProjectLightboxProps> = ({
  project,
  projects,
  onClose,
  onSelectProject,
}) => {
  const [isZoomed, setIsZoomed] = useState(false);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (!project) return;
      const currentIndex = projects.findIndex((p) => p.id === project.id);
      if (e.key === 'ArrowRight' && currentIndex < projects.length - 1) {
        onSelectProject(projects[currentIndex + 1]);
        setIsZoomed(false);
      }
      if (e.key === 'ArrowLeft' && currentIndex > 0) {
        onSelectProject(projects[currentIndex - 1]);
        setIsZoomed(false);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [project, projects, onClose, onSelectProject]);

  if (!project) return null;

  const currentIndex = projects.findIndex((p) => p.id === project.id);
  const hasPrev = currentIndex > 0;
  const hasNext = currentIndex < projects.length - 1;

  const handlePrev = () => {
    if (hasPrev) {
      onSelectProject(projects[currentIndex - 1]);
      setIsZoomed(false);
    }
  };

  const handleNext = () => {
    if (hasNext) {
      onSelectProject(projects[currentIndex + 1]);
      setIsZoomed(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/85 backdrop-blur-md overflow-y-auto animate-in fade-in duration-200">
      <div className="relative w-full max-w-5xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl overflow-hidden my-auto max-h-[92vh] flex flex-col">
        {/* Top bar */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50">
          <div className="flex items-center gap-3 text-xs text-neutral-500 dark:text-neutral-400">
            <span className="font-semibold text-neutral-900 dark:text-white uppercase tracking-wider">
              {project.categoryLabel || project.category}
            </span>
            {project.year && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.year}</span>
              </>
            )}
            {project.client && (
              <>
                <span aria-hidden="true">·</span>
                <span>{project.client}</span>
              </>
            )}
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsZoomed(!isZoomed)}
              aria-label="Toggle zoom"
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              {isZoomed ? <ZoomOut className="w-4 h-4" /> : <ZoomIn className="w-4 h-4" />}
            </button>
            <button
              onClick={onClose}
              aria-label="Close modal"
              className="p-1.5 text-neutral-600 dark:text-neutral-400 hover:text-neutral-950 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Modal Body */}
        <div className="overflow-y-auto p-6 sm:p-8 space-y-6">
          {/* Main Showcase Image Frame */}
          <div className="relative rounded-xl overflow-hidden bg-neutral-950 flex items-center justify-center border border-neutral-200 dark:border-neutral-800">
            <img
              src={project.image}
              alt={project.title}
              referrerPolicy="no-referrer"
              className={`w-full max-h-[60vh] object-contain transition-transform duration-300 ${
                isZoomed ? 'scale-125 cursor-zoom-out' : 'cursor-zoom-in'
              }`}
              onClick={() => setIsZoomed(!isZoomed)}
            />

            {/* Navigation Overlays */}
            {hasPrev && (
              <button
                onClick={handlePrev}
                aria-label="Previous project"
                className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/70 text-white hover:bg-neutral-900 transition-colors backdrop-blur-sm cursor-pointer"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
            )}
            {hasNext && (
              <button
                onClick={handleNext}
                aria-label="Next project"
                className="absolute right-3 top-1/2 -translate-y-1/2 p-2 rounded-full bg-neutral-900/70 text-white hover:bg-neutral-900 transition-colors backdrop-blur-sm cursor-pointer"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            )}
          </div>

          {/* Project Details */}
          <div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-3">
              <h2 className="text-xl sm:text-2xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight">
                {project.title}
              </h2>

              {/* Direct Project Link Button if provided */}
              {project.linkUrl && (
                <a
                  href={project.linkUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 px-5 py-2.5 rounded-full text-xs font-bold text-white bg-[#FD6F41] hover:bg-[#E55B2F] transition-all shadow-md shadow-orange-500/20 shrink-0 font-['Archivo',sans-serif]"
                >
                  <span>{project.linkLabel || 'Open Project Link'}</span>
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              )}
            </div>

            {/* Description with automatic Hyperlink support */}
            <div className="text-sm sm:text-base text-neutral-600 dark:text-neutral-300 leading-relaxed mb-6">
              <FormattedDescription text={project.summary} />
            </div>

            {/* Spec Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200/80 dark:border-neutral-800 mb-6 text-xs">
              <div>
                <span className="text-neutral-400 block mb-0.5">Software Tools</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {project.tools && project.tools.length > 0 ? project.tools.join(', ') : 'Adobe Illustrator, Photoshop'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">Color Profile</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {project.colorProfile || 'CMYK (FOGRA39)'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">Client & Scope</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {project.client || 'Commercial Production'}
                </span>
              </div>
              <div>
                <span className="text-neutral-400 block mb-0.5">Location</span>
                <span className="font-semibold text-neutral-800 dark:text-neutral-200">
                  {project.location || 'Pabna & Bangladesh'}
                </span>
              </div>
            </div>

            {/* Challenge & Solution Grid (if present) */}
            {(project.challenge || project.solution) && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                {project.challenge && (
                  <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 mb-2 font-['Archivo',sans-serif]">
                      The Design Challenge
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {project.challenge}
                    </p>
                  </div>
                )}

                {project.solution && (
                  <div className="p-5 rounded-xl border border-neutral-200/80 dark:border-neutral-800 bg-white dark:bg-neutral-900">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-600 dark:text-emerald-400 mb-2 font-['Archivo',sans-serif]">
                      The Production Solution
                    </h4>
                    <p className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-300 leading-relaxed">
                      {project.solution}
                    </p>
                  </div>
                )}
              </div>
            )}

            {/* Deliverables List (if present) */}
            {project.deliverables && project.deliverables.length > 0 && (
              <div>
                <h4 className="text-xs font-bold uppercase tracking-wider text-neutral-500 dark:text-neutral-400 mb-3 font-['Archivo',sans-serif]">
                  Key Deliverables & Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {project.deliverables.map((item, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-xs text-neutral-700 dark:text-neutral-300">
                      <Check className="w-3.5 h-3.5 text-amber-500 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Footer controls */}
        <div className="flex items-center justify-between px-6 py-3.5 border-t border-neutral-200 dark:border-neutral-800 bg-neutral-50/50 dark:bg-neutral-900/50 text-xs text-neutral-500 dark:text-neutral-400">
          <span>Use Arrow Keys ← → to navigate</span>
          <div className="flex items-center gap-3">
            <button
              onClick={handlePrev}
              disabled={!hasPrev}
              className="hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Previous
            </button>
            <span aria-hidden="true">·</span>
            <button
              onClick={handleNext}
              disabled={!hasNext}
              className="hover:text-neutral-900 dark:hover:text-white disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
            >
              Next
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
