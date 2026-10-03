import React, { useState, useMemo } from 'react';
import { Project } from '../types';
import { usePortfolioData } from '../context/PortfolioDataContext';
import { ProjectLightbox } from './ProjectLightbox';
import { FormattedDescription } from './FormattedDescription';
import { ArrowUpRight, Eye, Layers, ExternalLink } from 'lucide-react';

export const ProjectsGallery: React.FC = () => {
  const { projects } = usePortfolioData();
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);

  // Dynamically compute category tabs based on all available projects
  const categories = useMemo(() => {
    const defaultList = [
      { id: 'all', label: 'All' },
      { id: 'print', label: 'Signage & Outdoor' },
      { id: 'branding', label: 'Brand Identity' },
      { id: 'packaging', label: 'Packaging & Offset' },
      { id: 'social', label: 'Social Media & Ads' },
    ];

    // Find any custom categories added by the user
    const existingIds = new Set(defaultList.map((c) => c.id));
    const extraCategories: { id: string; label: string }[] = [];

    projects.forEach((p) => {
      if (p.category && !existingIds.has(p.category)) {
        existingIds.add(p.category);
        extraCategories.push({
          id: p.category,
          label: p.categoryLabel || p.category,
        });
      }
    });

    return [...defaultList, ...extraCategories];
  }, [projects]);

  const filteredProjects = activeCategory === 'all'
    ? projects
    : projects.filter((p) => p.category === activeCategory);

  return (
    <section id="projects" className="py-16 md:py-24 bg-white dark:bg-[#121110] border-b border-neutral-200/80 dark:border-neutral-800/80 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header matching download.png */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <span className="text-[#FD6F41] font-bold text-xs uppercase tracking-wider block mb-2 font-['Archivo',sans-serif]">
            Portfolio
          </span>
          <h2 className="text-2xl sm:text-3xl lg:text-4xl font-black text-[#111827] dark:text-white font-['Archivo',sans-serif] tracking-tight">
            My Amazing Works
          </h2>
          <p className="text-sm text-neutral-600 dark:text-neutral-400 mt-2">
            Selected showcase of commercial signage, luxury packaging, brand systems, and high-conversion marketing campaigns.
          </p>

          {/* Filter Tabs matching reference */}
          <div className="flex flex-wrap items-center justify-center gap-2 mt-8">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-5 py-2 text-xs sm:text-sm font-bold rounded-full transition-all duration-200 cursor-pointer font-['Archivo',sans-serif] ${
                  activeCategory === cat.id
                    ? 'bg-[#FD6F41] text-white shadow-md shadow-orange-500/25'
                    : 'text-neutral-600 dark:text-neutral-400 hover:text-[#FD6F41] dark:hover:text-[#FD6F41] bg-neutral-100 dark:bg-neutral-800'
                }`}
              >
                {cat.label}
              </button>
            ))}
          </div>
        </div>

        {/* Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-6">
          {filteredProjects.map((project, index) => {
            const isWide = project.aspectRatio === 'wide' || (index === 0 && filteredProjects.length > 2);
            const colSpanClass = isWide ? 'lg:col-span-8' : 'lg:col-span-4';

            return (
              <div
                key={project.id}
                onClick={() => setSelectedProject(project)}
                className={`${colSpanClass} group relative bg-[#FFF9F6] dark:bg-[#1C1A18] border border-orange-100/80 dark:border-neutral-800 rounded-2xl overflow-hidden shadow-xs hover:border-[#FD6F41] transition-all duration-300 flex flex-col cursor-pointer transform hover:-translate-y-1`}
              >
                {/* Media Container */}
                <div className={`relative w-full overflow-hidden bg-neutral-100 dark:bg-neutral-800 ${
                  isWide ? 'aspect-[16/9]' : 'aspect-[4/3]'
                }`}>
                  <img
                    src={project.image}
                    alt={project.title}
                    referrerPolicy="no-referrer"
                    className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500 ease-out"
                  />

                  {/* Contrast gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#111827]/90 via-[#111827]/30 to-transparent opacity-80 group-hover:opacity-95 transition-opacity"></div>

                  {/* Corner affordance */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-neutral-900/90 text-neutral-800 dark:text-white flex items-center justify-center shadow-xs opacity-0 group-hover:opacity-100 transition-opacity">
                    <ArrowUpRight className="w-4 h-4 text-[#FD6F41]" />
                  </div>

                  {/* Overlaid Info */}
                  <div className="absolute bottom-4 left-4 right-4 text-white">
                    <div className="flex items-center gap-2 text-xs text-neutral-300 mb-1">
                      <span className="text-orange-300 font-semibold">{project.categoryLabel || project.category}</span>
                      {project.year && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="tabular-nums">{project.year}</span>
                        </>
                      )}
                      {project.client && (
                        <>
                          <span aria-hidden="true">·</span>
                          <span className="truncate">{project.client}</span>
                        </>
                      )}
                    </div>

                    <h3 className="text-base sm:text-lg font-black font-['Archivo',sans-serif] leading-snug tracking-tight text-white group-hover:text-orange-200 transition-colors">
                      {project.title}
                    </h3>
                  </div>
                </div>

                {/* Details Footer */}
                <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
                  <div className="text-xs sm:text-sm text-neutral-600 dark:text-neutral-400 line-clamp-2 mb-4 leading-relaxed">
                    <FormattedDescription text={project.summary} />
                  </div>

                  <div className="pt-3 border-t border-neutral-200/60 dark:border-neutral-800 flex items-center justify-between text-xs text-neutral-500 dark:text-neutral-400">
                    <div className="flex items-center gap-2 truncate">
                      {project.tools && project.tools.length > 0 ? (
                        <span className="font-medium text-neutral-700 dark:text-neutral-300 truncate">
                          {project.tools.slice(0, 2).join(' · ')}
                        </span>
                      ) : (
                        <span className="text-neutral-400">Pre-Press & Design</span>
                      )}
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      {project.linkUrl && (
                        <a
                          href={project.linkUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          onClick={(e) => e.stopPropagation()}
                          className="inline-flex items-center gap-1 text-[11px] font-bold text-neutral-700 dark:text-neutral-300 hover:text-[#FD6F41] bg-neutral-100 dark:bg-neutral-800 px-2.5 py-1 rounded-full font-['Archivo',sans-serif]"
                          title="Open external project link"
                        >
                          <span>{project.linkLabel || 'Live'}</span>
                          <ExternalLink className="w-3 h-3 text-[#FD6F41]" />
                        </a>
                      )}

                      <span className="inline-flex items-center gap-1 text-[#FD6F41] font-bold group-hover:underline font-['Archivo',sans-serif]">
                        <span>View</span>
                        <Eye className="w-3.5 h-3.5" />
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty state fallback */}
        {filteredProjects.length === 0 && (
          <div className="text-center py-16 bg-neutral-100/50 dark:bg-neutral-900/50 rounded-2xl border border-neutral-200 dark:border-neutral-800">
            <Layers className="w-8 h-8 text-neutral-400 mx-auto mb-2" />
            <p className="text-sm font-medium text-neutral-700 dark:text-neutral-300">
              No projects found in this category.
            </p>
            <button
              onClick={() => setActiveCategory('all')}
              className="mt-3 px-4 py-1.5 text-xs text-[#FD6F41] font-semibold hover:underline"
            >
              Reset to All Projects
            </button>
          </div>
        )}
      </div>

      {/* Lightbox / Modal */}
      <ProjectLightbox
        project={selectedProject}
        projects={projects}
        onClose={() => setSelectedProject(null)}
        onSelectProject={(p) => setSelectedProject(p)}
      />
    </section>
  );
};
