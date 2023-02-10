import { Select } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import { SortType } from "types/Feedback";

type Props = {
  setSortType: Dispatch<SetStateAction<SortType>>;
};

export const FeedbackSortSelect = ({ setSortType }: Props) => {
  return (
    <Select
      width={200}
      marginLeft={0.5}
      textAlign={"center"}
      backgroundColor={"gray.100"}
      placeholder={"⇅ Sort"}
      onChange={(event) => setSortType(event.target.value as SortType)}
    >
      <option value={SortType.UpdateAtDesc}>Date(Desc)</option>
      <option value={SortType.UpdateAtAsc}>Date(Asc)</option>
      <option value={SortType.CommentLengthDesc}>Length(Desc)</option>
      <option value={SortType.CommentLengthASC}>Length(Asc)</option>
    </Select>
  );
};
