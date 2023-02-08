export type ProjectFeedback = {
  id: number;
  slug: string;
  corrector: {
    login: string;
    image: string;
  };
  comment: string;
  projects_user_id: number;
};
