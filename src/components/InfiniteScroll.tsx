import { useInfiniteQuery } from "@tanstack/react-query"
import axios from "axios"
import { PostResponseHttpData } from "../utils/types"
import { useInView } from "react-intersection-observer";
import { useEffect } from "react";

const fetchInfTodos = async ({pageParam}: {pageParam: any}) => {
  const response = await axios.get(`http://localhost:4000/inf_todos/?_limit=5&_page=${pageParam}`)
  return response.data as PostResponseHttpData[]
}
const InfiniteScroll = () => {
  const { ref, inView } = useInView({
    /* Optional options */
    threshold: 0,
  });
  const {data, isLoading, isError, error, isFetchingNextPage, fetchNextPage} = useInfiniteQuery({
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

  useEffect(() => {
    if (inView) {
      fetchNextPage()
    }
  }, [fetchNextPage, inView])

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

      <div ref={ref}>{isFetchingNextPage && 'Loading...'}</div>

    </div>
  )
}

export default InfiniteScroll