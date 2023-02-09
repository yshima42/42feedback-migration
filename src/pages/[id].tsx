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
import { SITE_NAME } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../utils/objects";
import { axiosRetryInSSG, fetchScaleTeams } from "utils/functions";
import { useCallback, useEffect, useState } from "react";
import ReactPaginate from "react-paginate";
import { CursusUser } from "types/cursusUsers";
import { Feedback } from "types/Feedback";
import { FeedbackCard } from "@/components/FeedbackCard";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";
import escapeStringRegexp from "escape-string-regexp";
import { SearchIcon } from "@chakra-ui/icons";

const isValidScaleTeam = (scaleTeam: ScaleTeam) => {
  if (
    scaleTeam.comment !== null &&
    cursusUsers.find(
      (cursusUser) => cursusUser.user.login === scaleTeam.corrector.login
    )
  ) {
    return true;
  }
  return false;
};

const makeFeedbacks = (
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
    const feedbacks = makeFeedbacks(slug, scaleTeams, cursusUsers);

    return {
      props: { feedbacks, projectName: name },
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

const Feedbacks = (props: { feedbacks: Feedback[] }) => {
  const { feedbacks } = props;

  return (
    <>
      {feedbacks.map((projectFeedback: Feedback) => (
        <Box key={projectFeedback.id} mb={8}>
          <FeedbackCard feedback={projectFeedback} />
        </Box>
      ))}
    </>
  );
};

const FEEDBACKS_PER_PAGE = 20;

type CompareFunc = (a: Feedback, b: Feedback) => number;

const sortTypeToCompareFunc = new Map<SortType, CompareFunc>([
  [SortType.UpdateAtAsc, (a, b) => a.updated_at.localeCompare(b.updated_at)],
  [SortType.UpdateAtDesc, (a, b) => b.updated_at.localeCompare(a.updated_at)],
  [SortType.CommentLengthASC, (a, b) => a.comment.length - b.comment.length],
  [SortType.CommentLengthDesc, (a, b) => b.comment.length - a.comment.length],
  [SortType.None, (a, b) => 0],
]);

type Props = {
  feedbacks: Feedback[];
  projectName: string;
};

const PaginatedFeedbacks = (props: Props) => {
  const { feedbacks, projectName } = props;

  const [searchWord, setSearchWord] = useState("");
  const [targetFeedbacks, setTargetFeedbacks] = useState(feedbacks);
  const [sortType, setSortType] = useState(SortType.UpdateAtDesc);
  const [itemOffset, setItemOffset] = useState(0);
  const [isComposing, setIsComposing] = useState(false);

  const endOffset = itemOffset + FEEDBACKS_PER_PAGE;
  const currentItems = targetFeedbacks.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(targetFeedbacks.length / FEEDBACKS_PER_PAGE);

  // ページ遷移時にページトップにスクロール
  useEffect(() => {
    window.scroll(0, 0);
  }, [currentItems]);

  const includesSearchKeyword = (feedback: Feedback, searchKeyword: string) => {
    // 入力された文字列を安全に正規表現に変換
    const escapedSearchKeyword = escapeStringRegexp(searchKeyword);
    const regex = new RegExp(escapedSearchKeyword, "i");
    return (
      feedback.comment.match(regex) || feedback.corrector.login.match(regex)
    );
  };

  // 対象となるフィードバックを更新する
  useEffect(() => {
    console.log("update searchedFeedbacks");
    console.log("searchWord: ", searchWord);
    // 検索ワードでフィルタリング
    const searchedFeedbacks = feedbacks.filter((feedback) =>
      includesSearchKeyword(feedback, searchWord)
    );
    // フィルタリング後のフィードバックをソート
    const sortedFeedbacks = searchedFeedbacks.sort(
      sortTypeToCompareFunc.get(sortType)
    );
    // 更新
    setTargetFeedbacks(sortedFeedbacks);
    // 対象となるフィードバックが変わったらページを先頭に戻す
    setItemOffset(0);
  }, [sortType, searchWord, feedbacks]);

  const handlePageChange = (event: { selected: number }) => {
    const newOffset = (event.selected * FEEDBACKS_PER_PAGE) % feedbacks.length;
    setItemOffset(newOffset);
  };

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (isComposing) {
      return;
    }
    setSearchWord(event.target.value);
  };

  const handleCompositionStart = () => {
    setIsComposing(true);
  };

  const handleCompositionEnd = (
    event: React.CompositionEvent<HTMLInputElement>
  ) => {
    setIsComposing(false);
    setSearchWord(searchWord + event.data);
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
            width={200}
            marginLeft={0.5}
            textAlign={"center"}
            backgroundColor={"gray.100"}
            placeholder={"⇅ Sort"}
            onChange={(event) => setSortType(event.target.value as SortType)}
          >
            <option value={SortType.UpdateAtDesc}>Date(Desc)</option>
            <option value={SortType.UpdateAtAsc}>Date(Asc)</option>
            <option value={SortType.CommentLengthDesc}>Length(Desc)</option>
            <option value={SortType.CommentLengthASC}>Length(Asc)</option>
          </Select>
        </Flex>
        <Text opacity={0.6}>{targetFeedbacks.length} feedbacks</Text>
        <Feedbacks feedbacks={currentItems} />
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

export default PaginatedFeedbacks;
