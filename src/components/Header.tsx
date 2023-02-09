// Header.tsx
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Avatar, Box, Button, Flex, Heading, Text } from "@chakra-ui/react";
import { SITE_NAME } from "utils/constants";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  let left = <Link href="/">{SITE_NAME}</Link>;

  let right = null;

  if (status === "loading") {
    left = <Link href="/">{SITE_NAME}</Link>;
    right = <Text>Validating session ...</Text>;
  }

  if (!session) {
    right = <Link href="/api/auth/signin">Log in</Link>;
  }

  if (session) {
    left = (
      <Heading as="h1" fontSize={{ base: "md", md: "xl" }}>
        <Link href="/">
          {/* next/linkだとデフォルトでホバーした時に青くなってしまうので無効化 */}
          <Text _hover={{ color: "gray.50" }}>{SITE_NAME}</Text>
        </Link>
      </Heading>
    );
    right = (
      <Flex align="center">
        <Box pr={4} fontSize="xs" display={{ base: "none", md: "flex" }}>
          <Avatar src={session.user?.image ?? ""} size="sm" />
        </Box>
        <Button
          colorScheme="gray"
          color="gray.600"
          size="xs"
          onClick={() => signOut()}
        >
          Log out
        </Button>
      </Flex>
    );
  }

  return (
    <Flex
      as="nav"
      bg="gray.700"
      color="gray.50"
      align="center"
      justify="space-between"
      padding={{ base: "0.5rem", md: "1rem" }}
    >
      {left}
      {right}
    </Flex>
  );
};

export default Header;
