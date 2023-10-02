export type IPsType = {
  _id: string;
  title: string;
  description: string;
  avatar: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  officialLink: string;
  unions: string[];
  adaptations: string[];
  createdAt: string;
};

export type IPType = {
  _id: string;
  title: string;
  description: string;
  agreement: string;
  avatar: string;
  cover: string;
  author: {
    _id: string;
    username: string;
    avatar: string;
  };
  officialLink: string;
  images: string[];
  inclinedUnions: string[];
  unions: string[];
  adaptations: string[];
  createdAt: string;
};
