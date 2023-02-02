import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import axios from "axios";

const PROJECT_ID = 1331;

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

type Token = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
  created_at: number;
};

// 42APIのアクセストークンを取得
const getAccessToken = async () => {
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
  const token = response.data;

  return token;
};

// review-commentsを取得
const getReviewInfo = async (token: Token) => {
  const headersList = {
    Authorization: "Bearer " + token?.access_token,
  };

  const reqOptions = {
    url: `${API_URL}/v2/projects/${PROJECT_ID}/scale_teams?page[size]=100&page[number]=1&filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`,
    method: "GET",
    headers: headersList,
  };

  const response = await axios.request(reqOptions);
  const projectReview: ProjectReview[] = response.data;
  console.log(projectReview);

  return projectReview;
};

export const getStaticProps: GetStaticProps = async () => {
  let token: Token;

  try {
    token = await getAccessToken();
  } catch (error) {
    return {
      props: {
        error: "アクセストークンの取得に失敗しました",
      },
    };
  }

  let projectReviews: ProjectReview[] = [];
  try {
    projectReviews = await getReviewInfo(token);
  } catch (error) {
    return {
      props: {
        error: "review-commentsの取得に失敗しました",
      },
    };
  }

  return {
    props: {
      projectReviews,
    },
    revalidate: 10,
  };
};

type Props = {
  projectReviews: ProjectReview[];
  error?: string;
};

const ReviewComments = (props: Props) => {
  const { projectReviews, error } = props;

  if (error) return <p>error: {error}</p>;

  return (
    <Layout>
      <Heading>review-comments</Heading>
      <div>
        {projectReviews.map((value: ProjectReview) => (
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
