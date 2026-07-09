const PREFIX = 'str3tch:';

export function exportData(): void {
  const data: Record<string, unknown> = {};
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (!key || !key.startsWith(PREFIX)) continue;
    try {
      data[key] = JSON.parse(localStorage.getItem(key) ?? 'null');
    } catch {
      // skip unparsable entries
    }
  }
  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `str3tch-backup-${new Date().toISOString().slice(0, 10)}.json`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  URL.revokeObjectURL(url);
}

export async function importData(file: File): Promise<void> {
  const text = await file.text();
  const data = JSON.parse(text) as Record<string, unknown>;
  for (const [key, value] of Object.entries(data)) {
    if (!key.startsWith(PREFIX)) continue;
    localStorage.setItem(key, JSON.stringify(value));
  }
  window.location.reload();
}
