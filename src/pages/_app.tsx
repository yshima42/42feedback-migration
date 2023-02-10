import { AuthGuard } from "@/components/AuthGuard";
import theme from "styles/theme";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.min.css";
import "styles/scroll.css";

const App = ({ Component, pageProps }: AppProps) => {
  return (
    <SessionProvider session={pageProps.session}>
      <ChakraProvider theme={theme}>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </ChakraProvider>
    </SessionProvider>
  );
};

export default App;
