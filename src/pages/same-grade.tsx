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
  console.log("Debugging...");

  useEffect(() => {
    setIsLoading(false);
    fetch(ftUrl, {
      headers: {
        Authorization: `Bearer ${session?.accessToken}`,
        mode: "cors",
      },
    })
      .then((res) => {
        if (!res.ok) {
          console.log("Error: ", res.status);
        } else {
          console.log("OK: ", res.status);
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
