import { Layout } from "@/components/Layout";
import { Heading, Image } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import Head from "next/head";
import { axiosRetryInSSG, fetchAccessToken } from "utils/functions";
import axios from "axios";
import { CursusUser } from "types/cursusUsers";
import { ScaleTeam } from "types/scaleTeam";
import cursusUsers from "utils/cursus-users.preval";

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
    image: string;
  };
  final_mark: number;
  comment: string;
};

const fetchProjectReviews = async (
  projectId: string,
  accessToken: string,
  pageNum: number,
  pageSize: number
) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}&page[number]=${pageNum}&page[size]=${pageSize}`;
  const response = await axios.get(url, {
    headers: {
      Authorization: `Bearer ${accessToken}`,
    },
  });
  return response.data;
};

const makeProjectReviews = (
  scaleTeams: ScaleTeam[],
  cursusUsers: CursusUser[]
) => {
  const projectReviews: ProjectReview[] = scaleTeams.map((value: any) => {
    const login = value.corrector.login;
    const targetCursusUser = cursusUsers.find(
      (cursusUser) => cursusUser.user.login === login
    );

    const image = targetCursusUser!.user.image.versions.small;
    return {
      id: value.id,
      corrector: {
        login: login,
        image: image!,
      },
      final_mark: value.final_mark,
      comment: value.comment,
    };
  });

  return projectReviews;
};

export const getStaticProps: GetStaticProps = async () => {
  try {
    axiosRetryInSSG();

    const token = await fetchAccessToken();
    const projectId = "42cursus-libft";

    const scaleTeams = await fetchProjectReviews(
      projectId,
      token.access_token,
      1,
      100
    );
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
