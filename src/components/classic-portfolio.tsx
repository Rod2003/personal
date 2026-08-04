import Head from 'next/head';
import { Terminal } from 'lucide-react';
import React from 'react';
import config from '../config/site.json';
import { personalLifeline } from '../config/lifeline';
import { ViewMode } from '../utils/view-mode';
import { Lifeline } from './lifeline';
import { registerCompanyIcons } from './lifeline/company-icon';
import {
  LifelineFooter,
  LifelineNav,
  LifelineShell,
  LifelineStage,
} from './lifeline-shell';
import { ThemeSwitcher } from './theme-switcher';

interface ClassicPortfolioProps {
  mode: ViewMode;
  onModeChange: (mode: ViewMode) => void;
}

const navLink =
  'text-sm text-zinc-500 transition-colors duration-300 hover:text-black dark:hover:text-white';

const ParioLogo: React.FC<{ className?: string }> = ({ className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/assets/logos/pario-icon.png"
    alt=""
    className={`${className ?? ''} object-contain`}
  />
);

registerCompanyIcons({
  pario: { icon: ParioLogo, sizeClassName: 'h-5 w-5' },
});

export const ClassicPortfolio: React.FC<ClassicPortfolioProps> = ({
  onModeChange,
}) => (
  <>
    <Head>
      <title>{config.name} — Lifeline</title>
      <meta name="description" content={personalLifeline.description} />
      <link rel="preconnect" href="https://fonts.googleapis.com" />
      <link
        rel="preconnect"
        href="https://fonts.gstatic.com"
        crossOrigin="anonymous"
      />
      <link
        rel="stylesheet"
        href="https://fonts.googleapis.com/css2?family=IBM+Plex+Sans:wght@100..700&display=swap"
      />
    </Head>

    <LifelineShell className="lifeline-shell fixed inset-0 z-[45]">
      <LifelineNav
        logo={<span className="text-sm font-medium">{config.name}</span>}
      >
        <div className="flex items-center gap-4">
          <a
            href={`https://github.com/${config.social.github}`}
            target="_blank"
            rel="noopener noreferrer"
            className={navLink}
          >
            GitHub
          </a>
          <a
            href={`https://www.linkedin.com/in/${config.social.linkedin}`}
            target="_blank"
            rel="noopener noreferrer"
            className={`${navLink} hidden sm:inline`}
          >
            LinkedIn
          </a>
          <button
            type="button"
            className={navLink}
            onClick={() => onModeChange('terminal')}
          >
            Terminal
          </button>
        </div>
      </LifelineNav>

      <LifelineStage>
        <Lifeline
          markers={personalLifeline.markers}
          birthYear={personalLifeline.birthYear}
          title={personalLifeline.name}
          className="h-full"
        />
      </LifelineStage>

      <LifelineFooter>
        <div className="flex w-full items-center justify-between">
          <ThemeSwitcher />
          <button
            type="button"
            onClick={() => onModeChange('terminal')}
            aria-label="Switch to terminal view"
            className={navLink}
          >
            <Terminal className="h-4 w-4" strokeWidth={1.75} />
          </button>
        </div>
      </LifelineFooter>
    </LifelineShell>
  </>
);
