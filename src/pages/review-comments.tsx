import { Layout } from "@/components/Layout";
import { Heading } from "@chakra-ui/react";
import { getToken } from "next-auth/jwt";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { Feedbacks } from "@/type/type";
import Link from "next/link";

const PROJECT_ID = 1331;
const CURSUS_ID = 21;
const CAMPUS_ID = 26;

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  const token = await getToken({ req: context.req });
  let data = [];

  if (token) {
    const res = await fetch(
      `https://api.intra.42.fr/v2/projects/${PROJECT_ID}/scale_teams?
      &page[size]=100
      &page[number]=1
      &filter[cursus_id]=${CURSUS_ID}
      &filter[campus_id]=${CAMPUS_ID}`,
      {
        headers: {
          Authorization: "Bearer " + token?.accessToken,
        },
      }
    );
    data = await res.json();
  } else {
    console.log("no token");
  }

  return {
    props: {
      data,
    },
  };
};

type Props = {
  data: Feedbacks[];
};

const ReviewComments = (props: Props) => {
  const { data } = props;

  return (
    <Layout>
      <Heading>review-comments</Heading>
      <div>
        {data.map((value: Feedbacks) => (
          <div key={value["id"]}>
            reviewer:{" "}
            <Link
              href={`https://profile.intra.42.fr/users/${value["corrector"]["login"]}`}
            >
              {value["corrector"]["login"]}
            </Link>
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

export default ReviewComments;
