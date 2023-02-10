import { FeedbackCard } from "@/features/feedbacks/components/FeedbackCard";
import { Box } from "@chakra-ui/react";
import { Feedback } from "types/Feedback";

type Props = {
  feedbacks: Feedback[];
};

export const FeedbackList = ({ feedbacks }: Props) => {
  return (
    <>
      {feedbacks.map((projectFeedback: Feedback) => (
        <Box key={projectFeedback.id} mb={8}>
          <FeedbackCard feedback={projectFeedback} />
        </Box>
      ))}
    </>
  );
};
