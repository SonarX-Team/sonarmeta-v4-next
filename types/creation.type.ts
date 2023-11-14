export type creationsType = {
  title: string;
  description: string;
  tokenId: number;
  avatar: string;
  externalLink: string;
  createdAt: string;
};

export type inclinedComponentsType = {
  tokenId: number;
  title: string;
  avatar: string;
  inclinedComponents: { tokenId: number; title: string; avatar: string }[];
};

export type creationType = {
  _id: string;
  title: string;
  description: string;
  tokenId: number;
  agreement: string;
  avatar: string;
  externalLink: string;
  createdAt: string;
};

export type creationMetadataType = {
  name: string;
  description: string;
  image: string;
  external_link: string;
};
