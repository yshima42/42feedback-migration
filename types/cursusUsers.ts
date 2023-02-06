// thunder client の Generate Types で生成
// "next-auth/providers/42-school" の CursorUserに不足しているプロパティがあったので定義した

export type CursusUser = {
  grade: null | string;
  level: number;
  skills: any[];
  blackholed_at: Date | null;
  id: number;
  begin_at: Date;
  end_at: Date | null;
  cursus_id: number;
  has_coalition: boolean;
  created_at: Date;
  updated_at: Date;
  user: User;
  cursus: Cursus;
};

export type Cursus = {
  id: number;
  created_at: Date;
  name: Name;
  slug: Slug;
  kind: CursusKind;
};

export enum CursusKind {
  Main = "main",
  Piscine = "piscine",
}

export enum Name {
  CPiscine = "C Piscine",
  The42Cursus = "42cursus",
}

export enum Slug {
  CPiscine = "c-piscine",
  The42Cursus = "42cursus",
}

export type User = {
  id: number;
  email: string;
  login: string;
  first_name: string;
  last_name: string;
  usual_full_name: string;
  usual_first_name: null;
  url: string;
  phone: Phone;
  displayname: string;
  kind: UserKind;
  image: Image;
  "staff?": boolean;
  correction_point: number;
  pool_month: PoolMonth;
  pool_year: string;
  location: null;
  wallet: number;
  anonymize_date: Date;
  data_erasure_date: Date;
  created_at: Date;
  updated_at: Date;
  alumnized_at: null;
  "alumni?": boolean;
  "active?": boolean;
};

export type Image = {
  link: null | string;
  versions: Versions;
};

export type Versions = {
  large: null | string;
  medium: null | string;
  small: null | string;
  micro: null | string;
};

export enum UserKind {
  Student = "student",
}

export enum Phone {
  Hidden = "hidden",
}

export enum PoolMonth {
  December = "december",
  February = "february",
}
