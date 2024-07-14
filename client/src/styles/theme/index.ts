import { animation, keyframes } from "./animation";
import { colors } from "./colors";

export const theme = {
  extend: {
    animation,
    keyframes,
    colors,
    boxShadow: {
      pad: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    },
  },
};
