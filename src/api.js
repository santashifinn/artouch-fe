import axios from "axios";

//User calls

const api = axios.create({
  baseURL: `https://artouch.onrender.com/api`,
});

const getUserByUsername = (username) => {
  return api.get(`/users/${username}`).then(({ data }) => {
    console.log(data);
    return data;
  });
};

//Museum API calls

//Rijksmuseum

//Cleveland Museum

// Exporting functions

export {
  getUserByUsername
};