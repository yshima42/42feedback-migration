import React from "react";
import { Flex } from "@chakra-ui/react";
import { MAIN_COLOR } from "utils/constants";

const Footer: React.FC = () => {
  return (
    <Flex
      as="nav"
      bg={MAIN_COLOR}
      color="gray.50"
      h={{ base: "3rem", md: "4rem" }}
      padding={{ base: "0.5rem", md: "0.7rem" }}
      mt={{ base: "1rem", md: "2rem" }}
    ></Flex>
  );
};

export default Footer;
