import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { getToken } from "next-auth/jwt";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const API = "https://api.github.com/graphql";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = await getToken({ req: context.req });
  let data = {};

  if (token) {
    console.log("token: ", token.accessToken);
    const res = await fetch("https://api.intra.42.fr/v2/users/yshimazu", {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    });

    data = await res.json();
    console.log(data);
  } else {
    console.log("no token");
  }

  return {
    props: {
      data,
    },
  };
};

const YshimazuPage = (props: { data: any }) => {
  return (
    <Layout>
      <Heading>yshimazu </Heading>
      <p>{JSON.stringify(props.data)}</p>
      <LineChartSample />
    </Layout>
  );
};

export default YshimazuPage;
