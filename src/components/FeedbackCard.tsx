import { Avatar, Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { ProjectFeedback } from "types/projectFeedback";

export const FeedbackCard = (props: { projectFeedback: ProjectFeedback }) => {
  const { projectFeedback } = props;

  return (
    <Box marginY={2}>
      <Flex>
        <Avatar src={projectFeedback.corrector.image} />
        <Box alignSelf="end">
          <Flex px="2">
            <Text fontSize="md">Evaluated by </Text>
            <Link
              href={`https://profile.intra.42.fr/users/${projectFeedback.corrector.login}`}
              target="_blank"
            >
              <Text px="1" fontSize="md" fontWeight="bold">
                {projectFeedback.corrector.login}
              </Text>
            </Link>
          </Flex>
        </Box>
        <Spacer />
        <Box alignSelf="end">
          <Flex>
            <Link
              href={`https://projects.intra.42.fr/projects/${projectFeedback.slug}/projects_users/${projectFeedback.projects_user_id}`}
              target="_blank"
            >
              {/* <Text fontSize="md">intra</Text> */}
              <ExternalLinkIcon boxSize={3.5} />
            </Link>
          </Flex>
        </Box>
      </Flex>
      <Box
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
        whiteSpace="pre-wrap"
      >
        {projectFeedback.comment}
      </Box>
    </Box>
  );
};
