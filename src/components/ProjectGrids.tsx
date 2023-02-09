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
      <Text fontSize="lg" fontWeight="bold">
        Rank {designatedRank}
      </Text>
      <Wrap spacing={4}>
        {cursusProjects
          .filter((value) => value.rank === designatedRank)
          .map((cursusProject) => (
            <WrapItem key={cursusProject.name}>
              <Link href={`/${cursusProject.name}`}>
                <Button w="150px" h="150px" fontSize="md">
                  {cursusProject.name}
                </Button>
              </Link>
            </WrapItem>
          ))}
      </Wrap>
    </Box>
  );
};
