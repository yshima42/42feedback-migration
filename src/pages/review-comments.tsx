import { Layout } from "@/components/Layout";
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
      page[size]=100
      &filter[cursus_id]=${CURSUS_ID}
      &filter[campus_id]=${CAMPUS_ID}
      &range[final_mark]=${MIN_VALUE},${MAX_VALUE}`,
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
  const { data } = props;

  return (
    <Layout>
      <Heading>review-comments</Heading>
      <div>
        {data.map((value: any) => (
          <div key={value["id"]}>
            {value["comment"]}
            <br />
            <br />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ReviewComments;
