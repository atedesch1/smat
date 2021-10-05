import SearchBar from "../../components/SearchBar"
import styled from 'styled-components'
import { useState } from "react";
import Bottom from '../../components/Bottom'

export default function Home() {
  const [searchQuery, setSearchQuery] = useState('')
  const [postsMatched, setPostsMatched] = useState([])
    return (
      <HomeBox>
        <SearchBar setPostsMatched={setPostsMatched} postsMatched={postsMatched} searchQuery={searchQuery} setSearchQuery={setSearchQuery}/>
        <Bottom/>
      </HomeBox>
    );
  }

const HomeBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100%;
  width: 100%;
`