export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  hexSoft: string;
}

export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'sunrise', name: 'Red', hex: '#FF375F', hexSoft: '#FF375F1F' },
  { id: 'gold', name: 'Orange', hex: '#FF9500', hexSoft: '#FF95001F' },
  { id: 'sage', name: 'Green', hex: '#34C759', hexSoft: '#34C7591F' },
  { id: 'rose', name: 'Pink', hex: '#FF2D55', hexSoft: '#FF2D551F' },
  { id: 'plum', name: 'Purple', hex: '#AF52DE', hexSoft: '#AF52DE1F' },
  { id: 'denim', name: 'Blue', hex: '#007AFF', hexSoft: '#007AFF1F' },
];

export const DEFAULT_ACCENT_ID = 'sunrise';
