import { Inter } from "@next/font/google";
import { Layout } from "@/components/Layout";
import Link from "next/link";
import { Heading } from "@chakra-ui/react";

const inter = Inter({ subsets: ["latin"] });

// export default function Home() {
const Home = () => {
  return (
    <Layout>
      <Heading>42 Progress</Heading>
      <Link href="/same-grade">same grade progress(名前ダサいから変える)</Link>
      <br />
      <Link href="/feedbacks">feedbacks</Link>
    </Layout>
  );
};

export default Home;
