import Head from 'next/head';
import Link from 'next/link';
import React from 'react';
import config from '../config/lifeline';
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
);

const WritingLayout: React.FC<{
  title: string;
  description: string;
  children: React.ReactNode;
}> = ({ title, description, children }) => (
  <>
    <Head>
      <title>{title}</title>
      <meta name="description" content={description} />
    </Head>

    <LifelineShell className="lifeline-shell fixed inset-0 z-[45]">
      <WritingNav />

      <LifelineStage className="writing-stage select-none">
        <div className="mx-auto w-full max-w-3xl py-12 sm:py-16">
          {children}
        </div>
      </LifelineStage>

      <LifelineFooter>
        <ThemeSwitcher />
      </LifelineFooter>
    </LifelineShell>
  </>
);

export const WritingPage: React.FC<{ articles: Article[] }> = ({ articles }) => (
  <WritingLayout
    title={`Writing — ${config.name}`}
    description={`Writing by ${config.name}.`}
  >
    <div className="w-full px-6">
      <Link
        href="/"
        className="text-sm text-zinc-500 underline decoration-zinc-400 underline-offset-2 transition-colors hover:text-black dark:hover:text-white"
      >
        Back
      </Link>
      <div className="mt-8 flex flex-col gap-3">
        {articles.map((article) => (
          <Link
            key={article.slug}
            href={`/writing/${article.slug}`}
            className="text-sm text-zinc-700 transition-colors hover:text-black dark:text-zinc-300 dark:hover:text-white"
          >
            {article.title}
          </Link>
        ))}
      </div>
    </div>
  </WritingLayout>
);

export const WritingArticlePage: React.FC<{ article: Article }> = ({
  article,
}) => (
  <WritingLayout
    title={`${article.title} — ${config.name}`}
    description={article.title}
  >
    <article className="w-full px-6">
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
        dangerouslySetInnerHTML={{ __html: article.body }}
      />
    </article>
  </WritingLayout>
);
