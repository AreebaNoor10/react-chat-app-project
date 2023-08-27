import React, { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import { useNavigate } from "react-router-dom";
import loader from "../assets/loader.gif";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { setAvatarRoute } from "../utils/APIRoutes";
import { Buffer } from "buffer";
const SetAvatar = () => {
    const api = 'http://api.multiavatar.com/45678945'
    const navigate = useNavigate();
    const [avatars, setAvatars] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedAvatar, setSelectedAvatar] = useState(undefined);
    const toastOptions = {
        position: "bottom-right",
        autoClose: 8000,
        pauseOnHover: true,
        draggable: true,
        theme: "dark",
    };
    useEffect(() => {
        if (!localStorage.getItem('chat-app-user')) {
          navigate("/login");
        }
    }, []);
    const setProfilePicture = async () => { 
        if(selectedAvatar === undefined){
            toast.error("Please Select an Avatar",toastOptions)
        }
        else{
            const user = await JSON.parse(localStorage.getItem("chat-app-user"));
            const {data} = await axios.post(`${setAvatarRoute}/${user.id}`,{
                image: avatars[selectedAvatar]
            });
            if(data.isSet){
               user.is_avatar_image_set = true;
               user.avatar_image = data.image;
               localStorage.setItem("chat-app-user",JSON.stringify(user));
               navigate('/')
            }
            else{
               toast.error("Error Setting Avatar, Please Try Again", toastOptions) 
            }
        }
    };
    useEffect(() => {
        const fetchData = async () => {
            const data = [];
            for (let i = 0; i < 4; i++) {
                try {
                    const image = await axios.get(`${api}/${Math.round(Math.random() * 1000)}`, { responseType: 'arraybuffer' });
                    const buffer = Buffer.from(image.data, 'binary');
                    data.push(buffer.toString('base64'));
                } catch (error) {
                    console.error("Error fetching image:", error);
                }
            }
            setAvatars(data);
            setLoading(false);
        };
    
        fetchData();
    }, []);
    
    return (
        <>
        {
            loading ? <Container>
                <img src={loader} alt="loader" className="loader" />
            </Container> : ( 
               <Container>
               <div className="title">
                   <h1>Pick an Avatar as your profile picture </h1>
               </div>
               <div className="avatars">
                   {
                       avatars.map((avatar, index) => {
                           return (
                               <div key={index} className={`avatar ${selectedAvatar === index ? "selected" : ""}`}>
                                   <img src={`data:image/svg+xml;base64,${avatar}`} alt="avatar" onClick={()=>setSelectedAvatar(index)}/>
                               </div>
                           )
                       })
                   }
               </div>
               <button className="submit-btn" onClick={setProfilePicture}>Set as Profile Picture</button>
           </Container>
    )}
            <ToastContainer />
        </>
    )
}

export default SetAvatar

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 3rem;
  background-color: #131324;
  height: 100vh;
  width: 100vw;

  .loader {
    max-inline-size: 100%;
  }

  .title{
    h1 {
      color: white;
    }
  }
  .avatars {
    display: flex;
    gap: 2rem;

    .avatar {
      border: 0.4rem solid transparent;
      padding: 0.4rem;
      border-radius: 5rem;
      display: flex;
      justify-content: center;
      align-items: center;
      transition: 0.5s ease-in-out;
      img {
        height: 6rem;
        transition: 0.5s ease-in-out;
      }
    }
    .selected {
      border: 0.4rem solid #4e0eff;
    }
  }
  .submit-btn {
    background-color: #4e0eff;
    color: white;
    padding: 1rem 2rem;
    border: none;
    font-weight: bold;
    cursor: pointer;
    border-radius: 0.4rem;
    font-size: 1rem;
    text-transform: uppercase;
    &:hover {
      background-color: #4e0eff;
    }
  }
`;
