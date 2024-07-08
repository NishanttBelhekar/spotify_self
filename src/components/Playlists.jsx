import React, { useEffect } from "react";
import { useStateProvider } from "../utils/StateProvider";
import axios from "axios";
import { reducerCases } from "../utils/Contants";
import styled from "styled-components";

export default function Playlists() {
  const [{ token, playlists }, dispatch] = useStateProvider();

  useEffect(() => {
    const getPlaylistData = async () => {
      try {
        const response = await axios.get(
          "https://api.spotify.com/v1/me/playlists",
          {
            headers: {
              Authorization: "Bearer " + token,
              "Content-Type": "application/json",
            },
          }
        );
        const { items } = response.data;
        const playlists = items.map(({ name, id }) => ({
          name,
          id,
        }));
        dispatch({ type: reducerCases.SET_PLAYLISTS, playlists });
      } catch (error) {
        if (error.response) {
          // The request was made and the server responded with a status code
          if (error.response.status === 401) {
            console.error(
              "Access token expired or invalid. Refreshing token..."
            );
            // Implement token refreshing logic here
            // Example: dispatch an action to refresh token and retry the request
          } else {
            console.error(
              "Request failed with status code:",
              error.response.status
            );
            console.error(error.response.data);
          }
        } else if (error.request) {
          // The request was made but no response was received
          console.error(
            "Request made but no response received:",
            error.request
          );
        } else {
          // Something happened in setting up the request that triggered an Error
          console.error("Error setting up the request:", error.message);
        }
      }
    };

    if (token) {
      getPlaylistData();
    }
  }, [token, dispatch]);

  return (
    <Container>
      <h2>Playlists</h2>
      <ul>
        {playlists.map(({ name, id }) => (
          <li key={id}>{name}</li>
        ))}
        
      </ul>
    </Container>
  );
}

const Container = styled.div`
  height: 100%;
  overflow: hidden;
  ul {
    list-style-type: none;
    display: flex;
    flex-direction: column;
    gap: 1rem;
    padding: 1rem;
    height: 52vh;
    max-height: 100%;
    overflow: auto;
    &::-webkit-scrollbar {
      width: 0.7rem;
      &-thumb {
        background-color: rgba(255,255,255,0.6);
      }
    } 
    li {
      display: flex;
      gap: 1rem;
      cursor: pointer;
      transition: 0.3s ease-in-out;
      &:hover {
        color: white;
      }
    }
  }
`;