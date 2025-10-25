export function fmtDateISO(iso: string) {
  const d = new Date(iso);
  return d.toLocaleString();
}
