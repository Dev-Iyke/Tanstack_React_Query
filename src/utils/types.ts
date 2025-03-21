export interface userResponseHttpData {
  id: number;
  name: string;
  username: string;
  email: string;
  website: string;
}

export interface createPostData {
  title: string;
  body: string;
}

export interface PostResponseHttpData extends createPostData{
  id: number;
}