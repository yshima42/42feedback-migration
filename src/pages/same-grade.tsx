import { Layout } from "@/components/Layout";
import { LineChartSample } from "@/components/LineChartSample";
import { Heading } from "@chakra-ui/react";
import { useSession } from "next-auth/react";
import { useEffect, useState } from "react";

const SameGrade = () => {
  const [data, setData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const ftUrl = "https://api.intra.42.fr/v2/users/hyoshie";
  const { data: session } = useSession();
  console.log(session?.accessToken);

  useEffect(() => {
    setIsLoading(false);
    fetch(ftUrl, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        "Access-Control-Allow-Origin":
          "https://42progress-git-dev-yshima42.vercel.app",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Error: ", res.status);
        }
        return res.json();
      })
      .then((json) => {
        setData(json);
      })
      .catch((error) => {
        console.error("Catch Error: ", error);
      });
  }, [session?.accessToken]);

  if (isLoading) {
    return <p>Loading...</p>;
  }
  if (!data) {
    return <p>No data</p>;
  }

  return (
    <Layout>
      <Heading>Same Grade</Heading>
      <LineChartSample />
      <p>{JSON.stringify(data)}</p>
    </Layout>
  );
};

export default SameGrade;
