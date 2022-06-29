export const DARK = "dark";
export const LIGHT = "light";

export type Theme = "dark" | "light";

export function updateColorTheme(): void {
  const theme = getColorTheme();
  const arrayOfVariableKeys = Object.keys(colors);
  const arrayOfVariableValues = Object.values(colors);

  arrayOfVariableKeys.forEach((cssVariableKey, index) => {
    document.documentElement.style.setProperty(
      cssVariableKey,
      arrayOfVariableValues[index][theme]
    );
  });
}

export function toggleColorTheme(): Theme {
  const cur = getColorTheme();
  const theme = cur === LIGHT ? DARK : LIGHT;
  localStorage.setItem("colorTheme", theme);
  updateColorTheme();
  return theme;
}

export function getColorTheme(): Theme {
  const color = localStorage.getItem("colorTheme") || "";
  if (![DARK, LIGHT].includes(color)) {
    return DARK;
  }
  return <Theme>color;
}

type Colors = {
  [key: string]: { dark: string; light: string };
};

const colors: Colors = {
"--background": {light: "#DADADF", dark: "#34344A"},
"--background-light": {light: "#FEFEFE", dark: "#48485C"},

"--font": {light: "#7DC2C5", dark: "#7DC2C5"},
"--grey-font": {light: "#34344A", dark: "#B7B6C1"},

"--button-color": {light: "#9CFFFA", dark: "#7DC2C5"},
"--button-font": {light: "#34344A", dark: "#FEFEFE"},

"--sub-text": {light: "#929D9E", dark: "#929D9E"},
"--accent-blue": {light: "#7DC2C5", dark: "#97E0CA"},

"--border-color": {light: "#DADADF", dark: "#B7B6C1"},


"--slider-track": {light: "#7DC2C5", dark: "#9CFFFA"},
"--slider-dot": {light: "#7DC2C5", dark: "#7DC2C5"},
};
