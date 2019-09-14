export type Color = { hue: number; saturation: number; lightness: number };
export type ColorShade = 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9;
export type ColorType = 'neutral' | 'primary';

export function getColor(
  colorType: ColorType,
  colorShade: ColorShade,
  alpha = 1
) {
  const { hue, saturation, lightness } = colors[colorType][colorShade];
  return alpha === 1
    ? `hsl(${hue}, ${saturation}%, ${lightness}%)`
    : `hsla(${hue}, ${saturation}%, ${lightness}%, ${alpha})`;
}

const colors: Record<ColorType, Record<ColorShade, Color>> = {
  neutral: {
    0: { hue: 210, saturation: 24, lightness: 16 },
    1: { hue: 209, saturation: 20, lightness: 25 },
    2: { hue: 209, saturation: 18, lightness: 30 },
    3: { hue: 209, saturation: 14, lightness: 37 },
    4: { hue: 211, saturation: 12, lightness: 43 },
    5: { hue: 211, saturation: 10, lightness: 53 },
    6: { hue: 211, saturation: 13, lightness: 65 },
    7: { hue: 210, saturation: 16, lightness: 82 },
    8: { hue: 214, saturation: 15, lightness: 91 },
    9: { hue: 216, saturation: 33, lightness: 97 }
  },
  primary: {
    0: { hue: 234, saturation: 62, lightness: 26 },
    1: { hue: 232, saturation: 51, lightness: 36 },
    2: { hue: 230, saturation: 49, lightness: 41 },
    3: { hue: 228, saturation: 45, lightness: 45 },
    4: { hue: 227, saturation: 42, lightness: 51 },
    5: { hue: 227, saturation: 50, lightness: 59 },
    6: { hue: 225, saturation: 57, lightness: 67 },
    7: { hue: 224, saturation: 67, lightness: 76 },
    8: { hue: 221, saturation: 78, lightness: 86 },
    9: { hue: 221, saturation: 68, lightness: 93 }
  }
};
