import { Layout } from "@/components/Layout";
import { cursusProjects } from "../../utils/objects";
import { ProjectGrids } from "@/components/ProjectGrids";
import { useState } from "react";
import { Box, Center, IconButton } from "@chakra-ui/react";
import { ProjectLists } from "@/components/ProjectLists";
import Head from "next/head";
import { SITE_NAME } from "utils/constants";
import { DragHandleIcon, HamburgerIcon } from "@chakra-ui/icons";
import { ListGridSwitch } from "@/components/ListGridSwitch";

const Home = () => {
  const [isList, setIsList] = useState(true);

  return (
    <>
      <Head>
        <title>{SITE_NAME}</title>
      </Head>
      <Layout>
        <Center>
          <ListGridSwitch setIsList={setIsList} isList={isList} />
        </Center>
        <Box>
          {isList
            ? [...Array(7).keys()].map((value) => (
                <ProjectLists
                  key={value}
                  cursusProjects={cursusProjects}
                  designatedRank={value}
                  marginBottom="3"
                />
              ))
            : [...Array(7).keys()].map((value) => (
                <ProjectGrids
                  key={value}
                  cursusProjects={cursusProjects}
                  designatedRank={value}
                  marginBottom="3"
                />
              ))}
        </Box>
      </Layout>
    </>
  );
};

export default Home;
