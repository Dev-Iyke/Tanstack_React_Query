import Home from "./components/Home"
import './App.css'
import PostReactQuery from "./components/PostReactQuery"
import PostTraditional from "./components/PostTraditional"
import { BrowserRouter, Route, Link, Routes } from "react-router-dom"
import PostDetails from "./components/PostDetails"
import PaginatedQueries from "./components/PaginatedQueries"
import InfiniteQueries from "./components/InfiniteQueries"
import InfiniteScroll from "./components/InfiniteScroll"
function App() {

  return (
    <BrowserRouter>
      <div>
        <nav>
          <ul>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/posts">Traditional Posts</Link>
            </li>
            <li>
              <Link to="/rq-posts">React Query Posts</Link>
            </li>
            <li>
              <Link to="/paginated-todos">React Paginated Todos</Link>
            </li>
            <li>
              <Link to="/inf_todos">React Infinite Todos</Link>
            </li>
            <li>
              <Link to="/inf_scr_todos">React Infinite Scroll Todos</Link>
            </li>
          </ul>
        </nav>

        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/posts" element={<PostTraditional />} />
          <Route path="/rq-posts" element={<PostReactQuery />} />
          <Route path="/paginated-todos" element={<PaginatedQueries />} />
          <Route path="/inf_todos" element={<InfiniteQueries />} />
          <Route path="/inf_scr_todos" element={<InfiniteScroll />} />
          <Route path="/rq-posts/:postId" element={<PostDetails />} />
        </Routes>
      </div>
    </BrowserRouter>
  )
}

export default App
