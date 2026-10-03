import React from 'react';
import { ExternalLink } from 'lucide-react';

interface FormattedDescriptionProps {
  text: string;
  className?: string;
  linkClassName?: string;
  showIcon?: boolean;
}

/**
 * Parses markdown-style links `[Text](https://url.com)` as well as raw URLs (`http://` or `https://`)
 * into secure, styled clickable hyperlinks.
 */
export const FormattedDescription: React.FC<FormattedDescriptionProps> = ({
  text,
  className = '',
  linkClassName = 'text-[#FD6F41] hover:underline font-bold inline-flex items-center gap-0.5 mx-0.5',
  showIcon = true,
}) => {
  if (!text) return null;

  // Pattern matches [label](url) or standalone http(s):// URLs
  const linkRegex = /\[([^\]]+)\]\((https?:\/\/[^\s)]+)\)|(https?:\/\/[^\s<]+[^<.,:;"')\]\s])/g;

  const elements: React.ReactNode[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    const matchIndex = match.index;

    // Text before the link
    if (matchIndex > lastIndex) {
      elements.push(text.substring(lastIndex, matchIndex));
    }

    if (match[1] && match[2]) {
      // Markdown link: [Label](URL)
      const label = match[1];
      const url = match[2];
      elements.push(
        <a
          key={`md-link-${matchIndex}`}
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={linkClassName}
          title={url}
        >
          <span>{label}</span>
          {showIcon && <ExternalLink className="w-3 h-3 inline shrink-0" />}
        </a>
      );
    } else if (match[3]) {
      // Raw URL
      const rawUrl = match[3];
      elements.push(
        <a
          key={`raw-link-${matchIndex}`}
          href={rawUrl}
          target="_blank"
          rel="noopener noreferrer"
          onClick={(e) => e.stopPropagation()}
          className={linkClassName}
          title={rawUrl}
        >
          <span className="truncate max-w-[200px] inline-block align-bottom">{rawUrl}</span>
          {showIcon && <ExternalLink className="w-3 h-3 inline shrink-0" />}
        </a>
      );
    }

    lastIndex = matchIndex + match[0].length;
  }

  // Trailing text
  if (lastIndex < text.length) {
    elements.push(text.substring(lastIndex));
  }

  return (
    <span className={`whitespace-pre-line ${className}`}>
      {elements}
    </span>
  );
};
