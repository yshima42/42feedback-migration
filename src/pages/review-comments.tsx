import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
// import { getToken } from "next-auth/jwt";
import { GetStaticProps } from "next";
import { Feedbacks } from "utils/type";

const PROJECT_ID = 1331;
const CURSUS_ID = 21;
const CAMPUS_ID = 26;

export const getStaticProps: GetStaticProps = async () => {
  let data: Feedbacks[] = [];

  // TODO: axiosを使う
  const res = await fetch("https://api.intra.42.fr/oauth/token", {
    method: "POST",
    headers: {
      "Content-Type": "application/x-www-form-urlencoded",
    },
    body: `grant_type=client_credentials&client_id=${process.env.FORTY_TWO_CLIENT_ID}&client_secret=${process.env.FORTY_TWO_CLIENT_SECRET}`,
  });
  const token = await res.json();

  // TODO: axiosを使う
  // TODO: エラーハンドリング
  if (token) {
    const res = await fetch(
      `https://api.intra.42.fr/v2/projects/${PROJECT_ID}/scale_teams?
      &page[size]=10
      &page[number]=1
      &filter[cursus_id]=${CURSUS_ID}
      &filter[campus_id]=${CAMPUS_ID}`,
      {
        headers: {
          Authorization: "Bearer " + token?.access_token,
        },
      }
    );
    data = await res.json();
  } else {
    console.log("no token");
  }

  return {
    props: {
      data,
    },
    revalidate: 10,
  };
};

type Props = {
  data: Feedbacks[];
};

const ReviewComments = (props: Props) => {
  const { data } = props;

  return (
    <Layout>
      <Heading>review-comments</Heading>
      <div>
        {data.map((value: Feedbacks) => (
          <div key={value["id"]}>
            {value["corrector"]["login"]}
            <br />
            final_mark: {value["final_mark"]}
            <br />
            comment: {value["comment"]}
            <br />
            <br />
          </div>
        ))}
      </div>
    </Layout>
  );
};

export default ReviewComments;
