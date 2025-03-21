import { keepPreviousData, useQuery } from "@tanstack/react-query"
import axios from "axios"
import { PostResponseHttpData } from "../utils/types"
import { useState } from "react"

const fetchTodos = async (pageId: number | string) => {
    const response = await axios.get(`http://localhost:4000/todos?_limit=5&_page=${pageId}`)
    return response.data as PostResponseHttpData[]
}
const PaginatedQueries = () => {
  const [page, setPage] = useState(1)
  console.log(page)
  //useQuery returns a response
  const {data, isLoading, isError, error, isFetching} = useQuery({
    queryKey: ['todos', page],
    queryFn: () => fetchTodos(page),
    //To ensure loading is not shown when the new items are fetching. It keeps the previous data there
    placeholderData: keepPreviousData
  })

  console.log(isLoading, isFetching)

  if (isLoading) {
    return <p>Loading...</p>
  }

  if (error) {
    return <p>{error.message}</p>
  }
  if (isError) {
    return <p>Error fetching data</p>
  }


  console.log(data)

  return (
    <div>
      <h1>React Query Fetching</h1>
      <p>This is an improved way</p>
      {/* {!data && <button onClick={() => refetch()}>Fetch Todos</button>} */}
      {/* {error && <p>{error}</p>} */}
        <div className="post-list">
          {data?.map((todo) => (
            <div className="post-item" key={todo.id}>
              <h2 className="post-title">{todo.title}</h2>
            </div>
          ))}
        </div>

        {/* Pagination */}
        <div className="">
          <button onClick={() => setPage(prevPage => prevPage - 1)} disabled={page === 1}>
            Previous
          </button>
          <span>Page {page}</span>
          <button onClick={() => setPage(prevPage => prevPage + 1)} disabled={page === 4}>Next</button>
        </div>
    </div>
  )
}

export default PaginatedQueries