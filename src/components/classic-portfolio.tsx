import Head from 'next/head';
import React from 'react';
import config from '../config/site.json';
import { personalLifeline } from '../config/lifeline';
import { Lifeline } from './lifeline';
import { registerCompanyIcons } from './lifeline/company-icon';
import {
  LifelineFooter,
  LifelineNav,
  LifelineShell,
  LifelineStage,
} from './lifeline-shell';
import { ThemeSwitcher } from './theme-switcher';
import { SiteNavLinks } from './site-nav-links';

const ParioLogo: React.FC<{ className?: string }> = ({ className }) => (
  // eslint-disable-next-line @next/next/no-img-element
  <img
    src="/assets/logos/pario-icon.png"
    alt=""
    className={`${className ?? ''} object-contain`}
  />
);

const assetLogo = (src: string): React.FC<{ className?: string }> => {
  const Logo: React.FC<{ className?: string }> = ({ className }) => (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt="" className={`${className ?? ''} object-contain`} />
  );

  return Logo;
};

const CirclebackLogo = assetLogo('/assets/logos/circleback-favicon.ico');
const ShelfLogo = assetLogo('/assets/logos/shelf.png');
const GridInsightsLogo = assetLogo('/assets/logos/grid-insights.svg');
const RippleXFellowshipLogo = assetLogo('/assets/logos/ripplex-fellowship.png');
const QmindLogo = assetLogo('/assets/logos/qmind-favicon.ico');
const DawsonPartnersLogo = assetLogo('/assets/logos/dawson-partners.png');
const TdLogo = assetLogo('/assets/logos/td.png');
const CibcLogo = assetLogo('/assets/logos/cibc-favicon.ico');
const RoyalLePageLogo = assetLogo('/assets/logos/royal-lepage-favicon.ico');
const QueensUniversityLogo = assetLogo(
  '/assets/logos/queens-university-favicon.ico',
);

registerCompanyIcons({
  pario: { icon: ParioLogo, sizeClassName: 'h-5 w-5' },
  circleback: { icon: CirclebackLogo, sizeClassName: 'h-5 w-5' },
  shelf: { icon: ShelfLogo, sizeClassName: 'h-5 w-5' },
  'grid-insights': { icon: GridInsightsLogo, sizeClassName: 'h-5 w-5' },
  'ripplex-fellowship': {
    icon: RippleXFellowshipLogo,
    sizeClassName: 'h-5 w-5',
  },
  qmind: { icon: QmindLogo, sizeClassName: 'h-5 w-5' },
  'dawson-partners': { icon: DawsonPartnersLogo, sizeClassName: 'h-5 w-5' },
  td: { icon: TdLogo, sizeClassName: 'h-5 w-5' },
  cibc: { icon: CibcLogo, sizeClassName: 'h-5 w-5' },
  'royal-lepage': { icon: RoyalLePageLogo, sizeClassName: 'h-5 w-5' },
  'queens-university': {
    icon: QueensUniversityLogo,
    sizeClassName: 'h-5 w-5',
  },
});

export const ClassicPortfolio: React.FC = () => (
  <>
    <Head>
      <title>{config.name} — Lifeline</title>
      <meta name="description" content={personalLifeline.description} />
    </Head>

    <LifelineShell className="lifeline-shell fixed inset-0 z-[45]">
      <LifelineNav
        logo={
          <span
            className="lifeline-name-shimmer text-sm font-medium"
            data-text={config.name}
          >
            {config.name}
          </span>
        }
      >
        <SiteNavLinks />
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
        <ThemeSwitcher />
      </LifelineFooter>
    </LifelineShell>
  </>
);
