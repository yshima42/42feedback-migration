import { Layout } from "@/components/Layout";
import { Center, Box, Input, Text } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../utils/objects";
import { axiosRetryInSSG, fetchAllDataByAxios } from "utils/functions";
import { useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { CursusUser } from "types/cursusUsers";
import { ProjectFeedback } from "types/projectFeedback";
import { FeedbackCard } from "@/components/FeedbackCard";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";
import escapeStringRegexp from "escape-string-regexp";

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

const makeProjectFeedbacks = (
  slug: string,
  scaleTeams: ScaleTeam[],
  cursusUsers: CursusUser[]
) => {
  // 42apiのバグでcursus_usersの中に存在しないユーザーがいる場合があるので、その場合のvalidate処理
  const validScaleTeams = scaleTeams.filter(isValidScaleTeam);

  const projectFeedbacks = validScaleTeams.map((value: ScaleTeam) => {
    const login = value.corrector.login;

    const targetCursusUser = cursusUsers.find(
      (cursusUser) => cursusUser.user.login === login
    );
    // 万が一urlが存在しない場合は空文字を入れる
    const image = targetCursusUser!.user.image.versions.small ?? "";

    return {
      id: value.id,
      slug: slug,
      corrector: {
        login: login,
        image: image,
      },
      comment: value.comment,
      projects_user_id: value.team.users[0].projects_user_id,
    };
  });

  return projectFeedbacks;
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

  const slug = context.params.id as string;
  if (!cursusProjects.find((project) => project.slug === slug)) {
    return { notFound: true };
  }

  // データの取得
  try {
    axiosRetryInSSG();

    const scaleTeams = await fetchScaleTeams(slug, token.access_token);

    const projectFeedbacks = makeProjectFeedbacks(
      slug,
      scaleTeams,
      cursusUsers
    );

    return {
      props: { projectFeedbacks },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.log(error);
    throw new Error("getStaticProps error");
  }
};

type Props = {
  projectFeedbacks: ProjectFeedback[];
};

const ProjectFeedbacks = (props: Props) => {
  const { projectFeedbacks } = props;

  return (
    <>
      {projectFeedbacks.map((projectFeedback: ProjectFeedback) => (
        <Box key={projectFeedback.id} mb={8}>
          <FeedbackCard projectFeedback={projectFeedback} />
        </Box>
      ))}
    </>
  );
};

const FEEDBACKS_PER_PAGE = 20;

const PaginatedProjectFeedbacks = (props: Props) => {
  const { projectFeedbacks } = props;

  const [searchedProjectFeedbacks, setSearchedProjectFeedbacks] =
    useState(projectFeedbacks);
  const [itemOffset, setItemOffset] = useState(0);
  const [isComposing, setIsComposing] = useState(false);
  const endOffset = itemOffset + FEEDBACKS_PER_PAGE;
  const currentItems = searchedProjectFeedbacks.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(
    searchedProjectFeedbacks.length / FEEDBACKS_PER_PAGE
  );

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
      (event.selected * FEEDBACKS_PER_PAGE) % searchedProjectFeedbacks.length;
    setItemOffset(newOffset);
  };

  const includesSearchKeyword = (
    projectFeedback: ProjectFeedback,
    searchKeyword: string
  ) => {
    // 入力された文字列を安全に正規表現に変換
    const escapedSearchKeyword = escapeStringRegexp(searchKeyword);
    const regex = new RegExp(escapedSearchKeyword, "i");
    return (
      projectFeedback.comment.match(regex) ||
      projectFeedback.corrector.login.match(regex)
    );
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing) {
      return;
    }
    const newSearchedProjectFeedbacks = projectFeedbacks.filter(
      (projectFeedback) => {
        return includesSearchKeyword(projectFeedback, event.target.value);
      }
    );
    setSearchedProjectFeedbacks(newSearchedProjectFeedbacks);
    setItemOffset(0);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    event: React.CompositionEvent<HTMLInputElement>
  ) => {
    const newSearchedProjectFeedbacks = projectFeedbacks.filter(
      (projectFeedback) => {
        return includesSearchKeyword(projectFeedback, event.data);
      }
    );
    setSearchedProjectFeedbacks(newSearchedProjectFeedbacks);
    setItemOffset(0);
    setIsComposing(false);
  };

  return (
    <Layout name={projectFeedbacks[0].slug}>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Input
        placeholder="intra名、またはフィードバックの内容"
        onChange={handleInputChange}
        onCompositionStart={handleCompositionStart}
        onCompositionEnd={handleCompositionEnd}
        marginBottom={2}
      />
      <Text opacity={0.6}>About {searchedProjectFeedbacks.length} results</Text>
      <ProjectFeedbacks projectFeedbacks={currentItems} />
      <Center>
        {pageCount === 0 || pageCount == 1 ? (
          <></>
        ) : (
          <ReactPaginate
            breakLabel="..."
            nextLabel=">"
            onPageChange={handlePageChange}
            forcePage={itemOffset / FEEDBACKS_PER_PAGE}
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
        )}
      </Center>
    </Layout>
  );
};

export default PaginatedProjectFeedbacks;
