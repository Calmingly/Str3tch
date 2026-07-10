export interface Palette {
  paper: string;
  paper2: string;
  ink: string;
  inkSoft: string;
  rule: string;
  accent: string;
  accentSoft: string;
}

export interface Theme {
  id: string;
  name: string;
  blurb: string;
  light: Palette;
  dark: Palette;
}

export const THEMES: Theme[] = [
  {
    id: 'paper',
    name: 'Paper',
    blurb: 'Warm cream, terracotta ink, quiet editorial calm.',
    light: {
      paper: '#f7f3ec',
      paper2: '#efe9dd',
      ink: '#1f2a24',
      inkSoft: '#5b6259',
      rule: 'rgba(31, 42, 36, 0.14)',
      accent: '#bc5b39',
      accentSoft: '#bc5b3922',
    },
    dark: {
      paper: '#17140f',
      paper2: '#201c15',
      ink: '#f2ece1',
      inkSoft: '#a49c8d',
      rule: 'rgba(242, 236, 225, 0.14)',
      accent: '#e08a63',
      accentSoft: '#e08a6322',
    },
  },
  {
    id: 'midnight',
    name: 'Midnight',
    blurb: 'Deep indigo velvet with a glint of antique gold.',
    light: {
      paper: '#f1ecf5',
      paper2: '#e6ddee',
      ink: '#241b2e',
      inkSoft: '#6b5f77',
      rule: 'rgba(36, 27, 46, 0.14)',
      accent: '#a8702f',
      accentSoft: '#a8702f22',
    },
    dark: {
      paper: '#140f21',
      paper2: '#1e1733',
      ink: '#ece6f5',
      inkSoft: '#a89bbd',
      rule: 'rgba(236, 230, 245, 0.14)',
      accent: '#d9a441',
      accentSoft: '#d9a44122',
    },
  },
  {
    id: 'meadow',
    name: 'Meadow',
    blurb: 'Sage and moss, an outdoor, unhurried feel.',
    light: {
      paper: '#f2f5ee',
      paper2: '#e6ebdc',
      ink: '#22301f',
      inkSoft: '#5f6f56',
      rule: 'rgba(34, 48, 31, 0.14)',
      accent: '#4f7a4a',
      accentSoft: '#4f7a4a22',
    },
    dark: {
      paper: '#0f150d',
      paper2: '#182015',
      ink: '#e9efe3',
      inkSoft: '#9aab8f',
      rule: 'rgba(233, 239, 227, 0.14)',
      accent: '#7fb26e',
      accentSoft: '#7fb26e22',
    },
  },
  {
    id: 'blush',
    name: 'Blush',
    blurb: 'Soft rose and warmth, a gentler spa mood.',
    light: {
      paper: '#fbf0ee',
      paper2: '#f5e1de',
      ink: '#3a2320',
      inkSoft: '#8a6d68',
      rule: 'rgba(58, 35, 32, 0.14)',
      accent: '#c8596a',
      accentSoft: '#c8596a22',
    },
    dark: {
      paper: '#1c0f12',
      paper2: '#2c161a',
      ink: '#f5e4e1',
      inkSoft: '#baa19d',
      rule: 'rgba(245, 228, 225, 0.14)',
      accent: '#e28a97',
      accentSoft: '#e28a9722',
    },
  },
  {
    id: 'sunrise',
    name: 'Sunrise',
    blurb: 'Vivid coral and amber, an energetic morning jolt.',
    light: {
      paper: '#fff6ee',
      paper2: '#ffe9d6',
      ink: '#3a2410',
      inkSoft: '#8a6f4f',
      rule: 'rgba(58, 36, 16, 0.14)',
      accent: '#ee6c2f',
      accentSoft: '#ee6c2f22',
    },
    dark: {
      paper: '#1c1006',
      paper2: '#2a1908',
      ink: '#fbe8d6',
      inkSoft: '#c9a883',
      rule: 'rgba(251, 232, 214, 0.14)',
      accent: '#ff8a4c',
      accentSoft: '#ff8a4c22',
    },
  },
  {
    id: 'ink',
    name: 'Ink',
    blurb: 'Stark black and white. No color, just contrast.',
    light: {
      paper: '#ffffff',
      paper2: '#f0f0f0',
      ink: '#0a0a0a',
      inkSoft: '#6b6b6b',
      rule: 'rgba(0, 0, 0, 0.16)',
      accent: '#0a0a0a',
      accentSoft: '#0a0a0a1a',
    },
    dark: {
      paper: '#000000',
      paper2: '#151515',
      ink: '#ffffff',
      inkSoft: '#9a9a9a',
      rule: 'rgba(255, 255, 255, 0.16)',
      accent: '#ffffff',
      accentSoft: '#ffffff1a',
    },
  },
  {
    id: 'lagoon',
    name: 'Lagoon',
    blurb: 'Cool teal and driftwood, breezy and clear.',
    light: {
      paper: '#eef5f4',
      paper2: '#dcece9',
      ink: '#17302c',
      inkSoft: '#587a74',
      rule: 'rgba(23, 48, 44, 0.14)',
      accent: '#1f8a7a',
      accentSoft: '#1f8a7a22',
    },
    dark: {
      paper: '#0a1615',
      paper2: '#0f211f',
      ink: '#e4f2f0',
      inkSoft: '#8fb3ac',
      rule: 'rgba(228, 242, 240, 0.14)',
      accent: '#3fc4ab',
      accentSoft: '#3fc4ab22',
    },
  },
];

export const DEFAULT_THEME_ID = 'paper';
