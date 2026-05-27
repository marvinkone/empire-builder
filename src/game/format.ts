export function fcfa(n: number): string {
  const sign = n < 0 ? "-" : "";
  const abs = Math.abs(Math.round(n));
  if (abs >= 1_000_000_000) return `${sign}${(abs / 1_000_000_000).toFixed(2)} Mds`;
  if (abs >= 1_000_000) return `${sign}${(abs / 1_000_000).toFixed(2)}M`;
  if (abs >= 10_000) return `${sign}${(abs / 1000).toFixed(0)}K`;
  return `${sign}${abs.toLocaleString("fr-FR")}`;
}

export function fcfaFull(n: number): string {
  return `${Math.round(n).toLocaleString("fr-FR")} FCFA`;
}
