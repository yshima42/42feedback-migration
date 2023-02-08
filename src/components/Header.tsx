// Header.tsx
import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import { Box, Button, Flex, Heading, Text } from "@chakra-ui/react";

const Header: React.FC = () => {
  const { data: session, status } = useSession();

  let left = <Link href="/">42Progress</Link>;

  let right = null;

  if (status === "loading") {
    left = <Link href="/">42Feedback</Link>;
    right = <Text>Validating session ...</Text>;
  }

  if (!session) {
    right = <Link href="/api/auth/signin">Log in</Link>;
  }

  if (session) {
    left = (
      <Heading as="h1" size={{ base: "md", md: "lg" }}>
        <Link href="/">42Progress</Link>
      </Heading>
    );
    right = (
      <Flex align="center">
        <Box pr={4} fontSize="sm" display={{ base: "none", md: "flex" }}>
          <Text>
            {session.user?.name} ({session.user?.email})
          </Text>
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
