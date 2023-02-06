import { Layout } from "@/components/Layout";
import { Center, Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import Head from "next/head";
import { cursusProjects } from "../../../utils/objects";
import {
  axiosRetryInSSG,
  fetchAccessToken,
  fetchAllDataByAxios,
} from "utils/functions";
import { useState } from "react";
import ReactPaginate from "react-paginate";

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

const fetchProjectReviews = async (projectId: string, accessToken: string) => {
  const url = `${API_URL}/v2/projects/${projectId}/scale_teams?filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`;
  const response = await fetchAllDataByAxios(url, accessToken);

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
  // 引数のバリデーション
  if (!context.params) return { notFound: true };

  const projectId = context.params.id as string;
  if (!cursusProjects.find((project) => project.slug === projectId)) {
    return { notFound: true };
  }

  // データの取得
  try {
    axiosRetryInSSG();

    const token = await fetchAccessToken();
    const projectReviews = await fetchProjectReviews(
      projectId,
      token.access_token
    );

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
  );
};

const REVIEWS_PER_PAGE = 50;

const PaginatedFeedbackComments = (props: Props) => {
  const { projectReviews } = props;

  const [itemOffset, setItemOffset] = useState(0);
  const endOffset = itemOffset + REVIEWS_PER_PAGE;
  console.log(`Loading items from ${itemOffset} to ${endOffset}`);
  const currentItems = projectReviews.slice(itemOffset, endOffset);
  const pageCount = Math.ceil(projectReviews.length / REVIEWS_PER_PAGE);

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
