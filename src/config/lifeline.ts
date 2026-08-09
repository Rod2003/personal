import { defineLifeline } from '../lib/lifeline-data';

export const personalLifeline = defineLifeline({
  slug: 'rodrigo-del-aguila',
  name: 'Rodrigo Del Aguila',
  birthYear: 2003,
  birthday: { month: 12, day: 3 },
  description:
    'Peruvian born, Canadian raised. Ex-founder and software engineer.',
  milestones: {
    2003: {
      id: 'born',
      events: ['Born in Lima, Peru.'],
    },
    2008: {
      id: 'moved-to-canada',
      events: ['Moved to Canada.'],
    },
    2009: {
      id: 'started-soccer',
      events: ['Started playing soccer on a team.'],
    },
    2010: {
      id: 'started-minecraft',
      events: ['Started playing Minecraft.'],
    },
    2011: {
      id: 'learned-piano',
      events: ['Learned to play piano.'],
    },
    2014: {
      id: 'gifted-program',
      events: ['Enrolled in the gifted program at my elementary school.'],
    },
    2015: {
      id: 'started-coding',
      events: ['Started coding. Made my first websites.'],
    },
    2016: {
      id: 'provincial-soccer',
      events: ['Started playing soccer at the provincial level (OPDL).'],
    },
    2017: {
      id: 'started-high-school',
      events: [
        'Started high school in the Advanced Placement program.',
        'Started tutoring, teaching STEM subjects to peers in grades 11-12.',
      ],
    },
    2018: {
      id: 'waterloo-math-competitions',
      events: ['Started competing in Waterloo math competitions.'],
    },
    2019: {
      id: 'started-music',
      events: [
        'Started producing music.',
        'Started my first business reselling high-demand shoes and clothing.',
        'Learned C# programming to use sneaker bots.',
      ],
    },
    2020: {
      id: 'royal-lepage',
      companies: [{ id: 'royal-lepage', name: 'Royal LePage' }],
      events: [
        [
          {
            type: 'text',
            value: 'Started my first internship in marketing and business development at ',
          },
          {
            type: 'link',
            value: 'Royal LePage',
            href: 'https://www.royallepage.ca/',
          },
          { type: 'text', value: '.' },
        ],
      ],
    },
    2021: {
      id: 'graduated-high-school',
      companies: [{ id: 'queens-university', name: "Queen's University" }],
      events: [
        'Graduated high school.',
        [
          {
            type: 'text',
            value: 'Started university studying Computer Engineering at ',
          },
          {
            type: 'link',
            value: 'Queen\'s',
            href: 'https://smithengineering.queensu.ca/',
          },
          { type: 'text', value: '.' },
        ],
      ],
    },
    2022: {
      id: 'cibc',
      companies: [{ id: 'cibc', name: 'CIBC' }],
      events: [
        'Closed reselling business, profitable.',
        [
          { type: 'text', value: 'Worked as a data engineer at ' },
          { type: 'link', value: 'CIBC', href: 'https://www.cibc.com/' },
          { type: 'text', value: '.' },
        ],
      ],
    },
    2023: {
      id: 'pario',
      companies: [
        { id: 'td', name: 'TD' },
        { id: 'pario', name: 'Pario' },
      ],
      events: [
        [
          { type: 'text', value: 'Worked as a cybersecurity engineer at ' },
          {
            type: 'link',
            value: 'TD',
            href: 'https://www.td.com/ca/en/personal-banking',
          },
          { type: 'text', value: '.' },
        ],
        {
          text: [
            { type: 'text', value: 'Started ' },
            { type: 'link', value: 'Pario', href: 'https://pario.so' },
            {
              type: 'text',
              value: ' as a student–tutor matching product.',
            },
          ],
          image: {
            src: '/assets/projects/pario-web-homepage.png',
            alt: 'Pario homepage',
          },
        },
        [
          { type: 'text', value: 'Helped organize ' },
          { type: 'link', value: 'CUCAI', href: 'https://cucai.ca/' },
          {
            type: 'text',
            value: ', the largest undergraduate AI conference in Canada.',
          },
        ],
        [
          { type: 'text', value: 'Started writing and publishing ' },
          {
            type: 'link',
            value: 'technical articles',
            href: 'https://medium.com/qmind-ai/the-power-of-prediction-exploring-the-role-of-ai-in-decision-making-f7d3905d312f',
          },
          { type: 'text', value: '.' },
        ],
      ],
    },
    2024: {
      id: 'previous-work',
      companies: [
        { id: 'dawson-partners', name: 'Dawson Partners' },
        { id: 'qmind', name: 'QMIND' },
        { id: 'pario', name: 'Pario' },
        { id: 'grid-insights', name: 'Grid Insights' },
      ],
      events: [
        'Worked at Dawson Partners as a software engineer.',
        [
          { type: 'text', value: 'Became managing director at ' },
          { type: 'link', value: 'QMIND', href: 'https://qmind.ca/' },
          { type: 'text', value: '.' },
        ],
        'Rebuilt Pario as a B2B workflow platform.',
        [
          { type: 'text', value: 'Joined ' },
          {
            type: 'link',
            value: 'Grid Insights',
            href: 'https://www.grid-insights.net/',
          },
          { type: 'text', value: ' as a founding software engineer.' },
        ],
      ],
    },
    2025: {
      id: 'builder',
      companies: [
        { id: 'ripplex-fellowship', name: 'RippleX Fellowship' },
        { id: 'grid-insights', name: 'Grid Insights' },
      ],
      events: [
        [
          { type: 'text', value: 'Became a fellow at ' },
          {
            type: 'link',
            value: 'RippleX Fellowship',
            href: 'https://ripplexfellowship.thinkific.com/',
          },
          { type: 'text', value: '.' },
        ],
        'Graduated university.',
        'Moved to Vancouver.',
        'Finished my first triathlon.',
      ],
    },
    2026: {
      id: 'now',
      companies: [{ id: 'circleback', name: 'Circleback' }],
      events: [
        {
          text: [
            { type: 'text', value: 'Moved to San Francisco, working on ' },
            {
              type: 'link',
              value: 'Circleback',
              href: 'https://circleback.ai/',
            },
            { type: 'text', value: '.' },
          ],
          image: {
            src: '/assets/projects/circleback-homepage.png',
            alt: 'Circleback homepage',
          },
        },
      ],
    },
  },
});
