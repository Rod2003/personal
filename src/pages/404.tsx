import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import config from '../config/lifeline';
import {
  LifelineFooter,
  LifelineNav,
  LifelineShell,
  LifelineStage,
} from '../components/lifeline-shell';
import { ThemeSwitcher } from '../components/theme-switcher';
import { SiteNavLinks } from '../components/site-nav-links';

const NotFoundPage: React.FC = () => (
  <>
    <Head>
      <title>{`404 — ${config.name}`}</title>
    </Head>

    <LifelineShell className="lifeline-shell fixed inset-0 z-[45]">
      <LifelineNav
        logo={
          <Link
            href="/"
            className="lifeline-name-shimmer text-sm font-medium"
            data-text={config.name}
          >
            {config.name}
          </Link>
        }
      >
        <SiteNavLinks />
      </LifelineNav>

      <LifelineStage className="writing-stage select-none">
        <div className="mx-auto w-full max-w-3xl py-12 sm:py-16">
          <div className="w-full px-6">
            <Link
              href="/"
              className="text-sm text-zinc-500 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-black dark:hover:text-white"
            >
              Home
            </Link>
            <h1 className="mt-8 mb-3 text-[1.05rem] font-semibold">
              Page not found
            </h1>
          </div>
        </div>
      </LifelineStage>

      <LifelineFooter>
        <ThemeSwitcher />
      </LifelineFooter>
    </LifelineShell>
  </>
);

export default NotFoundPage;
