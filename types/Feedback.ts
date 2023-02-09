export type Feedback = {
  id: number;
  slug: string;
  updated_at: string;
  corrector: {
    login: string;
    image: string;
  };
  comment: string;
  projects_user_id: number;
};

export enum SortType {
  UpdateAtAsc = "UpdateAtAsc",
  UpdateAtDesc = "UpdateAtDesc",
  CommentLengthASC = "CommentLengthASC",
  CommentLengthDesc = "CommentLengthDesc",
  None = "None",
}
