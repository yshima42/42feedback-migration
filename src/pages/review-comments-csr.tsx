import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import axios from "axios";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { Pagination } from "@/components/Pagination";
import { useRouter } from "next/router";

const PROJECT_ID = 1331;

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

const fetchProjectReviews = async (accessToken: string, page: number) => {
  const headersList = {
    Authorization: "Bearer " + accessToken,
  };

  const reqOptions = {
    url: `${API_URL}/v2/projects/${PROJECT_ID}/scale_teams?page[size]=100&page[number]=${page}&filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`,
    method: "GET",
    headers: headersList,
  };

  // // TODO: 要確認、ここでエラーハンドリングするとでブロイでバグる
  const response = await axios.request(reqOptions);

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

const ReviewCommentsCSR = () => {
  const { data: session } = useSession();
  const [projectReviews, setProjectReviews] = useState<ProjectReview[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);
  const PER_PAGE = 100;
  const router = useRouter();
  const [page, setPage] = useState(1);

  useEffect(() => {
    async function fetchData() {
      // TODO: このエラーハンドリングで良いのか要確認
      if (!session || session.accessToken == undefined) return;
      setPage(Number(router.query.page) || 1);

      setIsLoading(true);
      const res = await fetchProjectReviews(session.accessToken, page);
      setProjectReviews(res);
      setIsLoading(false);
    }
    fetchData();
  }, [router.query.page]);

  return (
    <Layout>
      <Head>
        <meta name="robots" content="noindex,nofollow" />
      </Head>
      <Heading>review-comments</Heading>
      <div>
        {isLoading ? (
          <div>loading...</div>
        ) : (
          <>
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
          </>
        )}
      </div>
      <Pagination totalCount={projectReviews.length} />
    </Layout>
  );
};

export default ReviewCommentsCSR;
