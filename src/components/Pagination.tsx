import { Button, Flex } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";

type Props = {
  totalCount: number;
};

// export const Pagination = (props: Props) => {
//   const { totalCount } = props;
//   const range = (start: number, end: number) => {
//     return [...Array(end - start + 1)].map((_, i) => start + i);
//   };
//   const pageCounts = Math.ceil(totalCount / 100);
//   return (
//     <Flex align="center" justify="space-between" my={10}>
//       {range(1, pageCounts).map((page) => {
//         return (
//           <Link key={page} href={`/review-comments-csr?page=${page}`} passHref>
//             <Button as="a" _hover={{ bg: "gray.500" }}>
//               {page}
//             </Button>
//           </Link>
//         );
//       })}
//     </Flex>
//   );
// };

export const Pagination = (props: Props) => {
  const { totalCount } = props;
  const router = useRouter();
  const { page = 1 } = router.query;
  const PER_PAGE = 100;

  const calcLastPage = (totalCount: number, perPage: number) => {
    return Math.ceil(totalCount / perPage);
  };

  const lastPage = calcLastPage(totalCount, PER_PAGE);

  const createPagePath = (page: number) => {
    return {
      pathname: router.pathname,
      query: { page: page },
    };
  };

  return (
    <Flex align="center" justify="space-between" my={10}>
      <Link href={createPagePath(Number(page) - 1)} passHref>
        <Button
          as="a"
          disabled={page <= 1}
          aria-label="Previous page"
          _hover={{ bg: "gray.500" }}
        >
          前のページ
        </Button>
      </Link>
      <Link href={createPagePath(Number(page) + 1)} passHref>
        <Button
          as="a"
          disabled={page >= lastPage}
          aria-label="Next page"
          _hover={{ bg: "gray.500" }}
        >
          次のページ
        </Button>
      </Link>
    </Flex>
  );
};
