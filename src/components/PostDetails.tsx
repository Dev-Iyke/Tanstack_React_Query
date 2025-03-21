import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { useParams } from "react-router-dom"

const fetchPostDetails = (postId: string) => {
  return axios.get(`http://localhost:4000/posts/${postId}`)
}
const PostDetails = () => {
  const {postId} = useParams()
  const {data, isLoading, isError, error} = useQuery({
    //use dynamic key id individual queries
    queryKey: ['post', postId],
    queryFn: async () => fetchPostDetails(postId!)
  })

  console.log(data?.data)

  if (isLoading) {
    return <p>Loading...</p>
  }

  // if (data.length === 0) {
  //   return <p>No posts found</p>
  // }
  if (error) {
    return <p>{error.message}</p>
  }
  if (isError) {
    return <p>Error fetching data</p>
  }
  
  const {title, body } = data?.data || {}

  return (
    <div className="post-details-container">
      <h3 className="post-details-title">{title}</h3>
      <p className="post-details-body">{body}</p>
      <button onClick={() => window.history.back()}>Back</button>
      <button onClick={() => window.location.href = '/rq-posts'}>View all posts</button>
    </div>
  )
}

export default PostDetails