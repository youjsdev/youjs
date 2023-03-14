export type Info = {
  analytics: string;
  author: string;
  contact: string;
  description: string;
  domain: string;
  id: string;
  image: string;
  name: string;
  property: string;
  theme: {
    name: string;
    scheme: string;
  };
  uptime_id: string;
  url: string;
  version: string;
  password: {
    enabled: boolean;
    password: string;
  };
};

export type Navbar = {
  copyright: {
    owner: string;
    year: string;
  };
  links: {
    active: boolean;
    link: string;
    name: string;
  }[];
  logo: string;
  name: string;
  socials: {
    icon: string;
    url: string;
  }[];
};

export type Component = {
  __typename: string;
  id: string;
  index: number;
  fields: {
    [key: string]: any;
  };
  [key: string]: any;
};

export type Page = {
  content: {
    [id: string]: Component;
  };
  description: string;
  image: string;
  keywords: string;
  name: string;
  slug: string;
};

export type ProjectData = {
  info: Info;
  navbar: Navbar;
  pages: {
    [slug: string]: Page;
  };
};
