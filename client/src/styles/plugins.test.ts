import { customVarPadColors, TWPluginArgs } from "./plugins";

const addComponents = vi.fn();
const addUtilities = vi.fn();
const theme = vi.fn();
const pluginArgs = {
  addComponents,
  addUtilities,
  theme,
} as TWPluginArgs;

describe("customVarPadColors", () => {
  it("creates classes for custom variables based on the pad-colors themes", () => {
    theme.mockReturnValueOnce({
      foo: "bar",
      "pad-blue": { light: "blue", dark: "darkblue" },
      "pad-red": { light: "red", dark: "darkred" },
    });
    customVarPadColors(pluginArgs);
    expect(addUtilities).toHaveBeenCalledWith({
      ".pad-color-blue": {
        "--pad-color-dark": "darkblue",
        "--pad-color-light": "blue",
      },
      ".pad-color-red": {
        "--pad-color-dark": "darkred",
        "--pad-color-light": "red",
      },
    });
  });
});
