import styled from 'styled-components'
import Post from './Post'
import axios from 'axios'

export default function PostFeed(){
    const posts = [{data : 1}, {data : 2}, {data : 3}]
    return (
        <PostFeedBox>
            {
                posts.map ((p) =>
                    <Post data={p.data}/>
                )
            }
        </PostFeedBox>
    )
}

const PostFeedBox = styled.div`
    display: flex;
    flex-direction: column;
`