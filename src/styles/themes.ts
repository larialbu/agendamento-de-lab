// ../styles/themes.ts
import { extendTheme } from "@chakra-ui/react";

const customTheme = extendTheme({
  styles: {
    global: {
      "html, body": {
        fontFamily: "body",
        color: "chakra-body-text",
        background: "chakra-body-bg",
        transitionProperty: "background-color",
        transitionDuration: "normal",
        lineHeight: "base",
      },
    },
  },
  fonts: {
    body: "system-ui, sans-serif",
  },
  colors: {
    "chakra-body-text": "#000",
    "chakra-body-bg": "#fff",
  },
});

export default customTheme;
