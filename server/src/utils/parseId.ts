export function parseId(value: string): number | null {
  const id = Number(value);
  return Number.isNaN(id) ? null : id;
}
