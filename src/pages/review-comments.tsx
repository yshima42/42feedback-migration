import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { getToken } from "next-auth/jwt";
import { GetServerSideProps, GetServerSidePropsContext } from "next";

const PROJECT_ID = 1331;
const CURSUS_ID = 21;
const CAMPUS_ID = 26;
const MIN_VALUE = 0;
const MAX_VALUE = 99;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = await getToken({ req: context.req });
  let data = {};

  if (token) {
    // console.log("token: ", token.accessToken);
    const res = await fetch(
      `https://api.intra.42.fr/v2/projects/${PROJECT_ID}/scale_teams?
      page%5Bsize%5D=100
      &filter%5Bcursus_id%5D=${CURSUS_ID}
      &filter%5Bcampus_id%5D=${CAMPUS_ID}
      &range%5Bfinal_mark%5D=${MIN_VALUE},${MAX_VALUE}`,
      {
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
      }
    );

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

const ReviewComments = (props: { data: any }) => {
  return (
    <Layout>
      <Heading>review-comments</Heading>
      <p>{JSON.stringify(props.data)}</p>
      <LineChartSample />
    </Layout>
  );
};

export default ReviewComments;
