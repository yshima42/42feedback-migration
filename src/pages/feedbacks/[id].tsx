import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import { Token } from "types/token";
import Head from "next/head";
import { cursusProjects } from "../../../utils/objects";
import {
  axiosRetryInSSG,
  fetchAccessToken,
  fetchAllDataByAxios,
} from "utils/functions";

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
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

  const response = await fetchAllDataByAxios(reqOptions);

  const projectReviews: ProjectReview[] = response.map((value) => {
    return {
      id: value["id"],
      corrector: {
        login: value["corrector"]["login"],
      },
      final_mark: value["final_mark"],
      comment: value["comment"],
    };
  });

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
  axiosRetryInSSG();

  if (!context.params) return { notFound: true };
  const projectId = context.params.id as string;

  let token: Token;
  try {
    token = await fetchAccessToken();
  } catch (error) {
    const errorMessage = "アクセストークンの取得に失敗しました";
    console.log(errorMessage);
    console.log(error);
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
    revalidate: 60 * 60,
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
