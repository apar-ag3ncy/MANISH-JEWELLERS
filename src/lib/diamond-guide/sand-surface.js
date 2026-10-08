/** Shared relief keeps the surface, grains and resting diamond shards in contact. */
export function sandHeight(x, z) {
  const envelope = Math.exp(-((x * x) / 150 + (z * z) / 90));
  const bend = Math.sin(x * 0.39) * 0.7 + Math.sin(x * 0.91 + 1.2) * 0.18;
  const ripple = Math.sin(z * 3.1 + bend) * 0.115 + Math.sin(z * 6.3 + bend * 1.8) * 0.032;
  const drift = Math.sin(x * 0.7 + z * 0.5) * Math.cos(z * 0.8 - x * 0.2) * 0.035;
  return (ripple + drift) * envelope;
}

export function sandRandom(seed = 1916) {
  return () => {
    seed = (Math.imul(seed, 1664525) + 1013904223) >>> 0;
    return seed / 4294967296;
  };
}
