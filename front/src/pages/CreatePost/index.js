import PostForm from "../../components/PostForm"
import UserContext from "../../contexts/UserContext";
import { useContext } from "react";
import BottomCreatePost from "../../components/BottomCreatePost";
import styled from "styled-components";

export default function CreatePost() {
    const { userData, setUserData } = useContext(UserContext);
    return (
      <CreatePostBox>
        <PostForm isNewPost={true} token={userData.token}/>
        <BottomCreatePost/>
      </CreatePostBox>
    );
  }

const CreatePostBox = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  width: 100%;
`