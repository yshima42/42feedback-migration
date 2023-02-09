import Link from "next/link";
import { Layout } from "@/components/Layout";
import { cursusProjects } from "../../utils/objects";
import { ProjectGrids } from "@/components/ProjectGrids";

const Home = () => {
  return (
    <Layout pageTitle="">
      {[...Array(7).keys()].map((value) => (
        <ProjectGrids
          key={value}
          cursusProjects={cursusProjects}
          designatedRank={value}
          marginBottom="3"
        />
      ))}
    </Layout>
  );
};

export default Home;
