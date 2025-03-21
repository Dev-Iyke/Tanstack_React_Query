import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query"
import axios from "axios"
import { createPostData, PostResponseHttpData } from "../utils/types"
import { Link } from "react-router-dom"
import { useState } from "react"


//GET POSTS
const fetchPosts = async() => {
  const response = await axios.get('http://localhost:4000/posts')
  return response.data as PostResponseHttpData[]
}

//POST NEW POST
const addPosts = async(post: createPostData) => {
  const response = await axios.post('http://localhost:4000/posts', post)
  return response.data as PostResponseHttpData[]
}

const PostReactQuery = () => {
  const [title, setTitle] = useState('')
  const [body, setBody] = useState('')
  const queryClient = useQueryClient()
  //useQuery returns a response
  const {data, isLoading, isError, error, isFetching, refetch} = useQuery({
    //Every single query should have its own unique queryKey
    queryKey: ['posts'],
    //Then the callback function that always returns a promise
    //so we can use the fetching logic here
    queryFn: () => fetchPosts(),
     //TODO: REFETCHING - Data fetched remains fresh for 30secs(while cached) then it will be fetched again on render of this component.
    //  staleTime: 30000,
     //TODO: POLLING - If data is stale, then refetch the data automatically every second
    //  refetchInterval: 1000,
     //TODO: BACKGROUND POLLING - Polling continues even if he user leaves the tab
    //  refetchIntervalInBackground: true,
    //TODO: Disable automatic refetching on component mount. So we have to do this with an event or on click
    // enabled: false,
  })

  const {mutate: addPostMutation, isError: isMutationError} = useMutation({
    mutationFn: addPosts,
    // onSuccess: (newData) => {
    //   //Updating the cache with new data and displaying it. New new gwt requests made
    //   queryClient.setQueryData(['posts'], (oldQueryData: PostResponseHttpData[] | undefined) => {
    //     if (!oldQueryData) return [newData]
    //     //Updating only the data property in the cache
    //     return [...oldQueryData, newData] 
    //   } )

    //   //Updating the data by invalidating the previous data and fetching again
    //   // queryClient.invalidateQueries("posts" as any)

    //   //optimistic Mutation: Assuming nothing can go wrong during mutation
    // },

    //Called before the mutate function is even fired
    onMutate: async (newPost) => {
      await queryClient.cancelQueries(['posts'] as any);
      //Get the previous post data
      const previousData = queryClient.getQueryData(['posts']) as PostResponseHttpData[] | undefined
      if (!previousData) return newPost
      
      //Prepare the new data array with the new post
      // const updatedData = [...previousData, newPost]
      
      // //Return the new data array and the previous data array
      // return {
      //   updatedData,
      //   previousData,
      // }

      queryClient.setQueryData(['posts'], (oldQueryData: PostResponseHttpData[] | undefined) => {
        if (!oldQueryData) return [newPost]
        //Updating only the data property in the cache
        return [...oldQueryData, {...newPost, id: String(oldQueryData.length + 1)}] 
      })

      return {
        previousData,
      }
    },

    //Called before the mutate function is even fired
    onError: (_error, _post, context) => {
      if(context) {
        queryClient.setQueryData(['posts'], context)
      }
    },

    //Called when the mutation is successful or an error occurs. so all it does it fetch the data
    onSettled: () => {
      queryClient.invalidateQueries(['posts'] as any)
    },
  })

  // const {mutate: updatePostMutation} = useMutation({
  //   mutationFn: addPosts
  // })

  console.log(isLoading, isFetching)

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

  if (isMutationError) {
    return <p>Error Mutating data</p>
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newPost = {title, body}
    console.log(newPost)
    addPostMutation(newPost)
    setTitle('')
    setBody('')
  }


  console.log(data)

  return (
    <div>
      <h1>React Query Fetching</h1>
      <p>This is an improved way</p>
      

      <form onSubmit={(e) => handleSubmit(e)}>
        <input type="text" placeholder="Enter Title" value={title} onChange={(e) => setTitle(e.target.value)} />
        <input type="text" placeholder="Enter Body" value={body} onChange={(e) => setBody(e.target.value)} />
        <button type="submit">Submit</button>
      </form>
      {/* {error && <p>{error}</p>} */}

        <div className="post-list">
          {data?.map((post) => (
          <Link key={post.id} to={`/rq-posts/${post.id}`}>
            <div className="post-item">
              <h2 className="post-title">{post.title}</h2>
              <p className="post-body">{post.body}</p>
            </div>
          </Link>
          ))}

          {isMutationError && <p>Error Mutating data</p>}
        </div>

        <button onClick={() => refetch()}>Fetch Posts</button>
    </div>
  )
}

export default PostReactQuery