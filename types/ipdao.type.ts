export type ipDaosType = {
  address: `0x${string}`;
  title: string;
  avatar: string;
  owner: string; // 这里还是_id
  inclinedMembers: {
    address: `0x${string}`;
    username: string;
    avatar: string;
  }[];
  members: string[]; // 这里还是_id
  createdAt: string;
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
  owner: {
    address: `0x${string}`;
    username: string;
    avatar: string;
  };
  inclinedMembers: string[];
  members: {
    address: `0x${string}`;
    username: string;
    avatar: string;
    bio: string;
  }[];
  createdAt: string;
};