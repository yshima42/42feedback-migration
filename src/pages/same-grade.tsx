import { Layout } from "@/components/Layout";
import { UserCountBarChartByLevel } from "@/features/same-grade/components/UserCountBarChartByLevel";
import { Heading } from "@chakra-ui/react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { CursusUser } from "next-auth/providers/42-school";
import {
  API_URL,
  CAMPUS_ID_PARIS,
  CAMPUS_ID_SEOUL,
  CAMPUS_ID_TOKYO,
  CURSUS_ID,
} from "utils/constants";

type Props = {
  data?: CursusUser[][];
  statusText?: string;
};

enum AddmissionDate {
  Tokyo = "2021-07-06T04:00:00.000Z",
  Seoul = "2021-05-03T00:42:00.000Z",
  Paris = "2021-05-20T07:42:00.000Z",
}

enum Campus {
  Tokyo,
  Seoul,
  Paris,
}

const fetchCursusUsersByCumpusIdAndBeginAt = async (
  campusId: number,
  beginAt: string,
  accessToken: string
) => {
  const res = await fetch(
    `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[campus_id]=${campusId}&filter[begin_at]=${beginAt}&page[size]=100`,
    {
      headers: {
        Authorization: "Bearer " + accessToken,
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
    const sameGradeUsers: CursusUser[][] = [];

    sameGradeUsers[Campus.Tokyo] = await fetchCursusUsersByCumpusIdAndBeginAt(
      CAMPUS_ID_TOKYO,
      AddmissionDate.Tokyo,
      token.accessToken
    );

    sameGradeUsers[Campus.Seoul] = await fetchCursusUsersByCumpusIdAndBeginAt(
      CAMPUS_ID_SEOUL,
      AddmissionDate.Seoul,
      token.accessToken
    );

    sameGradeUsers[Campus.Paris] = await fetchCursusUsersByCumpusIdAndBeginAt(
      CAMPUS_ID_PARIS,
      AddmissionDate.Paris,
      token.accessToken
    );

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
  const userCountByLevel: number[][] = [];
  userCountByLevel[Campus.Tokyo] = countUserByLevel(data[Campus.Tokyo]);
  userCountByLevel[Campus.Seoul] = countUserByLevel(data[Campus.Seoul]);
  userCountByLevel[Campus.Paris] = countUserByLevel(data[Campus.Paris]);
  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <UserCountBarChartByLevel userCountByLevel={userCountByLevel} />
    </Layout>
  );
};

export default SameGrade;
