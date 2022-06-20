export function getRandomDate(): string {
  const start = new Date(2008, 0, 1);
  const end = new Date(2021, 11, 31);

  return new Date(start.getTime() + Math.random() * (end.getTime() - start.getTime())).toISOString().split("T")[0];
}

export function getDateToday(): string {
  return new Date().toISOString().split("T")[0];
}

export function getRandomSalary(): number {
  return Math.random() * 100000;
}

export function getRandomBoolean(): boolean {
  return Math.random() < 0.5;
}