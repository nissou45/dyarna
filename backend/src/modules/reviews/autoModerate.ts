const BLOCKLIST = [
  'connard', 'salope', 'enculé', 'fdp', 'ntm', 'bâtard', 'pute',
  'nègre', 'sale négro', 'bougnoule', 'sale arabe',
];

function containsBlockedWords(text: string): boolean {
  const lower = text.toLowerCase();
  return BLOCKLIST.some((word) => lower.includes(word));
}

export function autoModerate(comment: string): 'visible' | 'pending' {
  return containsBlockedWords(comment) ? 'pending' : 'visible';
}
