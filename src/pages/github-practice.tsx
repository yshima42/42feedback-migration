import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const API = "https://api.github.com/users/yshima42";

const GithubPage = () => {
  const { data: session } = useSession();
  const [client, setClient] = useState();

  useEffect(() => {
    if (session) {
      fetch(API, {
        headers: {
          Authorization: "Bearer " + session.accessToken,
        },
      })
        .then((response) => response.json())
        .then((json) => {
          console.log(json);
        });
    }
  }, [session]);

  return (
    <Layout>
      <Heading>github practice-dev</Heading>
    </Layout>
  );
};

export default GithubPage;
