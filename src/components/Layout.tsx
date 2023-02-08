import { Box, Container } from "@chakra-ui/react";
import React, { ReactNode } from "react";
import Header from "./Header";

type Props = {
  children: ReactNode;
};

export const Layout: React.FC<Props> = (props) => (
  <div>
    <Header />
    <Container maxW="container.xl">
      <Box p={2}>{props.children}</Box>
    </Container>
  </div>
);
