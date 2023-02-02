import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import axios from "axios";

const PROJECT_ID = 1331;

type ReviewInfo = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

export const getStaticProps: GetStaticProps = async () => {
  let data: ReviewInfo[] = [];

  // 42APIのアクセストークンを取得
  const headersList = {
    Accept: "*/*",
    "Content-Type": "application/x-www-form-urlencoded",
  };

  const bodyContent = `grant_type=client_credentials&client_id=${process.env.FORTY_TWO_CLIENT_ID}&client_secret=${process.env.FORTY_TWO_CLIENT_SECRET}`;

  const reqOptions = {
    url: `${API_URL}/oauth/token`,
    method: "POST",
    headers: headersList,
    data: bodyContent,
  };

  const response = await axios.request(reqOptions);
  console.log(response.data);
  const token = response.data;

  // TODO: axiosを使う
  if (token) {
    const headersList = {
      Accept: "*/*",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: "Bearer " + token?.access_token,
    };

    const reqOptions = {
      url: `${API_URL}/v2/projects/${PROJECT_ID}/scale_teams?page[size]=100&page[number]=1&filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`,
      method: "GET",
      headers: headersList,
    };

    const response = await axios.request(reqOptions);
    console.log(response.data);
    data = response.data;
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
  data: ReviewInfo[];
};

const ReviewComments = (props: Props) => {
  const { data } = props;

  return (
    <Layout>
      <Heading>review-comments</Heading>
      <div>
        {data.map((value: ReviewInfo) => (
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
