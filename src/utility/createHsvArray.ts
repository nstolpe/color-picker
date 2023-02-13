import chroma from 'chroma-js';

export type HsvArraySource = string | number | chroma.Color;

// @TODO: use chroma.valid here instead of try/catch
const createHsvArray = (source: HsvArraySource): [number, number, number] =>
  chroma.valid(source) ? chroma(source).hsv() : [0, 0, 0];

export default createHsvArray;
