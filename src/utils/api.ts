import { createPostData } from "./types"

export const getUsers = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/users')
  return res.json()
}

export const getPosts = async () => {
  const res = await fetch('https://jsonplaceholder.typicode.com/postss')
  if (res.ok) return res.json()
  return Promise.reject(res.status)
}

export const createPost = async (post: createPostData) => {
  const res = await fetch('https://jsonplaceholder.typicode.com/posts', {
    method: 'POST',
    body: JSON.stringify({
      userId: post.userId,
      title: post.title,
      body: post.body,
    }),
    headers: {
      'Content-Type': 'application/json; charset=UTF-8', 
    },
  })
  return res.json()
}