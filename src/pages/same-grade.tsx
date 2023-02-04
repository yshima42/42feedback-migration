import { Layout } from "@/components/Layout";
import { UserCountBarChartByLevel } from "@/features/same-grade/components/UserCountBarChartByLevel";
import { Box, Heading } from "@chakra-ui/react";
import { GetStaticProps } from "next";
import { CursusUser } from "next-auth/providers/42-school";
import {
  API_URL,
  CAMPUS_ID_PARIS,
  CAMPUS_ID_SEOUL,
  CAMPUS_ID_TOKYO,
  CURSUS_ID,
} from "utils/constants";
import {
  axiosRetryInSSG,
  fetchAccessToken,
  fetchAllDataByAxios,
} from "utils/functions";

type Props = {
  data?: BarChartInfo[];
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
  const headersList = {
    Authorization: "Bearer " + accessToken,
  };
  const reqOptions = {
    url: `${API_URL}/v2/cursus/${CURSUS_ID}/cursus_users?filter[campus_id]=${campusId}&filter[begin_at]=${beginAt}`,
    method: "GET",
    headers: headersList,
  };
  const cursusUsers: CursusUser[] = await fetchAllDataByAxios(reqOptions);

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
  axiosRetryInSSG();

  try {
    const token = await fetchAccessToken();

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
    console.log(error);
    throw new Error("getStaticProps error");
  }
};

const SameGrade = ({ data }: Props) => {
  if (!data) {
    return <p>{"Error"}</p>;
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
