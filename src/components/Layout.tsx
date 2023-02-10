import { Box, Container, Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Footer from "./Footer";
import Header from "./Header";

type Props = {
  pageTitle?: string;
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => {
  const { pageTitle, children } = props;

  return (
    <Box minHeight="100vh" paddingBottom={{ base: "3rem", md: "4rem" }}>
      <Header />
      <Container maxW="container.xl">
        <Box p={{ base: 1, md: 4 }}>
          {pageTitle && (
            <Heading pb={{ base: "1", md: "4" }} as="h2" fontSize="2xl">
              {pageTitle}
            </Heading>
          )}
          {children}
        </Box>
      </Container>
      <Footer />
    </Box>
  );
};
