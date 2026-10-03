import React, { useState } from 'react';
import { X, Check, Copy, Terminal, Globe, ShieldCheck, ArrowRight, ExternalLink } from 'lucide-react';

interface DeployGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const DeployGuideModal: React.FC<DeployGuideModalProps> = ({ isOpen, onClose }) => {
  const [copiedStep, setCopiedStep] = useState<number | null>(null);

  if (!isOpen) return null;

  const copyCode = (code: string, stepIndex: number) => {
    navigator.clipboard.writeText(code);
    setCopiedStep(stepIndex);
    setTimeout(() => setCopiedStep(null), 2000);
  };

  const gitSnippet = `git init
git add .
git commit -m "feat: Md. Ashraful Islam Senior Graphic Designer Portfolio"
git branch -M main
git remote add origin https://github.com/YOUR_GITHUB_USERNAME/ashraful-portfolio.git
git push -u origin main`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-neutral-950/80 backdrop-blur-md overflow-y-auto">
      <div className="relative w-full max-w-2xl bg-white dark:bg-neutral-900 border border-neutral-200 dark:border-neutral-800 rounded-2xl shadow-2xl p-6 sm:p-8 my-auto max-h-[92vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-neutral-200 dark:border-neutral-800 mb-6">
          <div className="flex items-center gap-2.5">
            <div className="p-2 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
              <Globe className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-lg font-black text-[#111827] dark:text-white font-['Archivo',sans-serif]">
                Deploy to GitHub + Netlify Guide
              </h3>
              <p className="text-xs text-neutral-500 dark:text-neutral-400">
                Pre-configured with <code className="text-[#FD6F41]">netlify.toml</code> & <code className="text-[#FD6F41]">_redirects</code>
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-neutral-400 hover:text-neutral-900 dark:hover:text-white rounded-lg hover:bg-neutral-100 dark:hover:bg-neutral-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Steps */}
        <div className="space-y-6 text-xs sm:text-sm">
          {/* Step 1 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60">
            <div className="flex items-center justify-between mb-2">
              <span className="font-bold text-neutral-900 dark:text-white flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-xs">1</span>
                <span>Push to GitHub Repository</span>
              </span>
              <button
                onClick={() => copyCode(gitSnippet, 1)}
                className="inline-flex items-center gap-1 text-xs text-neutral-500 hover:text-neutral-900 dark:hover:text-white"
              >
                {copiedStep === 1 ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copiedStep === 1 ? 'Copied' : 'Copy Git Commands'}</span>
              </button>
            </div>
            <pre className="p-3 bg-neutral-900 text-neutral-200 font-mono text-[11px] rounded-lg overflow-x-auto leading-relaxed">
              {gitSnippet}
            </pre>
          </div>

          {/* Step 2 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-xs">2</span>
              <span>Import to Netlify (Zero Configuration)</span>
            </div>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 text-xs">
              <li>Log in to <strong className="text-neutral-900 dark:text-white">app.netlify.com</strong></li>
              <li>Click <strong>"Add new site"</strong> → <strong>"Import an existing project"</strong> → Select <strong>GitHub</strong></li>
              <li>Choose your <strong>ashraful-portfolio</strong> repository</li>
              <li>Netlify will automatically detect the pre-configured <code className="bg-neutral-200 dark:bg-neutral-700 px-1 py-0.5 rounded">netlify.toml</code>:
                <div className="mt-1 pl-4 font-mono text-[11px] text-amber-700 dark:text-amber-400">
                  Build command: npm run build<br />
                  Publish directory: dist
                </div>
              </li>
              <li>Click <strong>Deploy site</strong> — it will be live with free SSL in ~30 seconds!</li>
            </ul>
          </div>

          {/* Step 3 */}
          <div className="p-4 rounded-xl bg-neutral-50 dark:bg-neutral-800/40 border border-neutral-200 dark:border-neutral-700/60">
            <div className="flex items-center gap-2 font-bold text-neutral-900 dark:text-white mb-2">
              <span className="w-5 h-5 rounded-full bg-amber-500 text-neutral-950 font-bold flex items-center justify-center text-xs">3</span>
              <span>Activate Email Notifications on Netlify</span>
            </div>
            <p className="text-xs text-neutral-600 dark:text-neutral-300 mb-2 leading-relaxed">
              Because our contact form includes <code className="text-amber-600">data-netlify="true"</code>, Netlify will capture all inquiries automatically:
            </p>
            <ul className="list-disc list-inside text-neutral-600 dark:text-neutral-300 space-y-1 text-xs">
              <li>In your Netlify Dashboard, navigate to <strong>Site settings → Forms</strong></li>
              <li>Under <strong>Form notifications</strong>, click <strong>"Add notification"</strong> → <strong>Email notification</strong></li>
              <li>Enter your email address: <code className="font-semibold text-neutral-900 dark:text-white">milonpabna92@gmail.com</code></li>
              <li>Every time a client submits the contact form, you'll receive an instant email notification!</li>
            </ul>
          </div>
        </div>

        <div className="mt-6 pt-4 border-t border-neutral-200 dark:border-neutral-800 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 text-xs font-semibold text-white bg-neutral-900 dark:bg-amber-500 dark:text-neutral-950 rounded-lg hover:bg-neutral-800 dark:hover:bg-amber-400 transition-colors"
          >
            Got it, Close Guide
          </button>
        </div>
      </div>
    </div>
  );
};
