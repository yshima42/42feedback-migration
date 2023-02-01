import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { IncomingMessage } from "http";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { getSession } from "next-auth/react";

type Props = {
  data?: any;
  statusText?: string;
};

// ログインユーザーの入学月を取得
const getLoginUserAdmissionMonth = async (token: JWT) => {
  const userId = token?.sub;
  const res = await fetch(
    `https://api.intra.42.fr/v2/cursus/21/cursus_users?filter[user_id]=${userId}`,
    {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return data[0].begin_at;
  // return data[0].begin_at.slice(5, 7);
};

// ログインユーザーの入学月と同じ月のユーザーを取得
const getSameGradeUsers = async (token: JWT) => {
  const loginUserAdmissionMonth = await getLoginUserAdmissionMonth(token ?? {});
  console.log("begin_at:" + loginUserAdmissionMonth);
  const res = await fetch(
    `https://api.intra.42.fr/v2/cursus/21/cursus_users?filter[campus_id]=26&filter[begin_at]=${loginUserAdmissionMonth}&page[size]=100`,
    {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const data = await res.json();
  return data;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const token = await getToken({ req: context.req });
    console.log(token);
    if (!token) {
      throw new Error("No token found");
    }
    const sameGradeUsers = await getSameGradeUsers(token);
    return { props: { data: sameGradeUsers } };
  } catch (error) {
    console.error("Could not fetch data from 42 API\n", error);
    const statusText = error instanceof Error ? error.message : "Unknown error";
    return { props: { statusText } };
  }
};

const SameGrade = ({ data, statusText }: Props) => {
  if (statusText) {
    return <p>{statusText}</p>;
  }
  console.log(data.length);
  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <LineChartSample />
      <p>
        {data?.map((cursusUser: any) => {
          return (
            <div key={cursusUser.id}>
              <p>{cursusUser.user.login}</p>
              <p>{cursusUser.level}</p>
            </div>
          );
        })}
      </p>
    </Layout>
  );
};

export default SameGrade;
