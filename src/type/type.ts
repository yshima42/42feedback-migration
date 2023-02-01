export type Feedbacks = {
  id: number;
  scale_id: number;
  comment: string;
  created_at: string;
  updated_at: string;
  feedback: string;
  final_mark: number;
  flag: {
    id: number;
    name: string;
    positive: boolean;
    icon: string;
    created_at: string;
    updated_at: string;
  };
  begin_at: string;
  correcteds: [
    {
      id: number;
      login: string;
      url: string;
    }
  ];
  corrector: {
    id: number;
    login: string;
    url: string;
  };
  truant: {};
  filled_at: string;
  questions_with_answers: [];
  scale: {
    id: number;
    evaluation_id: number;
    name: string;
    is_primary: boolean;
    comment: string;
    introduction_md: string;
    disclaimer_md: string;
    guidelines_md: string;
    created_at: string;
    correction_number: number;
    duration: number;
    manual_subscription: boolean;
    languages: [
      {
        id: number;
        name: string;
        identifier: string;
        created_at: string;
        updated_at: string;
      }
    ];
    flags: [
      {
        id: number;
        name: string;
        positive: boolean;
        icon: string;
        created_at: string;
        updated_at: string;
      }
    ];
    free: boolean;
  };
  team: {
    id: number;
    name: string;
    url: string;
    final_mark: number;
    project_id: number;
    created_at: string;
    updated_at: string;
    status: string;
    terminating_at: null;
    users: [
      {
        id: number;
        login: string;
        url: string;
        leader: boolean;
        occurrence: number;
        validated: boolean;
        projects_user_id: number;
      }
    ];
    "locked?": boolean;
    "validated?": boolean;
    "closed?": boolean;
    repo_url: string;
    repo_uuid: string;
    locked_at: string;
    closed_at: string;
    project_session_id: number;
    project_gitlab_path: string;
  };
  feedbacks: [
    {
      id: number;
      user: {
        login: string;
        id: number;
        url: string;
      };
      feedbackable_type: string;
      feedbackable_id: number;
      comment: string;
      rating: number;
      created_at: string;
    }
  ];
};
