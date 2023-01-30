import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect } from "react";

const YshimazuPage = () => {
  const { data: session } = useSession();
  console.log(session?.accessToken);

  return (
    <Layout>
      <Heading>yshimazu</Heading>
      <LineChartSample />
    </Layout>
  );
};

export default YshimazuPage;
