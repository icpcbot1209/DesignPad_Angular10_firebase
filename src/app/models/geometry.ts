export const isPntInRect = (
  x: number,
  y: number,
  x0: number,
  y0: number,
  w: number,
  h: number
) => {
  return x0 <= x && x <= x0 + w && y0 <= y && y <= y0 + h;
};

export const eightPos = (left, top, w, h) => [
  { x: left, y: top },
  { x: left + w, y: top },
  { x: left + w, y: top + h },
  { x: left, y: top + h },
  { x: left + w / 2, y: top },
  { x: left + w, y: top + h / 2 },
  { x: left + w / 2, y: top + h },
  { x: left, y: top + h / 2 },
];
