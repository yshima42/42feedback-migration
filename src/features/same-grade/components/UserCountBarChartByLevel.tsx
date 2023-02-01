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
  userCountByLevel: number[];
};

export const UserCountBarChartByLevel = ({ userCountByLevel }: Props) => {
  const data = userCountByLevel.map((count: number, index) => {
    return {
      level: `${index}`,
      "Number of students": count,
    };
  });

  return (
    <BarChart
      width={500}
      height={300}
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
      <Bar dataKey="Number of students" fill="#82ca9d" />
    </BarChart>
  );
};
