import Link from "next/link";
import { Layout } from "@/components/Layout";
import { Box } from "@chakra-ui/react";
import { cursusProjects } from "../../utils/objects";

const Home = () => {
  return (
    <Layout name="">
      {cursusProjects.map((cursusProject) => (
        <Box key={cursusProject.slug}>
          <Link href={`/${cursusProject.slug}`}>{cursusProject.name}</Link>
          <br />
        </Box>
      ))}
    </Layout>
  );
};

export default Home;
