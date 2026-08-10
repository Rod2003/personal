import type { FC } from 'react';
import config from '../config/site.json';

const navLink =
  'text-sm text-zinc-500 transition-colors duration-300 hover:text-black dark:hover:text-white';

export const SiteNavLinks: FC = () => (
  <div className="flex items-center gap-4">
    {config.navItems.map((item) => (
      <a
        key={item.label}
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        className={`${navLink} ${item.className ?? ''}`}
      >
        {item.label}
      </a>
    ))}
  </div>
);
