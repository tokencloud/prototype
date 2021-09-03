export function randomNumber() {
  return (Math.floor(Math.random() * (900 - 100) + 100) / 100).toFixed(2);
}

export function randomChangeType() {
  return Math.random() < 0.6 ? 'increase' : 'decrease';
}

export function randomArray() {
  return Array.from({ length: 20 }, () => Math.floor(Math.random() * 40));
}

export function classNames(...classes) {
  return classes.filter(Boolean).join(' ');
}

export function randomNumberRange(max) {
  return Math.floor(Math.random() * max) + 49;
}
