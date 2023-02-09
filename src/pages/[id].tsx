import { Layout } from "@/components/Layout";

import {
  Center,
  Box,
  Input,
  InputGroup,
  InputLeftElement,
  Text,
  Select,
  Flex,
} from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID, SITE_NAME } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../utils/objects";
import { axiosRetryInSSG, fetchAllDataByAxios } from "utils/functions";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { CursusUser } from "types/cursusUsers";
import { ProjectFeedback } from "types/projectFeedback";
import { FeedbackCard } from "@/components/FeedbackCard";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";
import escapeStringRegexp from "escape-string-regexp";
import { SearchIcon } from "@chakra-ui/icons";

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
      updated_at: value.updated_at,
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
        id: project.name,
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

  const name = context.params.id as string;
  const slug = cursusProjects.find((project) => project.name === name)?.slug;
  if (!slug) {
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
      props: { projectFeedbacks, projectName: name },
      revalidate: 60 * 60,
    };
  } catch (error) {
    console.log(error);
    throw new Error("getStaticProps error");
  }
};

enum SortType {
  UpdateAtAsc = "UpdateAtAsc",
  UpdateAtDesc = "UpdateAtDesc",
  CommentLengthASC = "CommentLengthASC",
  CommentLengthDesc = "CommentLengthDesc",
  None = "None",
}

type Props = {
  projectFeedbacks: ProjectFeedback[];
  projectName: string;
};

const ProjectFeedbacks = (props: { projectFeedbacks: ProjectFeedback[] }) => {
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
  const { projectFeedbacks, projectName } = props;

  const [searchedProjectFeedbacks, setSearchedProjectFeedbacks] =
    useState(projectFeedbacks);
  const [sortedProjectFeedbacks, setSortedProjectFeedbacks] =
    useState(projectFeedbacks);
  const [sortType, setSortType] = useState(SortType.UpdateAtDesc);
  const [itemOffset, setItemOffset] = useState(0);
  const [isComposing, setIsComposing] = useState(false);

  const endOffset = itemOffset + FEEDBACKS_PER_PAGE;
  const currentItems = sortedProjectFeedbacks.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(
    searchedProjectFeedbacks.length / FEEDBACKS_PER_PAGE
  );

  // ページ遷移時にページトップにスクロール
  useEffect(() => {
    window.scroll(0, 0);
  }, [currentItems]);

  const sortFeedback = useCallback(
    (feedbacks: ProjectFeedback[], sortType: SortType) => {
      const callback = (a: ProjectFeedback, b: ProjectFeedback) => {
        switch (sortType) {
          case SortType.UpdateAtAsc:
            return (
              new Date(a.updated_at).getTime() -
              new Date(b.updated_at).getTime()
            );
          case SortType.UpdateAtDesc:
            return (
              new Date(b.updated_at).getTime() -
              new Date(a.updated_at).getTime()
            );
          case SortType.CommentLengthASC:
            return a.comment.length - b.comment.length;
          case SortType.CommentLengthDesc:
            return b.comment.length - a.comment.length;
          case SortType.None:
            return 0;
        }
      };
      const newSortedProjectFeedbacks = [...feedbacks].sort(callback);
      setSortedProjectFeedbacks(newSortedProjectFeedbacks);
    },
    []
  );

  // ソートを管理
  useEffect(() => {
    sortFeedback(searchedProjectFeedbacks, sortType);
  }, [searchedProjectFeedbacks, sortFeedback, sortType]);

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
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>
          {projectName} - {SITE_NAME}
        </title>
      </Head>
      <Layout pageTitle={projectName}>
        <Flex>
          <InputGroup size="md" marginBottom={2}>
            <InputLeftElement pointerEvents="none">
              <SearchIcon color="gray.300" />
            </InputLeftElement>
            <Input
              placeholder="login or comment"
              onChange={handleInputChange}
              onCompositionStart={handleCompositionStart}
              onCompositionEnd={handleCompositionEnd}
            />
          </InputGroup>
          <Select
            width={170}
            marginLeft={0.5}
            textAlign={"center"}
            backgroundColor={"gray.100"}
            placeholder={"⇅ Sort"}
            onChange={(event) => setSortType(event.target.value as SortType)}
            fontSize={"sm"}
          >
            <option value={SortType.UpdateAtDesc}>Date(Desc)</option>
            <option value={SortType.UpdateAtAsc}>Date(Asc)</option>
            <option value={SortType.CommentLengthDesc}>Length(Desc)</option>
            <option value={SortType.CommentLengthASC}>Length(Asc)</option>
          </Select>
        </Flex>
        <Text opacity={0.6}>{searchedProjectFeedbacks.length} feedbacks</Text>
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
    </>
  );
};

export default PaginatedProjectFeedbacks;
