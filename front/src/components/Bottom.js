import styled from "styled-components";
import { Link } from "react-router-dom"

export default function Bottom(){
    return (
        <TopBox>
            <LinkBox>
                <Link to='/sign-in' style={{textDecoration: 'none'}}>
                    Login
                </Link>
            </LinkBox>
            <LinkBox>
                <Link to='/create-post' style={{textDecoration: 'none'}}>
                    Create Post
                </Link>
            </LinkBox>
            <LinkBox>
                <Link to='/sign-up' style={{textDecoration: 'none'}}>
                    Sign Up
                </Link>
            </LinkBox>
        </TopBox>
    )
}


const TopBox = styled.div`
    display: flex;
    position: absolute;
    bottom: 0;
    justify-content: space-between;
    height: 50px;
    width: 100%;
    margin-left: 20px;
    margin-right: 20px;
`
const LinkBox = styled.div`
    display: flex;
    width: 120px;
    height: 40px;
    font-family: 'Courier New', Courier, monospace;
    font-size: 14px;
`