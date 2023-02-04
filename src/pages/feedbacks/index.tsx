import { Layout } from "@/components/Layout";
import Link from "next/link";
import { Heading } from "@chakra-ui/react";
import { cursusProjects } from "./objects";

const Feedbacks = () => {
  return (
    <Layout>
      <Heading>Feedbacks</Heading>
      {cursusProjects.map((cursusProject) => (
        <>
          <Link
            key={cursusProject.slug}
            href={`/feedbacks/${cursusProject.slug}`}
          >
            {cursusProject.name}
          </Link>
          <br />
        </>
      ))}
    </Layout>
  );
};

export default Feedbacks;
