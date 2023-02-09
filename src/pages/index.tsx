import Link from "next/link";
import { Layout } from "@/components/Layout";
import { cursusProjects } from "../../utils/objects";
import { ProjectGrids } from "@/components/ProjectGrids";

const Home = () => {
  return (
    <Layout pageTitle="">
      <ProjectGrids cursusProjects={cursusProjects} designatedRank={1} />
      <ProjectGrids cursusProjects={cursusProjects} designatedRank={2} />
      <ProjectGrids cursusProjects={cursusProjects} designatedRank={3} />
      <ProjectGrids cursusProjects={cursusProjects} designatedRank={4} />
      <ProjectGrids cursusProjects={cursusProjects} designatedRank={5} />
      <ProjectGrids cursusProjects={cursusProjects} designatedRank={6} />
    </Layout>
  );
};

export default Home;
