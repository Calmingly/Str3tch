export interface AccentTheme {
  id: string;
  name: string;
  hex: string;
  hexSoft: string;
}

export const ACCENT_THEMES: AccentTheme[] = [
  { id: 'sunrise', name: 'Volt', hex: '#65A30D', hexSoft: '#65A30D1F' },
  { id: 'gold', name: 'Orange', hex: '#EA580C', hexSoft: '#EA580C1F' },
  { id: 'sage', name: 'Crimson', hex: '#DC2626', hexSoft: '#DC26261F' },
  { id: 'rose', name: 'Pink', hex: '#DB2777', hexSoft: '#DB27771F' },
  { id: 'plum', name: 'Purple', hex: '#7C3AED', hexSoft: '#7C3AED1F' },
  { id: 'denim', name: 'Blue', hex: '#2563EB', hexSoft: '#2563EB1F' },
];

export const DEFAULT_ACCENT_ID = 'sunrise';
