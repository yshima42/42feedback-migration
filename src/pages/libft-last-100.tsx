import { Layout } from "@/components/Layout";
import { Heading, Image } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import Head from "next/head";
import {
  axiosRetryInSSG,
  fetchAccessToken,
  fetchAllDataByAxios,
} from "utils/functions";
import axios from "axios";
// import { CursusUser } from "next-auth/providers/42-school";

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
    image: string;
  };
  final_mark: number;
  comment: string;
};

const fetchProjectReviews = async (projectId: string, accessToken: string) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}&page[number]=1&page[size]=100`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const fetchCursusUsers = async (accessToken: string) => {
  const url = `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[campus_id]=${CAMPUS_ID}`;
  const response = await fetchAllDataByAxios(url, accessToken);
  return response;
};

const makeProjectReviews = (scaleTeams: any[], cursusUsers: any[]) => {
  const projectReviews: ProjectReview[] = scaleTeams.map((value: any) => {
    const login = value["corrector"]["login"];
    const image = cursusUsers.find(
      (cursusUser) => cursusUser.user.login === login
    )?.user.image.versions.small;
    return {
      id: value["id"],
      corrector: {
        login: login,
        image: image,
      },
      final_mark: value["final_mark"],
      comment: value["comment"],
    };
  });

  return projectReviews;
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    axiosRetryInSSG();

    const token = await fetchAccessToken();
    const projectId = "42cursus-libft";
    const scaleTeams = await fetchProjectReviews(projectId, token.access_token);
    const cursusUsers = await fetchCursusUsers(token.access_token);
    const projectReviews = makeProjectReviews(scaleTeams, cursusUsers);

    return {
      props: { projectReviews },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.log(error);
    throw new Error("getStaticProps error");
  }
};

type Props = {
  projectReviews: ProjectReview[];
};

const FeedbackComments = (props: Props) => {
  const { projectReviews } = props;

  if (!projectReviews) {
    return <p>{"Error"}</p>;
  }

  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Heading>libft last 100 reviews</Heading>
      <div>
        {projectReviews.map((value: ProjectReview) => (
          <div key={value["id"]}>
            {value["corrector"]["login"]}
            <br />
            {value["corrector"]["image"]}
            <Image
              src={value["corrector"]["image"]}
              alt={`${value["corrector"]["login"]}の画像`}
            />
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
