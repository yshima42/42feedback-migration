import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { parseCookies, setCookie, destroyCookie } from "nookies";
import { useEffect } from "react";

const YshimazuPage = () => {
  const { data: session } = useSession();

  useEffect(() => {
    if (session) {
      fetch("https://api.intra.42.fr/v2/users/yshimazu", {
        headers: {
          Authorization: "Bearer " + session?.accessToken,
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
      <Heading>yshimazu</Heading>
      <LineChartSample />
    </Layout>
  );
};

export default YshimazuPage;
