export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  hexSoft: string;
}

export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'ocean', name: 'Ocean', hex: '#0ea5e9', hexSoft: '#0ea5e922' },
  { id: 'sunset', name: 'Sunset', hex: '#f97316', hexSoft: '#f9731622' },
  { id: 'forest', name: 'Forest', hex: '#10b981', hexSoft: '#10b98122' },
  { id: 'berry', name: 'Berry', hex: '#f43f5e', hexSoft: '#f43f5e22' },
  { id: 'grape', name: 'Grape', hex: '#8b5cf6', hexSoft: '#8b5cf622' },
  { id: 'teal', name: 'Teal', hex: '#14b8a6', hexSoft: '#14b8a622' },
];

export const DEFAULT_ACCENT_ID = 'ocean';
