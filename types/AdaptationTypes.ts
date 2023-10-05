export type AdaptationsType = {
  _id: string;
  title: string;
  description: string;
  url: string;
  cover: string;
  createdAt: string;
};

export type AdaptationType = {
  _id: string;
  title: string;
  description: string;
  url: string;
  cover: string;
  union: string;
  relatedIPs: string[];
  createdAt: string;
};
