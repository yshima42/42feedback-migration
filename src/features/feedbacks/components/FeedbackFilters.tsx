import { Flex, Text } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { SortType } from "types/Feedback";
import { FeedbackSearchBox } from "./FeedbackSearchBox";
import { FeedbackSortSelect } from "./FeedbackSortSelect";

type Props = {
  setSearchWord: Dispatch<SetStateAction<string>>;
  setSortType: Dispatch<SetStateAction<SortType>>;
  feedbackCount: number;
};

export const FeedbackFilters = ({
  setSearchWord,
  setSortType,
  feedbackCount,
}: Props) => {
  return (
    <>
      <Flex>
        <FeedbackSearchBox setSearchWord={setSearchWord} />
        <FeedbackSortSelect setSortType={setSortType} />
      </Flex>
      <Text opacity={0.6}>{feedbackCount} feedbacks</Text>
    </>
  );
};
