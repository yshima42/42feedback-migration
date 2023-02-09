import { Box, Container, Heading } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  pageTitle: string;
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Container maxW="container.xl">
      <Box p={2}>
        <Heading py="2" as="h2" fontSize="2xl">
          {props.pageTitle}
        </Heading>
        {props.children}
      </Box>
    </Container>
  </div>
);
