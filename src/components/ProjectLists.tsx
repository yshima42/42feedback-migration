import { Box, ListItem, Text, UnorderedList } from "@chakra-ui/react";
import Link from "next/link";
import React from "react";

type Props = {
  cursusProjects: {
    name: string;
    slug: string;
    rank: number;
  }[];
  designatedRank: number;
  marginBottom: string;
};

export const ProjectLists: React.FC<Props> = (props) => {
  const { cursusProjects, designatedRank, marginBottom } = props;

  return (
    <Box marginBottom={marginBottom}>
      <Text fontSize="lg" fontWeight="bold">
        Rank {designatedRank}
      </Text>
      <Box marginLeft={"1em"}>
        <UnorderedList spacing={0.5}>
          {cursusProjects
            .filter((value) => value.rank === designatedRank)
            .map((cursusProject) => (
              <ListItem key={cursusProject.name}>
                <Link href={`/${cursusProject.name}`}>
                  <Text color="blue.500" fontSize="lg">
                    {cursusProject.name}
                  </Text>
                </Link>
              </ListItem>
            ))}
        </UnorderedList>
      </Box>
    </Box>
  );
};
