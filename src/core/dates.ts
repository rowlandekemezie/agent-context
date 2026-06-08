export function pad(value: number): string {
  return String(value).padStart(2, '0');
}

export function workDate(date = new Date()): string {
  const adjusted = new Date(date);

  if (adjusted.getHours() < 6) {
    adjusted.setDate(adjusted.getDate() - 1);
  }

  return [
    adjusted.getFullYear(),
    pad(adjusted.getMonth() + 1),
    pad(adjusted.getDate()),
  ].join('-');
}

export function timestamp(date = new Date()): string {
  return [
    workDate(date),
    pad(date.getHours()),
    pad(date.getMinutes()),
    pad(date.getSeconds()),
  ].join('-');
}
