export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  hexSoft: string;
}

export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'sunrise', name: 'Sunrise', hex: '#ff7a59', hexSoft: '#ff7a5922' },
  { id: 'peach', name: 'Peach', hex: '#ffb37b', hexSoft: '#ffb37b22' },
  { id: 'sage', name: 'Sage', hex: '#7fbfa0', hexSoft: '#7fbfa022' },
  { id: 'blush', name: 'Blush', hex: '#f28fa8', hexSoft: '#f28fa822' },
  { id: 'lavender', name: 'Lavender', hex: '#a78bd6', hexSoft: '#a78bd622' },
  { id: 'sky', name: 'Sky', hex: '#7ab8d6', hexSoft: '#7ab8d622' },
];

export const DEFAULT_ACCENT_ID = 'sunrise';
