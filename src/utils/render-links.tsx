import React from 'react';

export const parseMarkdownLinks = (text: string): React.ReactNode => {
  const parts: React.ReactNode[] = [];
  let lastIndex = 0;

  const linkRegex = /\[([^\]]+)\]\(([^)]+)\)/g;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const linkText = match[1];
    const url = match[2];
    parts.push(
      <a
        key={match.index}
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="text-yellow underline hover:text-green transition-colors"
      >
        {linkText}
      </a>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? <>{parts}</> : text;
};

export const renderTextWithLinks = (text: string) => {
  const linkRegex =
    /<a\s+(?:[^>]*?\s+)?class="([^"]*)"\s+href="([^"]*)"\s*(?:target="([^"]*)")?>([^<]*)<\/a>/g;
  const parts: (string | JSX.Element)[] = [];
  let lastIndex = 0;
  let match: RegExpExecArray | null;

  while ((match = linkRegex.exec(text)) !== null) {
    if (match.index > lastIndex) {
      parts.push(text.substring(lastIndex, match.index));
    }

    const [, className, href, target, linkText] = match;
    parts.push(
      <a
        key={match.index}
        className={className}
        href={href}
        target={target || undefined}
        rel={target === '_blank' ? 'noopener noreferrer' : undefined}
      >
        {linkText}
      </a>,
    );

    lastIndex = match.index + match[0].length;
  }

  if (lastIndex < text.length) {
    parts.push(text.substring(lastIndex));
  }

  return parts.length > 0 ? parts : text;
};
