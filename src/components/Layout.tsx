import { Box, Container, Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  pageTitle?: string;
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => {
  const { pageTitle, children } = props;

  return (
    <div>
      <Header />
      <Container maxW="container.xl">
        <Box p={{ base: 1, md: 4 }}>
          {pageTitle && (
            <Heading py="2" as="h2" fontSize="2xl">
              {pageTitle}
            </Heading>
          )}
          {children}
        </Box>
      </Container>
    </div>
  );
};
