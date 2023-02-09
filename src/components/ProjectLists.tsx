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
};

export const ProjectLists: React.FC<Props> = (props) => {
  const { cursusProjects, designatedRank } = props;

  return (
    <Box>
      <Text fontSize="lg" fontWeight="bold">
        Rank {designatedRank}
      </Text>
      <UnorderedList>
        {cursusProjects
          .filter((value) => value.rank === designatedRank)
          .map((cursusProject) => (
            <ListItem key={cursusProject.name}>
              <Link href={`/${cursusProject.name}`}>
                <Text color="blue.500" fontSize="lg">
                  <a>{cursusProject.name}</a>
                </Text>
              </Link>
            </ListItem>
          ))}
      </UnorderedList>
    </Box>
  );
};
