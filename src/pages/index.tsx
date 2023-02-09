import Link from "next/link";
import { Layout } from "@/components/Layout";
import { cursusProjects } from "../../utils/objects";
import { ProjectGrids } from "@/components/ProjectGrids";
import { useState } from "react";
import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { ProjectLists } from "@/components/ProjectLists";

const Home = () => {
  const [isGrid, setIsGrid] = useState(false);

  return (
    <Layout>
      <Flex>
        <Box>
          {isGrid
            ? [...Array(7).keys()].map((value) => (
                <ProjectGrids
                  key={value}
                  cursusProjects={cursusProjects}
                  designatedRank={value}
                  marginBottom="3"
                />
              ))
            : [...Array(7).keys()].map((value) => (
                <ProjectLists
                  key={value}
                  cursusProjects={cursusProjects}
                  designatedRank={value}
                  marginBottom="3"
                />
              ))}
        </Box>
        <Spacer />
        <Box>
          <Button size="sm" onClick={() => setIsGrid(!isGrid)}>
            {isGrid ? "List" : "Grid"}
          </Button>
        </Box>
      </Flex>
    </Layout>
  );
};

export default Home;
