import { Fragment, useState } from 'react'
import axios from 'axios'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [postsMatched, setPostsMatched] = useState([])

  const postSearch = async (e) => {
    e.preventDefault()
    setSearchQuery(e.target.value)
    try {
      const res = await axios('/api/post/search', {
        method: 'POST',
        data: {
          searchQuery: searchQuery,
        },
      })
      setPostsMatched(res.data)
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Fragment>
      <h1>Search Posts</h1>
      <input type="text" placeholder="Search" onChange={postSearch} />
      {postsMatched.map((post) => (
        <div>
          {/* <embed
            src={post.fileURL}
            type="application/pdf"
            height="500px"
            width="500"
          /> */}
          <a href={post.fileURL}>Open file</a>
          <h2>Title: {post.title}</h2>
          <h3>Description: {post.description}</h3>
          <h4>Language: {post.language}</h4>
          <h4>Subject: {post.subject}</h4>
          <h4>Instructor: {post.instructor}</h4>
        </div>
      ))}
    </Fragment>
  )
}

export default SearchBar
