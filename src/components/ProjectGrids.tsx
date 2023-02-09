import { Box, Button, Center, Text, Wrap, WrapItem } from "@chakra-ui/react";
import Link from "next/link";
import React, { ReactNode } from "react";

type Props = {
  cursusProjects: {
    name: string;
    slug: string;
    rank: number;
  }[];
  designatedRank: number;
  marginBottom: string;
};

export const ProjectGrids: React.FC<Props> = (props) => {
  const { cursusProjects, designatedRank, marginBottom } = props;

  return (
    <Box marginBottom={marginBottom}>
      <Text fontSize="xl" fontWeight="bold" py="2">
        Rank {designatedRank}
      </Text>
      <Wrap spacing={4}>
        {cursusProjects
          .filter((value) => value.rank === designatedRank)
          .map((cursusProject) => (
            <WrapItem key={cursusProject.name}>
              <Link href={`/${cursusProject.name}`}>
                {/* <Box
                  w="160px"
                  h="50px"
                  bg="gray.200"
                  borderRadius="10px"
                  shadow="md"
                  _hover={{ cursor: "pointer", opacity: "0.8" }}
                > */}
                <Button w="170px" h="40px">
                  <Center py="3">
                    <Text fontSize="lg">{cursusProject.name}</Text>
                  </Center>
                </Button>
                {/* </Box> */}
              </Link>
            </WrapItem>
          ))}
      </Wrap>
    </Box>
  );
};
