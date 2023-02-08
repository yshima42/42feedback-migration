export type ProjectFeedback = {
  id: number;
  slug: string;
  corrector: {
    login: string;
    image: string;
  };
  final_mark: number;
  comment: string;
  projects_user_id: number;
};
