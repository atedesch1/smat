import PostForm from "../../components/PostForm"
import UserContext from "../../contexts/UserContext";
import { useContext } from "react";

export default function CreatePost() {
    const { userData, setUserData } = useContext(UserContext);

    return (
      <PostForm isNewPost={true} token={userData.token}>
      </PostForm>
    );
  }