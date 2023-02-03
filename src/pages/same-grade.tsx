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
  data?: BarChartInfo[];
  statusText?: string;
};

type UsersInfo = {
  campusId: number;
  beginAt: string;
  users?: CursusUser[];
  userCountByLebel?: number[];
};

type DisplayInfo = {
  xAxisLabel: string;
  barColor: string;
};

type BarChartInfo = {
  usersInfo: UsersInfo;
  displayInfo: DisplayInfo;
};

const barChartInfo: BarChartInfo[] = [
  {
    usersInfo: {
      campusId: CAMPUS_ID_TOKYO,
      beginAt: "2021-07-06T04:00:00.000Z",
    },
    displayInfo: {
      xAxisLabel: "42Tokyo 2021-07-06",
      barColor: "#FF6384",
    },
  },
  {
    usersInfo: {
      campusId: CAMPUS_ID_SEOUL,
      beginAt: "2021-05-03T00:42:00.000Z",
    },
    displayInfo: {
      xAxisLabel: "42Seoul 2021-05-03",
      barColor: "#36A2EB",
    },
  },
  {
    usersInfo: {
      campusId: CAMPUS_ID_PARIS,
      beginAt: "2021-05-20T07:42:00.000Z",
    },
    displayInfo: {
      xAxisLabel: "42Paris 2021-05-20",
      barColor: "#FFCE56",
    },
  },
];

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
  const cursusUsers: CursusUser[] = await res.json();
  return cursusUsers;
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

export const getServerSideProps: GetServerSideProps = async (
  context: GetServerSidePropsContext
) => {
  try {
    const token = await getToken({ req: context.req });
    if (!token) {
      throw new Error("No token found");
    }

    for (const value of barChartInfo) {
      value.usersInfo.users = await fetchCursusUsersByCumpusIdAndBeginAt(
        value.usersInfo.campusId,
        value.usersInfo.beginAt,
        token.accessToken
      );
      value.usersInfo.userCountByLebel = countUserByLevel(
        value.usersInfo.users
      );
    }

    return { props: { data: barChartInfo } };
  } catch (error) {
    console.error("Could not fetch data from 42 API\n", error);
    const statusText = error instanceof Error ? error.message : "Unknown error";
    return { props: { statusText } };
  }
};

const SameGrade = ({ data, statusText }: Props) => {
  if (!data || statusText) {
    return <p>{statusText ?? "Empty Data"}</p>;
  }

  return (
    <Layout>
      <Heading>Same Grade</Heading>
      {data.map((value: BarChartInfo) => {
        return (
          <UserCountBarChartByLevel
            key={value.usersInfo.campusId}
            userCountByLevel={value.usersInfo.userCountByLebel ?? []}
            xAxisLabel={value.displayInfo.xAxisLabel}
            barColor={value.displayInfo.barColor}
          />
        );
      })}
    </Layout>
  );
};

export default SameGrade;
