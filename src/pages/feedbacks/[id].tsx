import { Layout } from "@/components/Layout";
import { Center, Heading, Box } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../../utils/objects";
import { axiosRetryInSSG, fetchAllDataByAxios } from "utils/functions";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { CursusUser } from "types/cursusUsers";
import { ProjectReview } from "types/projectReview";
import { FeedbackCard } from "@/components/FeedbackCard";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";

const fetchScaleTeams = async (projectId: string, accessToken: string) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`;
  const response = await fetchAllDataByAxios(url, accessToken);

  return response;
};

// ここもしわかりにくかったら教えてください
const isValidScaleTeam = (scaleTeam: ScaleTeam) => {
  if (
    // コメントがない場合は除外
    scaleTeam.comment !== null &&
    // cursus_usersに存在しないユーザーは除外
    cursusUsers.find(
      (cursusUser) => cursusUser.user.login === scaleTeam.corrector.login
    )
  ) {
    return true;
  }
  return false;
};

const makeProjectReviews = (
  scaleTeams: ScaleTeam[],
  cursusUsers: CursusUser[]
) => {
  // 42apiのバグでcursus_usersの中に存在しないユーザーがいる場合があるので、その場合のvalidate処理
  const validScaleTeams = scaleTeams.filter(isValidScaleTeam);

  const projectReviews = validScaleTeams.map((value: ScaleTeam) => {
    const login = value.corrector.login;

    const targetCursusUser = cursusUsers.find(
      (cursusUser) => cursusUser.user.login === login
    );
    // 万が一urlが存在しない場合は空文字を入れる
    const image = targetCursusUser!.user.image.versions.small ?? "";

    return {
      id: value.id,
      corrector: {
        login: login,
        image: image,
      },
      final_mark: value.final_mark,
      comment: value.comment,
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
  // 引数のバリデーション
  if (!context.params) {
    return { notFound: true };
  }

  const projectId = context.params.id as string;
  if (!cursusProjects.find((project) => project.slug === projectId)) {
    return { notFound: true };
  }

  // データの取得
  try {
    axiosRetryInSSG();

    const scaleTeams = await fetchScaleTeams(projectId, token.access_token);

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

  return (
    <>
      {projectReviews.map((projectReview: ProjectReview) => (
        <Box key={projectReview.id} mb={8}>
          <FeedbackCard projectReview={projectReview} />
        </Box>
      ))}
    </>
  );
};

const REVIEWS_PER_PAGE = 20;

const PaginatedFeedbackComments = (props: Props) => {
  const { projectReviews } = props;

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + REVIEWS_PER_PAGE;
  const currentItems = projectReviews.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(projectReviews.length / REVIEWS_PER_PAGE);

  // ページ遷移時にページトップにスクロール
  // こちら参考: https://stackoverflow.com/questions/36904185/react-router-scroll-to-top-on-every-transition
  // もっと良いものあるかも: https://developer.mozilla.org/ja/docs/Web/API/Window/scrollTo
  useEffect(() => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  }, [currentItems]);

  const handlePageChange = (event: { selected: number }) => {
    const newOffset =
      (event.selected * REVIEWS_PER_PAGE) % projectReviews.length;
    setItemOffset(newOffset);
  };

  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Heading>review-comments</Heading>
      <FeedbackComments projectReviews={currentItems} />
      <Center>
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageChange}
          pageRangeDisplayed={5}
          pageCount={pageCount}
          previousLabel="<"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      </Center>
    </Layout>
  );
};

export default PaginatedFeedbackComments;
