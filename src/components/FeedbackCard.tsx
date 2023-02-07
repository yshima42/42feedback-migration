import { Avatar, Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { ProjectReview } from "types/projectReview";

export const FeedbackCard = (props: { projectReview: ProjectReview }) => {
  const { projectReview } = props;

  return (
    <>
      <HStack>
        <Avatar src={projectReview.corrector.image} />
        <Text fontSize="md">Evaluated by</Text>
        <Link
          href={`https://profile.intra.42.fr/users/${projectReview.corrector.login}`}
        >
          {projectReview.corrector.login}
        </Link>
        <Text>{projectReview.final_mark}</Text>
      </HStack>
      <Box
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
        whiteSpace="pre-wrap"
      >
        {projectReview.comment}
      </Box>
    </>
  );
};
