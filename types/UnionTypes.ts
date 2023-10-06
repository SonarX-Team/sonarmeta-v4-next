export type UnionsType = {
  _id: string;
  title: string;
  avatar: string;
  cover: string;
  creator: string;
  inclinedMembers: {
    _id: string;
    username: string;
    avatar: string;
  }[];
  members: string[];
  signedIPs: string[];
  adaptations: string[];
  createdAt: string;
};

export type BasicUnionsType = {
  _id: string;
  title: string;
  avatar: string;
};

export type UnionType = {
  _id: string;
  title: string;
  description: string;
  recruitment: string;
  avatar: string;
  cover: string;
  creator: {
    _id: string;
    username: string;
    avatar: string;
  };
  inclinedMembers: string[];
  members: {
    _id: string;
    username: string;
    avatar: string;
    bio: string;
  }[];
  signedIPs: string[];
  adaptations: string[];
  createdAt: string;
};
