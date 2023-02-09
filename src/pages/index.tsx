import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Text, Box, Center, Wrap, WrapItem } from "@chakra-ui/react";
import { cursusProjects } from "../../utils/objects";
import { ProjectGrid } from "@/components/ProjectGrid";

const Home = () => {
  return (
    <Layout name="">
      <ProjectGrid cursusProjects={cursusProjects} />
    </Layout>
  );
};

export default Home;
