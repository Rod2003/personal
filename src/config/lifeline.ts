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
      events: ['Born in Lima, Peru.', 'Moved to Canada.'],
    },
    2023: {
      id: 'pario',
      companies: [{ id: 'pario', name: 'Pario' }],
      events: [
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
      ],
    },
    2025: {
      id: 'builder',
      companies: [
        { id: 'pario', name: 'Pario' },
        { id: 'citerite', name: 'CiteRite' },
      ],
      events: [
        'Rebuilt Pario as a B2B workflow platform and wrapped the chapter in May.',
        'Built CiteRite to review claims and citations in AI-generated text.',
      ],
      photos: [
        {
          src: '/assets/projects/pario-web-valence.png',
          alt: 'Pario matching interface',
          x: 0.72,
          y: 142,
          rotate: 3,
          width: 180,
        },
      ],
    },
    2026: {
      id: 'now',
      companies: [{ id: 'lex', name: 'Lex' }],
      events: [
        [
          { type: 'text', value: 'Shipped ' },
          {
            type: 'link',
            value: 'Lex',
            href: 'https://sfc-agent.vercel.app',
          },
          {
            type: 'text',
            value: ', a RAG agent for the San Francisco Legal Code.',
          },
        ],
        {
          text: 'Building the next iteration of this site as a Lifeline. 🎆',
          effect: 'fireworks',
        },
      ],
    },
  },
});
