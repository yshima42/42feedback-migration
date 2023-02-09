import { Box, Center, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  cursusProjects: {
    name: string;
    slug: string;
    rank: number;
  }[];
  designatedRank: number;
};

export const ProjectGrids: React.FC<Props> = (props) => {
  const { cursusProjects, designatedRank } = props;

  return (
    <>
      <Text fontSize="xl" fontWeight="bold" py="2">
        Rank {designatedRank}
      </Text>
      <Wrap spacing={4}>
        {cursusProjects
          .filter((value) => value.rank === designatedRank)
          .map((cursusProject) => (
            <WrapItem key={cursusProject.slug}>
              <Link href={`/${cursusProject.slug}`}>
                <Box
                  w="140px"
                  h="140px"
                  bg="gray.200"
                  borderRadius="10px"
                  shadow="md"
                  _hover={{ cursor: "pointer", opacity: "0.8" }}
                >
                  <Center py="10">
                    <Text fontSize="lg">{cursusProject.name}</Text>
                  </Center>
                </Box>
              </Link>
            </WrapItem>
          ))}
      </Wrap>
    </>
  );
};
