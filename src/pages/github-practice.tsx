import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { GraphQLClient } from "graphql-request";

const API = "https://api.github.com/graphql";

const GithubPage = () => {
  const { data: session } = useSession();
  const [client, setClient] = useState<GraphQLClient>();

  useEffect(() => {
    if (session) {
      setClient(
        new GraphQLClient(API, {
          headers: [["Authorization", "bearer " + session.accessToken]],
        })
      );
      console.log(client);
    }
  }, [session]);

  return (
    <Layout>
      <Heading>github practice-dev</Heading>
    </Layout>
  );
};

export default GithubPage;
