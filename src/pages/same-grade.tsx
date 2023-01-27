import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";

const SameGrade = () => {
  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <LineChartSample />
    </Layout>
  );
};

export default SameGrade;
