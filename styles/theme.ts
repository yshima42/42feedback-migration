import { extendTheme } from "@chakra-ui/react";

const theme = extendTheme({
  components: {
    Button: {
      baseStyle: {
        fontWeight: "semibold",
      },
    },
  },
  styles: {
    global: {
      body: {
        backgroundColor: "gray.40",
        color: "gray.800",
        a: {
          color: "teal.400",
          _hover: {
            textDecoration: "underline",
            color: "teal.500",
            cursor: "pointer",
            transition: "all 0.2s",
            fontWeight: "semibold",
            textDecor: "underline",
          },
        },
      },
    },
  },
});

export default theme;
