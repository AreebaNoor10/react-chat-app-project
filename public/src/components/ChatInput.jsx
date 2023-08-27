import React, { useState } from "react";
import { BsEmojiSmileFill } from "react-icons/bs";
import { IoMdSend } from "react-icons/io";
import styled from "styled-components";
import Picker from "emoji-picker-react";

export default function ChatInput({ handleSendMsg }) {
  const [msg, setMsg] = useState("");
  const [showEmojiPicker, setShowEmojiPicker] = useState(false);
  const handleEmojiPickerhideShow = () => {
    setShowEmojiPicker(!showEmojiPicker);
  };

  const handleEmojiClick = (event) => {
    let message = msg;
    message += event.emoji;
    setMsg(message);
  };

  const sendChat = (event) => {
    event.preventDefault();
    if (msg.length > 0) {
      handleSendMsg(msg);
      setMsg("");
    }
  };

  return (
    <Container>
      <div className="button-container">
        <div className="emoji">
          <BsEmojiSmileFill onClick={handleEmojiPickerhideShow} />
        </div>
      </div>
      <form className="input-container" onSubmit={(event) => sendChat(event)}>
        <input
          type="text"
          placeholder="type your message here"
          onChange={(e) => setMsg(e.target.value)}
          value={msg}
        />
        <button type="submit">
          <IoMdSend />
        </button>
      </form>
      {showEmojiPicker && (
        <EmojiPickerContainer>
          <Picker onEmojiClick={handleEmojiClick} />
        </EmojiPickerContainer>
      )}
    </Container>
  );
}

const Container = styled.div`
  display: grid;
  align-items: center;
  grid-template-columns: 5% 95%;
  background-color: #080420;
  padding: 0 2rem;
  @media screen and (min-width: 720px) and (max-width: 1080px) {
    padding: 0 1rem;
    gap: 1rem;
  }
  .button-container {
    display: flex;
    align-items: center;
    color: white;
    gap: 1rem;
    .emoji {
      position: relative;
      svg {
        font-size: 1.5rem;
        color: #ffff00c8;
        cursor: pointer;
      }
    }
  }
  .input-container {
    position: relative;
    width: 100%;
    border-radius: 2rem;
    display: flex;
    align-items: center;
    gap: 2rem;
    background-color: #ffffff34;
    input {
      width: 90%;
      height: 60%;
      background-color: transparent;
      color: white;
      border: none;
      padding-left: 1rem;
      font-size: 1.2rem;
      &::selection {
        background-color: #9a86f3;
      }
      &:focus {
        outline: none;
      }
    }
    button {
      padding: 0.3rem 2rem;
      border-radius: 2rem;
      display: flex;
      justify-content: center;
      align-items: center;
      background-color: #9a86f3;
      border: none;
      @media screen and (min-width: 720px) and (max-width: 1080px) {
        padding: 0.3rem 1rem;
        svg {
          font-size: 1rem;
        }
      }
      svg {
        font-size: 2rem;
        color: white;
      }
    }
  }
  @media screen and (max-width: 720px) {
    grid-template-columns: 10% 80% 10%; /* Adjust grid columns for smaller screens */
    padding: 0.5rem; /* Adjust padding for smaller screens */
    gap: 0.5rem; /* Adjust gap between elements for smaller screens */
    .button-container {
      .emoji {
        svg {
          font-size: 1.2rem; /* Adjust emoji icon size for smaller screens */
        }
      }
    }
    .input-container {
      gap: 1rem; /* Adjust gap between input elements for smaller screens */
      input {
        font-size: 1rem; /* Adjust font size for input text on smaller screens */
      }
      button {
        padding: 0.2rem 1.5rem; /* Adjust padding for send button on smaller screens */
        svg {
          font-size: 1.5rem; /* Adjust send icon size for smaller screens */
        }
      }
    }
  }

`;

const EmojiPickerContainer = styled.div`
  position: absolute;
  bottom: 20%;
  left: 40%;
  transform: translateX(-50%);
  background-color: #080420;
  box-shadow: 0 5px 10px #9a86f3;
  border-color: #9a86f3;
  z-index: 2;
  @media screen and (max-width: 720px) {
    bottom: 15%; /* Adjust position of emoji picker for smaller screens */
    left: 50%;
    transform: translateX(-50%);
  }
`;
