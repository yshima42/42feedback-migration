import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { getSession, useSession } from "next-auth/react";
import getServerSession from "next-auth/next";
import { useEffect, useState } from "react";
import { getToken } from "next-auth/jwt";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const API = "https://api.github.com/graphql";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = await getToken({ req: context.req });
  let res = {};
  // const session = await getServerSession(context.req, context.res, authOptions);

  if (token) {
    console.log("token: ", token.accessToken);
    fetch("https://api.intra.42.fr/v2/users/yshimazu", {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    })
      .then((response) => response.json())
      .then((json) => {
        res = json;
        console.log(json);
      });
  } else {
    console.log("no token");
  }

  return {
    props: res,
  };
};

const YshimazuPage = (props: any) => {
  const { data: session } = useSession();

  // useEffect(() => {
  //   if (session) {
  // fetch("https://api.intra.42.fr/v2/users/yshimazu", {
  //   headers: {
  //     Authorization: "Bearer " + session?.accessToken,
  //   },
  // })
  //   .then((response) => response.json())
  //   .then((json) => {
  //     console.log(json);
  //   });
  //   }
  // }, [session]);

  return (
    <Layout>
      <Heading>yshimazu </Heading>
      <p>{JSON.stringify(props)}</p>
      <LineChartSample />
    </Layout>
  );
};

export default YshimazuPage;
