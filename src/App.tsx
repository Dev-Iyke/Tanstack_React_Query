import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query"
import { createPost, getPosts, getUsers } from "./utils/api"
import { PostResponseHttpData, userResponseHttpData } from "./utils/types"
import { useEffect, useState } from "react"

function App() {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const userId = 5478

  const queryClient = useQueryClient()

  const {data: usersData, error: usersError, isLoading: isUsersLoading} = useQuery<userResponseHttpData[]>({
    queryKey: ['getUsers'],
    queryFn: getUsers //Calls the getUsers function to fetch data
  })

  const {data: postsData, error: postsError, isLoading: isPostsLoading, refetch: refetchGetPosts} = useQuery<PostResponseHttpData[]>({
    queryKey: ['getPosts'],
    queryFn: getPosts //Calls the getPosts function to fetch data
  })

  const {mutate: createPostMutation, isSuccess: isCreatePostSuccess, isPending: isCreatePostPending} = useMutation({
    mutationKey: ['createPost'],
    mutationFn: createPost,
    onSuccess: () => {
      console.log('Post created successfully')
      queryClient.invalidateQueries({queryKey: ['getPosts']})
      //If I might need to update users too
      queryClient.invalidateQueries({queryKey: ['getUsers']})
      setTitle('')
      setBody('')
    }
  })

  useEffect(() => {
    if (isCreatePostSuccess && !isCreatePostPending){
      console.log('Refetching posts')
      // refetchGetPosts()
      // queryClient.invalidateQueries({queryKey: ['getPosts']})
      // //If I might need to update users too
      // queryClient.invalidateQueries({queryKey: ['getUsers']})
    }
  }, [isCreatePostSuccess, refetchGetPosts, isCreatePostPending, queryClient])

  console.log(usersData)
  console.log(postsError)

  if(!isUsersLoading && usersError) return <p>Error fetching users...</p>

  return (
    <div>
      {/* {(!isUsersLoading && usersData) && (
        <div>
          {usersData.map(user => (
            <div key={user.id}>
              <h2>{user.name}</h2>
              <p>{user.email}</p>
            </div>
          ))}
        </div>
      ) }
      <hr /> */}
      
      <div>
        <form onSubmit={(e) => {
          e.preventDefault()
          createPostMutation({userId,title, body})
        }}>
          <h2>New Post</h2>
          <label htmlFor="title">Post title</label>
          <input type="text" name="title" value={title} onChange={(e) => setTitle(e.target.value)} /> <br />
          <label htmlFor="body">Post body</label>
          <input type="text" name="body" value={body} onChange={(e) => setBody(e.target.value)} /> <br />
          <button>Create</button>
        </form>
      </div>

      {(!isPostsLoading && postsData) && (
        <div>
          {postsData.map(post => (
            <div key={post.id}>
              <h3>{post.title}</h3>
              <p>{post.body}</p>
            </div>
          ))}
        </div>
      ) }
      <hr />
    </div>
  )
}

export default App
