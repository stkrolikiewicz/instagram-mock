interface Post {
  id?: number,
  name?: string,
  created_at?: string,
  url?: string,
  caption?: string,
  owner_id?: number
}

interface User {
  id?: number,
  email?: string,
  username?: string,
  posts?: number,
  followers?: number,
  following?: number,
}

interface Credentials {
  email: string,
  password: string,
  username?: string
}

export type { Post, User, Credentials }