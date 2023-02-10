import React from "react";
import Link from "next/link";
import { signOut, useSession } from "next-auth/react";
import {
  Avatar,
  Flex,
  Heading,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Text,
} from "@chakra-ui/react";
import { ArrowForwardIcon } from "@chakra-ui/icons";
import { SITE_NAME, MAIN_COLOR } from "utils/constants";

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
        <Menu isLazy>
          <MenuButton>
            <Avatar src={session.user?.image ?? ""} size="sm" />
          </MenuButton>
          <MenuList color="gray.600" w={1}>
            <MenuItem icon={<ArrowForwardIcon />} onClick={() => signOut()}>
              Logout
            </MenuItem>
          </MenuList>
        </Menu>
      </Flex>
    );
  }

  return (
    <Flex
      as="nav"
      bg={MAIN_COLOR}
      color="gray.50"
      align="center"
      justify="space-between"
      padding={{ base: "0.5rem", md: "0.7rem" }}
    >
      {left}
      {right}
    </Flex>
  );
};

export default Header;
