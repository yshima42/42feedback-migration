import { Avatar, Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import Link from "next/link";
import { ProjectFeedback } from "types/projectFeedback";

export const FeedbackCard = (props: { projectFeedback: ProjectFeedback }) => {
  const { projectFeedback } = props;

  return (
    <>
      <HStack>
        <Avatar src={projectFeedback.corrector.image} />
        <Text fontSize="md">Evaluated by</Text>
        <Link
          href={`https://profile.intra.42.fr/users/${projectFeedback.corrector.login}`}
        >
          {projectFeedback.corrector.login}
        </Link>
        <Box alignItems="right" justifyContent={"center"}>
          {projectFeedback.final_mark >= 100 ? (
            <Text color="green.500">{projectFeedback.final_mark}%</Text>
          ) : (
            <Text color="tomato">{projectFeedback.final_mark}%</Text>
          )}
        </Box>
      </HStack>
      <Box
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
        whiteSpace="pre-wrap"
      >
        {projectFeedback.comment}
      </Box>
    </>
  );
};
