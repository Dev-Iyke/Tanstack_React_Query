import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { PostResponseHttpData } from "../utils/types"

const fetchInfTodos = async ({pageParam}: {pageParam: any}) => {
  const response = await axios.get(`http://localhost:4000/inf_todos/?_limit=5&_page=${pageParam}`)
  return response.data as PostResponseHttpData[]
}
const InfiniteQueries = () => {
  const {data, isLoading, isError, error, hasNextPage, fetchNextPage} = useInfiniteQuery({
    queryKey: ['inf_todos'],
    queryFn: fetchInfTodos,
    initialPageParam: 1,
    getNextPageParam: (_lastPage, allPages) => {
      if (allPages.length < 12) {
        return allPages.length + 1
      } else {
        return undefined
      }
    },
  })

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (isError) {
    return <div>Error: {error.message}</div>
  }

  console.log(data)

  return (
    <div className="container">
      {data?.pages?.map(page => {
        return page.map(todo => {
          return (
            <div key={todo.id} className="fruit-item">
              <h2>{todo.title}</h2>
            </div>
          )
        })
      })}

      {hasNextPage && (
        <button onClick={() => fetchNextPage()}>Load More</button>
      )}
    </div>
  )
}

export default InfiniteQueries