// Vibrant card gradients cycled across lists, matching the reference design's
// mint / blue / orange / pink / purple ranking cards.
export const CARD_GRADIENTS = [
  'bg-gradient-to-br from-emerald-300 to-emerald-500',
  'bg-gradient-to-br from-blue-400 to-indigo-500',
  'bg-gradient-to-br from-amber-400 to-orange-500',
  'bg-gradient-to-br from-rose-400 to-pink-600',
  'bg-gradient-to-br from-violet-400 to-purple-600',
  'bg-gradient-to-br from-sky-400 to-cyan-500',
];

export function cardGradient(index: number) {
  return CARD_GRADIENTS[Math.abs(index) % CARD_GRADIENTS.length];
}

export function gradientForKey(key: string) {
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) % 997;
  }
  return cardGradient(hash);
}
