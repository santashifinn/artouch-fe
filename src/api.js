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

const rijksApi = axios.create({
  baseURL: "https://www.rijksmuseum.nl/api/en/collection",
});

const rijksApiKey = import.meta.env.VITE_RIJKS_API_KEY;

const getRijks = (type, q, p, ps) => {
  if (p === undefined) {
    p = 0;
  }


  return rijksApi
    .get("", {
      params: {
        imgonly: true,
        type: type,
        q: q,
        p: p,
        ps: ps || 5,
        key: rijksApiKey,
      },
    })
    .then(({ data }) => {
      return data;
    });
};

//Cleveland Museum

const clevelandApi = axios.create({
  baseURL: "https://openaccess-api.clevelandart.org/api/artworks/",
});

const getCleveland = (type, q, p, limit) => {
  let adjustedType = !type
    ? type
    : type.split("")[0].toUpperCase() + type.slice(1);
  if (adjustedType === "Furniture") {
    adjustedType = "Furniture and woodwork";
  } else if (adjustedType === "Jewellery") {
    adjustedType = "Jewelry";
  } else if (adjustedType === "Clothing") {
    adjustedType = "Garment";
  }
  if (p === undefined) {
    p = 0;
  }

  let offset = p * 5;
  
  return clevelandApi
    .get("", {
      params: {
        has_image: 1,
        type: adjustedType,
        q: q,
        limit: limit || 5,
        skip: offset,
      },
    })
    .then(({ data }) => {
      return data;
    });
};

// Exporting

export { getUserByUsername, signIn, signUp, getRijks, getCleveland };
