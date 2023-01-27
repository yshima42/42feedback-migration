import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";

const YshimzuPage = () => {
  return (
    <Layout>
      <Heading>yshimazu - lint practice</Heading>
      <LineChartSample />
    </Layout>
  );
};

export default YshimzuPage;
