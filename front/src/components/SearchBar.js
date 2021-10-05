import { Fragment, useState } from 'react'
import axios from 'axios'

const SearchBar = () => {
  const [searchQuery, setSearchQuery] = useState('')
  const [postsMatched, setPostsMatched] = useState('')

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
      setPostsMatched(JSON.stringify(res.data))
    } catch (err) {
      console.error(err)
    }
  }

  return (
    <Fragment>
      <input type="text" placeholder="Search" onChange={postSearch} />
      <p>{postsMatched}</p>
    </Fragment>
  )
}

export default SearchBar
