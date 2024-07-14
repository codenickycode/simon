type RecursiveObject = {
  [key: string]: string | RecursiveObject;
};

const isString = (input: unknown) => {
  return typeof input === "string";
};

export type TWPluginArgs = {
  addComponents: (components: RecursiveObject) => void;
  addUtilities: (utilities: RecursiveObject) => void;
  theme: (theme: string) => RecursiveObject;
};

/** Create custom variables from pad colors
 *  eg: .pad-color-green ->
 *    --pad-color-light: <colors.pad-green.light>
 *    --pad-color-dark: <colors.pad-green.dark>
 */
export const customVarPadColors = ({ addUtilities, theme }: TWPluginArgs) => {
  const padColors = Object.entries(theme("colors"))
    .filter(([key]) => key.startsWith("pad-"))
    .reduce((acc, [key, value]) => {
      if (isString(value)) {
        return acc; // this is just a type guard for TS sake
      }
      acc[`.pad-color-${key.replace("pad-", "")}`] = {
        "--pad-color-light": value.light,
        "--pad-color-dark": value.dark,
      };
      return acc;
    }, {} as RecursiveObject);
  addUtilities(padColors);
};

/** Class to make the pads look a little like bulbs raised above the base */
export const pad3d = ({ addComponents }: TWPluginArgs) => {
  addComponents({
    ".pad-3d": {
      position: "relative",
      overflow: "hidden",
      boxShadow:
        "0 8px 15px -3px rgba(0, 0, 0, 0.2), 0 4px 6px -2px rgba(0, 0, 0, 0.1)",
      border: `1px solid var(--pad-color-dark)`,
      background:
        "linear-gradient(145deg, var(--pad-color-light), var(--pad-color-dark))",
      "&::before": {
        content: '""',
        position: "absolute",
        inset: "0",
        background:
          "linear-gradient(145deg, rgba(255,255,255,0.9), transparent 70%)",
        opacity: "0.5",
        pointerEvents: "none",
      },
      "&::after": {
        content: '""',
        position: "absolute",
        left: "0",
        right: "0",
        top: "0",
        height: "10px",
        background:
          "linear-gradient(to bottom, rgba(255,255,255,0.5), transparent)",
        opacity: "0.5",
        pointerEvents: "none",
      },
    },
  });
};
