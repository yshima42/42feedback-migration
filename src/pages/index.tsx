import Link from "next/link";
import { Layout } from "@/components/Layout";
import { cursusProjects } from "../../utils/objects";
import { ProjectGrids } from "@/components/ProjectGrids";

const Home = () => {
  return (
    <Layout pageTitle="">
      <ProjectGrids cursusProjects={cursusProjects} />
    </Layout>
  );
};

export default Home;
