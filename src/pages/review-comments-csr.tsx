import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";
import axios from "axios";
import Head from "next/head";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const PROJECT_ID = 1331;

type ProjectReview = {
  id: number;
  corrector: {
    login: string;
  };
  final_mark: number;
  comment: string;
};

const fetchProjectReviews = async (accessToken: string) => {
  const headersList = {
    Authorization: "Bearer " + accessToken,
  };

  const reqOptions = {
    url: `${API_URL}/v2/projects/${PROJECT_ID}/scale_teams?page[size]=100&page[number]=1&filter[cursus_id]=${CURSUS_ID}&filter[campus_id]=${CAMPUS_ID}`,
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
  console.log(session?.accessToken);
  const [projectReviews, setProjectReviews] = useState<ProjectReview[]>([]);

  useEffect(() => {
    async function fetchData() {
      const res = await fetchProjectReviews(session?.accessToken ?? "");
      setProjectReviews(res);
    }
    fetchData();
  }, []);

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

export default ReviewCommentsCSR;
