import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import axios from "axios";
import { Token } from "types/token";
import Head from "next/head";
import { cursusProjects } from "../../../utils/objects";

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

// 42APIのアクセストークンを取得
const fetchAccessToken = async () => {
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

  // TODO: 要確認、ここでエラーハンドリングするとでブロイでバグる
  const response = await axios.request(reqOptions);
  const token = response.data;

  return token;
};

const fetchProjectReviews = async (token: Token, projectId: string) => {
  const headersList = {
    Authorization: "Bearer " + token?.access_token,
  };

  const reqOptions = {
    url: `${API_URL}/v2/projects/${projectId}/scale_teams?page[size]=100&page[number]=1&filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`,
    method: "GET",
    headers: headersList,
  };

  // TODO: 要確認、ここでエラーハンドリングするとでブロイでバグる
  const response = await axios.request(reqOptions);

  const numberOfContents = response.headers["x-total"];
  const numberOfPages = Math.ceil(numberOfContents / 100);

  for (let i = 2; i <= numberOfPages; i++) {
    const reqOptions = {
      url: `${API_URL}/v2/projects/${projectId}/scale_teams?page[size]=100&page[number]=${i}&filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`,
      method: "GET",
      headers: headersList,
    };

    const responsesFromSecondPage = await axios.request(reqOptions);
    responsesFromSecondPage.data.forEach((value: ProjectReview) => {
      response.data.push(value);
    });
  }

  const projectReviews: ProjectReview[] = response.data.map(
    (value: ProjectReview) => {
      return {
        id: value["id"],
        corrector: {
          login: value["corrector"]["login"],
        },
        final_mark: value["final_mark"],
        comment: value["comment"],
      };
    }
  );

  return projectReviews;
};

export const getStaticPaths = async () => {
  const paths = cursusProjects.map((project) => {
    return {
      params: {
        id: project.slug,
      },
    };
  });

  return {
    paths,
    fallback: "blocking",
  };
};

export const getStaticProps: GetStaticProps = async (context) => {
  if (!context.params) return { notFound: true };
  const projectId = context.params.id as string;

  let token: Token;
  try {
    token = await fetchAccessToken();
  } catch (error) {
    const errorMessage = "アクセストークンの取得に失敗しました";
    console.log(errorMessage);
    return {
      props: {
        error: errorMessage,
      },
    };
  }

  let projectReviews: ProjectReview[] = [];
  try {
    projectReviews = await fetchProjectReviews(
      token,
      cursusProjects.find((project) => project.slug === projectId)
        ?.slug as string
    );
  } catch (error) {
    const errorMessage = "review-commentsの取得に失敗しました";
    console.log(errorMessage);
    return {
      props: {
        error: errorMessage,
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

const FeedbackComments = (props: Props) => {
  const { projectReviews, error } = props;

  if (error) return <p>error: {error}</p>;

  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
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

export default FeedbackComments;
