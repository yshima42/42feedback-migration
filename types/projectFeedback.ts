export type ProjectFeedback = {
  id: number;
  corrector: {
    login: string;
    image: string;
  };
  final_mark: number;
  comment: string;
};
