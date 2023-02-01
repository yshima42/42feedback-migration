import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getToken } from "next-auth/jwt";

type Props = {
  data?: any;
  statusText?: string;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const ftUrl = "https://api.intra.42.fr/v2/users/hyoshie";

  try {
    const token = await getToken({ req: context.req });
    const res = await fetch(ftUrl, {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    });
    if (!res.ok) {
      throw new Error(res.statusText);
    }
    const data = await res.json();
    return { props: { data } };
  } catch (error) {
    console.error("Could not fetch data from 42 API\n", error);
    const statusText = error instanceof Error ? error.message : "Unknown error";
    return { props: { statusText } };
  }
};

const SameGrade = ({ data, statusText }: Props) => {
  if (statusText) {
    return <p>{statusText}</p>;
  }
  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <LineChartSample />
      <p>{JSON.stringify(data)}</p>
    </Layout>
  );
};

export default SameGrade;
