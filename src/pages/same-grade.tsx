import { Layout } from "@/components/Layout";
import { UserCountBarChartByLevel } from "@/features/same-grade/components/UserCountBarChartByLevel";
import { Heading } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { CursusUser } from "next-auth/providers/42-school";
import { API_URL, CAMPUS_ID, CURSUS_ID } from "utils/constants";

type Props = {
  data?: CursusUser[];
  statusText?: string;
};

// ログインユーザーの入学日を取得
const getLoginUserAdmissionDate = async (token: JWT) => {
  const userId = token?.sub;
  const res = await fetch(
    `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[user_id]=${userId}`,
    {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const loginUser: CursusUser[] = await res.json();
  return loginUser[0].begin_at;
};

// ログインユーザーと同じ日に入学したユーザーを取得
const getSameGradeUsers = async (token: JWT) => {
  const loginUserAdmissionDate = await getLoginUserAdmissionDate(token);
  const res = await fetch(
    `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[campus_id]=${CAMPUS_ID}&filter[begin_at]=${loginUserAdmissionDate}&page[size]=100`,
    {
      headers: {
        Authorization: "Bearer " + token?.accessToken,
      },
    }
  );
  if (!res.ok) {
    throw new Error(res.statusText);
  }
  const sameGradeUsers: CursusUser[] = await res.json();
  return sameGradeUsers;
};

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const token = await getToken({ req: context.req });
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

const countUserByLevel = (users: CursusUser[]) => {
  const userCountByLevel: number[] = [];
  users.forEach((user) => {
    if (userCountByLevel[Math.floor(user.level)]) {
      userCountByLevel[Math.floor(user.level)]++;
    } else {
      userCountByLevel[Math.floor(user.level)] = 1;
    }
  });
  return userCountByLevel;
};

const SameGrade = ({ data, statusText }: Props) => {
  if (statusText || !data) {
    return <p>{statusText ?? "Empty Data"}</p>;
  }
  const userCountByLevel = countUserByLevel(data);
  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <UserCountBarChartByLevel userCountByLevel={userCountByLevel} />
    </Layout>
  );
};

export default SameGrade;
