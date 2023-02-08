import { Layout } from "@/components/Layout";
import Link from "next/link";
import { Box } from "@chakra-ui/react";
import { cursusProjects } from "../../../utils/objects";

const Feedbacks = () => {
  return (
    <Layout name="Feedbacks">
      {cursusProjects.map((cursusProject) => (
        <Box key={cursusProject.slug}>
          <Link href={`/feedbacks/${cursusProject.slug}`}>
            {cursusProject.name}
          </Link>
          <br />
        </Box>
      ))}
    </Layout>
  );
};

export default Feedbacks;
