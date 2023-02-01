import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const ftUrl = "https://api.intra.42.fr/v2/users/hyoshie";
  const token = await getToken({ req: context.req });
  let data = {};

  // try-catchで書き直す
  if (token) {
    console.log("token: ", token.accessToken);
    const res = await fetch(ftUrl, {
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

const SameGrade = (props: { data: any }) => {
  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <LineChartSample />
      <p>{JSON.stringify(props.data)}</p>
    </Layout>
  );
};

export default SameGrade;
