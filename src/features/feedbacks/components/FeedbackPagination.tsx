import { Center } from "@chakra-ui/react";
import { Dispatch, SetStateAction } from "react";
import ReactPaginate from "react-paginate";
import { FEEDBACKS_PER_PAGE } from "utils/constants";

type Props = {
  feedbackCount: number;
  targetFeedbackCount: number;
  itemOffset: number;
  setItemOffset: Dispatch<SetStateAction<number>>;
};

export const FeedbackPagination = ({
  feedbackCount,
  targetFeedbackCount,
  itemOffset,
  setItemOffset,
}: Props) => {
  const pageCount = Math.ceil(targetFeedbackCount / FEEDBACKS_PER_PAGE);
  const isPaginationDisabled = pageCount <= 1;

  const handlePageChange = (event: { selected: number }) => {
    const newOffset = (event.selected * FEEDBACKS_PER_PAGE) % feedbackCount;
    setItemOffset(newOffset);
  };

  return (
    <Center>
      {isPaginationDisabled ? (
        <></>
      ) : (
        <ReactPaginate
          breakLabel="..."
          nextLabel=">"
          onPageChange={handlePageChange}
          forcePage={itemOffset / FEEDBACKS_PER_PAGE}
          pageRangeDisplayed={2}
          pageCount={pageCount}
          previousLabel="<"
          pageClassName="page-item"
          pageLinkClassName="page-link"
          previousClassName="page-item"
          previousLinkClassName="page-link"
          nextClassName="page-item"
          nextLinkClassName="page-link"
          breakClassName="page-item"
          breakLinkClassName="page-link"
          containerClassName="pagination"
          activeClassName="active"
        />
      )}
    </Center>
  );
};
