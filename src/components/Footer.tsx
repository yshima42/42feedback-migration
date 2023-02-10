// Header.tsx
import React from "react";
import { Flex } from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { SITE_NAME } from "utils/constants";

const Footer: React.FC = () => {
  return (
    <Flex
      as="nav"
      bg="gray.700"
      color="gray.50"
      h={{ base: "3rem", md: "4rem" }}
      padding={{ base: "0.5rem", md: "0.7rem" }}
    ></Flex>
  );
};

export default Footer;
