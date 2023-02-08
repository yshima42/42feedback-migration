import { Avatar, Box, Flex, Spacer, Text } from "@chakra-ui/react";
import { ExternalLinkIcon } from "@chakra-ui/icons";
import Link from "next/link";
import { ProjectFeedback } from "types/projectFeedback";
import { useEffect, useState } from "react";

export const FeedbackCard = (props: { projectFeedback: ProjectFeedback }) => {
  const { projectFeedback } = props;
  const [year, setYear] = useState<number>(0);
  const [month, setMonth] = useState<number>(0);
  const [day, setDay] = useState<number>(0);

  useEffect(() => {
    const date = new Date(projectFeedback.updated_at);
    setYear(date.getFullYear());
    setMonth(date.getMonth() + 1);
    setDay(date.getDate());
  }, [projectFeedback]);

  return (
    <>
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
            <Text px="2" fontSize="sm">
              {year}-{month}-{day}
            </Text>
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
    </>
  );
};
