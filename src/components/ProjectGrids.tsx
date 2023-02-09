import { Box, Center, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  cursusProjects: {
    name: string;
    slug: string;
    rank: number;
  }[];
};

export const ProjectGrids: React.FC<Props> = (props) => {
  const { cursusProjects } = props;

  return (
    <Wrap spacing={4}>
      {cursusProjects.map((cursusProject) => (
        <WrapItem key={cursusProject.slug}>
          <Link href={`/${cursusProject.slug}`}>
            <Box
              w="160px"
              h="160px"
              bg="gray.200"
              borderRadius="10px"
              shadow="md"
              _hover={{ cursor: "pointer", opacity: "0.8" }}
            >
              <Center py="10">
                <Text fontSize="xl">{cursusProject.name}</Text>
              </Center>
            </Box>
          </Link>
        </WrapItem>
      ))}
    </Wrap>
  );
};
