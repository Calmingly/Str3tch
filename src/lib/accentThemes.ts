export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  hexSoft: string;
}

export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'sunrise', name: 'Sunrise', hex: '#F0552E', hexSoft: '#F0552E22' },
  { id: 'gold', name: 'Gold', hex: '#D9932A', hexSoft: '#D9932A22' },
  { id: 'sage', name: 'Sage', hex: '#4F7358', hexSoft: '#4F735822' },
  { id: 'rose', name: 'Rose', hex: '#D14C69', hexSoft: '#D14C6922' },
  { id: 'plum', name: 'Plum', hex: '#7A5CB0', hexSoft: '#7A5CB022' },
  { id: 'denim', name: 'Denim', hex: '#3E6690', hexSoft: '#3E669022' },
];

export const DEFAULT_ACCENT_ID = 'sunrise';
