export function getCurrentSchoolYear(): string {
  const now = new Date();
  const month = now.getMonth(); // 0-indexed: 0 = January, 8 = September
  const year = now.getFullYear();
  const startYear = month >= 8 ? year : year - 1;
  return `${startYear}/${startYear + 1}`;
}
 