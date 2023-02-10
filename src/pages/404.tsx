import { useRouter } from "next/router";
import { useEffect } from "react";

export default function Other() {
  const router = useRouter();

  useEffect(() => {
    router.push("https://42progress.vercel.app/"), [];
  }, []);

  return <></>;
}
