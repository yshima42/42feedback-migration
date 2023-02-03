import { Layout } from "@/components/Layout";
import { UserCountBarChartByLevel } from "@/features/same-grade/components/UserCountBarChartByLevel";
import { Box, Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { getToken, JWT } from "next-auth/jwt";
import { CursusUser } from "next-auth/providers/42-school";
import { Token } from "types/token";
import {
  API_URL,
  CAMPUS_ID_PARIS,
  CAMPUS_ID_SEOUL,
  CAMPUS_ID_TOKYO,
  CURSUS_ID,
} from "utils/constants";
import { fetchAccessToken, fetchAllDataByFetchAPI } from "utils/functions";

type Props = {
  data?: BarChartInfo[];
  statusText?: string;
};

type UsersInfo = {
  campusId: number;
  beginAt: string;
  userCount?: number;
  userCountByLevel?: number[];
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

const fetchCursusUsersByCampusIdAndBeginAt = async (
  campusId: number,
  beginAt: string,
  accessToken: string
) => {
  const cursusUsers = await fetchAllDataByFetchAPI(
    `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[campus_id]=${campusId}&filter[begin_at]=${beginAt}`,
    {
      headers: { Authorization: "Bearer " + accessToken },
    }
  );
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

export const getStaticProps: GetStaticProps = async () => {
  try {
    let token: Token;
    try {
      token = await fetchAccessToken();
    } catch (error) {
      const errorMessage = "アクセストークンの取得に失敗しました";
      console.log(errorMessage);
      return {
        props: {
          error: errorMessage,
        },
      };
    }

    for (const value of barChartInfo) {
      const users = await fetchCursusUsersByCampusIdAndBeginAt(
        value.usersInfo.campusId,
        value.usersInfo.beginAt,
        token.access_token
      );
      value.usersInfo.userCount = users.length;
      value.usersInfo.userCountByLevel = countUserByLevel(users);
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
          <Box key={value.usersInfo.campusId}>
            <p>
              {value.displayInfo.xAxisLabel +
                " / " +
                value.usersInfo.userCount +
                " students"}
            </p>
            <UserCountBarChartByLevel
              userCountByLevel={value.usersInfo.userCountByLevel ?? []}
              xAxisLabel={value.displayInfo.xAxisLabel}
              barColor={value.displayInfo.barColor}
            />
          </Box>
        );
      })}
    </Layout>
  );
};

export default SameGrade;
