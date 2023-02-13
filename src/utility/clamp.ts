/**
 * Clamps a number (n) between min and max.
 * Returns n if n is between min and max.
 * Returns min if n is less than min.
 * Returns max if n is greater than max.
 */
const clamp = (n: number, min: number, max: number): number =>
  n > max ? max : n < min ? min : n;

export default clamp;
