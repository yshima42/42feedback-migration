import { Avatar, Box, Flex, HStack, Text, VStack } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { ProjectFeedback } from "types/projectFeedback";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

export const FeedbackCard = (props: { projectFeedback: ProjectFeedback }) => {
  const { projectFeedback } = props;
  // const router = useRouter();
  // const query = router.query;
  // const [slug, setSlug] = useState<string>("");

  // useEffect(() => {
  //   if (router.isReady) {
  //     setSlug(query.id as string);
  //   }
  // }, [query, router.isReady]);

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
        <Flex justifyContent="right">
          <Link
            href={`https://projects.intra.42.fr/projects/ft_transcendence/projects_users/${projectFeedback.team.users.projects_user_id}`}
          >
            <HStack>
              <Text fontSize="md">intra</Text>
              <ExternalLinkIcon boxSize={3} />
            </HStack>
          </Link>
        </Flex>
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
