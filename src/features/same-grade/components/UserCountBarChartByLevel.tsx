import React from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  Label,
} from "recharts";

type Props = {
  userCountByLevel: number[][];
};

enum Campus {
  Tokyo,
  Seoul,
  Paris,
}

export const UserCountBarChartByLevel = ({ userCountByLevel }: Props) => {
  const loopCount = Math.max(
    userCountByLevel[Campus.Tokyo].length,
    userCountByLevel[Campus.Seoul].length,
    userCountByLevel[Campus.Paris].length
  );
  const data: any = [];
  for (let i = 0; i < loopCount; i++) {
    data.push({
      level: `${i}`,
      "42Tokyo 2021-07-06": userCountByLevel[Campus.Tokyo][i],
      "42Seoul 2021-05-03": userCountByLevel[Campus.Seoul][i],
      "42Paris 2021-05-20": userCountByLevel[Campus.Paris][i],
    });
  }
  // const data = .map((count: number, index) => {
  //   return {
  //     level: `${index}`,
  //     "42tokyo 07-06": count,
  //   };
  // });

  return (
    <BarChart
      width={1000}
      height={600}
      data={data}
      margin={{
        top: 5,
        right: 30,
        left: 20,
        bottom: 5,
      }}
    >
      <CartesianGrid strokeDasharray="3 3" />
      <XAxis dataKey="level">
        <Label value="Level" offset={0} position="insideBottom" />
      </XAxis>
      <YAxis>
        <Label
          value="Number of students"
          offset={0}
          angle={-90}
          position="center"
        />
      </YAxis>
      <Tooltip />
      <Legend />
      <Bar dataKey="42Tokyo 2021-07-06" fill="#FF6384" />
      <Bar dataKey="42Seoul 2021-05-03" fill="#36A2EB" />
      <Bar dataKey="42Paris 2021-05-20" fill="#FFCE56" />
    </BarChart>
  );
};
