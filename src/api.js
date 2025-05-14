import axios from "axios";

//User calls

const api = axios.create({
  baseURL: `https://artouch.onrender.com/api`,
});

const getUserByUsername = (username) => {
  return api.get(`/users/${username}`).then(({ data }) => {
    return data;
  });
};

const signIn = (userInfo) => {
  return api.post(`/users/signin`, userInfo).then(({ data }) => {
    return data;
  });
};

const signUp = (userInfo) => {
  return api.post(`/users/signup`, userInfo).then((data) => {
    return data;
  });
};

//Museum API calls

//Rijksmuseum

//Cleveland Museum

// Exporting functions

export { getUserByUsername, signIn, signUp };
