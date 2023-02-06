import { Avatar, Box, Heading, HStack, Text, VStack } from "@chakra-ui/react";
import { ProjectReview } from "types/projectReview";

export const FeedbackCard = (props: { projectReview: ProjectReview }) => {
  const { projectReview } = props;

  return (
    <>
      <HStack>
        <Avatar src={projectReview.corrector.image} />
        <VStack>
          <Text fontSize="md">
            {projectReview.corrector.login}: {projectReview.final_mark}
          </Text>
        </VStack>
      </HStack>
      <Box
        bg="gray.100"
        p={4}
        borderRadius="md"
        boxShadow="md"
        whiteSpace="pre-wrap"
        marginLeft={{ base: "0", md: "12" }}
        marginBottom="2"
      >
        {projectReview.comment}
      </Box>
    </>
  );
};
