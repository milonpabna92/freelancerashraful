import React, { useState, useEffect } from 'react';
import { ThemeProvider } from './context/ThemeContext';
import { PortfolioDataProvider } from './context/PortfolioDataContext';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { ServicesSection } from './components/ServicesSection';
import { SkillsSection } from './components/SkillsSection';
import { ProjectsGallery } from './components/ProjectsGallery';
import { ExperienceEducation } from './components/ExperienceEducation';
import { About } from './components/About';
import { ContactSection } from './components/ContactSection';
import { Footer } from './components/Footer';
import { ResumeModal } from './components/ResumeModal';
import { DeployGuideModal } from './components/DeployGuideModal';
import { AdminPanelModal } from './components/AdminPanelModal';

export default function App() {
  const [isResumeModalOpen, setIsResumeModalOpen] = useState(false);
  const [isDeployGuideOpen, setIsDeployGuideOpen] = useState(false);
  const [isAdminOpen, setIsAdminOpen] = useState(false);

  // Shortcut (Ctrl + Shift + A) or URL hash #admin opens Admin Panel
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && (e.key === 'A' || e.key === 'a')) {
        e.preventDefault();
        setIsAdminOpen(true);
      }
    };

    const handleHash = () => {
      if (window.location.hash === '#admin') {
        setIsAdminOpen(true);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('hashchange', handleHash);
    handleHash();

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('hashchange', handleHash);
    };
  }, []);

  return (
    <ThemeProvider>
      <PortfolioDataProvider>
        <div className="min-h-screen flex flex-col bg-[#FFF9F6] text-[#1F2430] dark:bg-[#121110] dark:text-[#F4F4F6] transition-colors duration-200">
          {/* Navigation Bar with Admin trigger & Guaranteed CV Download */}
          <Navbar
            onOpenResume={() => setIsResumeModalOpen(true)}
            onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* Main Content Area */}
          <main className="flex-1">
            {/* Hero Section matching uploaded reference with real photo & direct CV upload */}
            <Hero
              onOpenResume={() => setIsResumeModalOpen(true)}
              onOpenAdmin={() => setIsAdminOpen(true)}
            />

            {/* Creative Services Grid */}
            <ServicesSection />

            {/* Experience Area with Skill Bars */}
            <SkillsSection />

            {/* Portfolio & My Amazing Works */}
            <ProjectsGallery />

            {/* Career & Education Timeline */}
            <ExperienceEducation />

            {/* About, Qualifications & Personal Details from CV */}
            <About />

            {/* Contact Section with Netlify email notifications */}
            <ContactSection />
          </main>

          {/* Footer */}
          <Footer
            onOpenResume={() => setIsResumeModalOpen(true)}
            onOpenDeployGuide={() => setIsDeployGuideOpen(true)}
            onOpenAdmin={() => setIsAdminOpen(true)}
          />

          {/* CV / Resume & Google Drive Download Modal */}
          <ResumeModal
            isOpen={isResumeModalOpen}
            onClose={() => setIsResumeModalOpen(false)}
            onOpenAdmin={() => {
              setIsResumeModalOpen(false);
              setIsAdminOpen(true);
            }}
          />

          {/* GitHub + Netlify Deployment Guide Modal */}
          <DeployGuideModal
            isOpen={isDeployGuideOpen}
            onClose={() => setIsDeployGuideOpen(false)}
          />

          {/* Comprehensive Admin Control Panel (Photo, CV PDF, Bio, Supabase) */}
          <AdminPanelModal
            isOpen={isAdminOpen}
            onClose={() => setIsAdminOpen(false)}
          />
        </div>
      </PortfolioDataProvider>
    </ThemeProvider>
  );
}
