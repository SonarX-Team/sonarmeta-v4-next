export type ipDaosType = {
  address: `0x${string}`;
  title: string;
  description: string;
  avatar: string;
  cover: string;
  owner: string; // 这里还是_id
  subscribers: string[]; // 这里还是_id
  members: string[]; // 这里还是_id
  createdAt: string;
};

export type inclinedIpDaosType = {
  address: `0x${string}`;
  title: string;
  avatar: string;
  inclinedMembers: { address: `0x${string}`; username: string; avatar: string }[];
};

export type BasicIpDaosType = {
  address: `0x${string}`;
  title: string;
  avatar: string;
};

export type ipDaoType = {
  address: `0x${string}`;
  title: string;
  description: string;
  recruitment: string;
  avatar: string;
  cover: string;
  externalLink: string;
  images: string[];
  owner: {
    address: `0x${string}`;
    username: string;
    avatar: string;
  };
  subscribers: string[]; // 这里还是_id
  inclinedMembers: string[]; // 这里还是_id
  members: {
    address: `0x${string}`;
    username: string;
    avatar: string;
    bio: string;
  }[];
  createdAt: string;
};
