import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import config from '../config/site.json';
import {
  LifelineFooter,
  LifelineNav,
  LifelineShell,
  LifelineStage,
} from './lifeline-shell';
import { ThemeSwitcher } from './theme-switcher';
import { SiteNavLinks } from './site-nav-links';
import type { Article } from '../config/articles';

const WritingNav: React.FC = () => (
  <LifelineNav
    logo={
      <Link
        href="/?view=classic"
        className="lifeline-name-shimmer text-sm font-medium"
        data-text={config.name}
      >
        {config.name}
      </Link>
    }
  >
    <SiteNavLinks />
  </LifelineNav>
);

export const WritingPage: React.FC<{
  article?: Article;
  articles?: Article[];
}> = ({ article, articles = [] }) => (
  <>
    <Head>
      <title>
        {article ? `${article.title} — ${config.name}` : `Writing — ${config.name}`}
      </title>
      <meta
        name="description"
        content={
          article
            ? article.title
            : 'Writing by Rodrigo Del Aguila.'
        }
      />
    </Head>

    <LifelineShell className="lifeline-shell fixed inset-0 z-[45]">
      <WritingNav />

      <LifelineStage className="writing-stage">
        <div className="mx-auto w-full max-w-3xl px-6 py-12 sm:py-16">
          {article ? (
            <article>
              <Link
                href="/writing"
                className="text-sm text-zinc-500 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-black dark:hover:text-white"
              >
                Writing
              </Link>
              <h1 className="mt-8 mb-3 text-[1.05rem] font-semibold">
                {article.title}
              </h1>
              <div
                className="article-body mt-8 max-w-2xl text-sm leading-7 text-zinc-700 dark:text-zinc-300"
                dangerouslySetInnerHTML={{
                  __html: article.body,
                }}
              />
            </article>
          ) : (
            <>
              <Link
                href="/"
                className="text-sm text-zinc-500 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-black dark:hover:text-white"
              >
                Back
              </Link>
              <div className="mt-8 flex flex-col gap-3">
                {articles.map((entry) => (
                  <Link
                    key={entry.slug}
                    href={`/writing/${entry.slug}`}
                    className="text-sm text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
                  >
                    {entry.title}
                  </Link>
                ))}
              </div>
            </>
          )}
        </div>
      </LifelineStage>

      <LifelineFooter>
        <ThemeSwitcher />
      </LifelineFooter>
    </LifelineShell>
  </>
);
