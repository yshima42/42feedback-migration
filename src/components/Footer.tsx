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
      position="absolute"
      left={0}
      right={0}
      bottom={0}
    ></Flex>
  );
};

export default Footer;
