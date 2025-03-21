import { useEffect, useState } from "react"
import { PostResponseHttpData } from "../utils/types"
import axios from "axios"

const PostTraditional = () => {
  const [posts, setPosts] = useState<PostResponseHttpData[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [isError, setIsError] = useState(false)

  const fetchPost = async () => {
    try {
      const response = await axios.get('http://localhost:4000/posts')
      console.log(response)
      setPosts(response.data)
    } catch (error) {
      setIsError(true)
    } finally{
      setIsLoading(false)
      // setIsError(error)
    }
  }

  useEffect(() => {
    setIsLoading(true)
    fetchPost()
  }, [])

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (posts.length === 0) {
    return <p>No posts found</p>
  }

  if (isError) {
    return <p>Error fetching data</p>
  }
  return (
    <div>
      <h1>Post Traditional</h1>
      <p>This is the traditional way of fetching</p>

      <div>
        {posts.map(post => (
          <div className="post-item" key={post.id}>
            <h2 className="post-title">{post.title}</h2>
            <p className="post-body">{post.body}</p>
          </div>
        ))}
      </div>
    </div>
  )
}

export default PostTraditional