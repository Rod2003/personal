import type { FC } from 'react';
import config from '../config/lifeline';

const navLinkClassName =
  'text-sm text-zinc-500 transition-colors duration-300 hover:text-black dark:hover:text-white';

export const SiteNavLinks: FC = () => (
  <div className="flex items-center gap-4">
    {config.navItems.map((item) => (
      <a
        key={item.label}
        href={item.href}
        target={item.external ? '_blank' : undefined}
        rel={item.external ? 'noopener noreferrer' : undefined}
        className={navLinkClassName}
      >
        {item.label}
      </a>
    ))}
  </div>
);
