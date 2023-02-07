import { AuthGuard } from "@/components/AuthGuard";
import { ChakraProvider } from "@chakra-ui/react";
import { SessionProvider } from "next-auth/react";
import { AppProps } from "next/app";
import "bootstrap/dist/css/bootstrap.css";
// google fontを使う場合は以下のコメントアウトを外す
// import { Inconsolata } from "@next/font/google";

// 参考1: https://nextjs.org/docs/basic-features/font-optimization
// 参考2: https://www.youtube.com/watch?v=L8_98i_bMMA&ab_channel=LeeRobinson
// const inconsolata = Inconsolata({ subsets: ["latin"], weight: ["400", "700"] });

const App = ({ Component, pageProps }: AppProps) => {
  return (
    // <main className={inconsolata.className}>
    <SessionProvider session={pageProps.session}>
      <ChakraProvider>
        <AuthGuard>
          <Component {...pageProps} />
        </AuthGuard>
      </ChakraProvider>
    </SessionProvider>
    // </main>
  );
};

export default App;
