import { Avatar, Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { Feedback } from "types/Feedback";

type Props = {
  feedback: Feedback;
};

export const FeedbackCard = ({ feedback }: Props) => {
  // propsとしてDate型を渡すと、errorになるので、stringとして取ってきている
  const date = new Date(feedback.updated_at);

  return (
    <Box marginY={2}>
      <Flex>
        <Avatar src={feedback.corrector.image} />
        <Box alignSelf="end">
          <Flex px="2" alignItems="end">
            <Flex display={{ base: "none", md: "flex" }}>
              <Text fontSize="md">Evaluated by </Text>
            </Flex>
            <Link
              href={`https://profile.intra.42.fr/users/${feedback.corrector.login}`}
              target="_blank"
            >
              <Text px="1" fontSize="md" fontWeight="bold">
                {feedback.corrector.login}
              </Text>
            </Link>
            <Text fontSize="xs">{date.toDateString()}</Text>
          </Flex>
        </Box>
        <Spacer />
        <Box alignSelf="end">
          <Flex>
            <Link
              href={`https://projects.intra.42.fr/projects/${feedback.slug}/projects_users/${feedback.projects_user_id}`}
              target="_blank"
            >
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
        {feedback.comment}
      </Box>
    </Box>
  );
};
