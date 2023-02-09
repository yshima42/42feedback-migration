import { Layout } from "@/components/Layout";
import { GetStaticProps } from "next";
import { SITE_NAME, FEEDBACKS_PER_PAGE } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../utils/objects";
import { axiosRetryInSSG, fetchScaleTeams } from "utils/functions";
import { useEffect, useState } from "react";
import { CursusUser } from "types/cursusUsers";
import { CompareFunc, Feedback, SortType } from "types/Feedback";
import cursusUsers from "utils/preval/cursus-users.preval";
import token from "utils/preval/access-token.preval";
import { ScaleTeam } from "types/scaleTeam";
import escapeStringRegexp from "escape-string-regexp";
import { FeedbackList } from "@/features/feedbacks/components/FeedbackList";
import { FeedbackPagination } from "@/features/feedbacks/components/FeedbackPagination";
import { FeedbackFilters } from "@/features/feedbacks/components/FeedbackFilters";

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

const Feedbacks = ({ feedbacks, projectName }: Props) => {
  const [searchWord, setSearchWord] = useState("");
  const [targetFeedbacks, setTargetFeedbacks] = useState(feedbacks);
  const [sortType, setSortType] = useState(SortType.UpdateAtDesc);
  const [itemOffset, setItemOffset] = useState(0);
  const currentItems = targetFeedbacks.slice(
    itemOffset,
    itemOffset + FEEDBACKS_PER_PAGE
  );

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
    // 更新後、ページを先頭に戻す
    setItemOffset(0);
  }, [sortType, searchWord, feedbacks]);

  return (
    <>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
        <title>
          {projectName} - {SITE_NAME}
        </title>
      </Head>
      <Layout pageTitle={projectName}>
        <FeedbackFilters
          setSearchWord={setSearchWord}
          setSortType={setSortType}
          feedbackCount={targetFeedbacks.length}
        />
        <FeedbackList feedbacks={currentItems} />
        <FeedbackPagination
          feedbackCount={feedbacks.length}
          targetFeedbackCount={targetFeedbacks.length}
          itemOffset={itemOffset}
          setItemOffset={setItemOffset}
        />
      </Layout>
    </>
  );
};

export default Feedbacks;
