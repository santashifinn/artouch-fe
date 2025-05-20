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

const getFavesbyUsername = (username) => {
  return api.get(`/users/${username}/faves`).then(({ data }) => {
    return data.faves;
  });
};

const deleteCollection = (username, collection) => {
  return api.delete(`/users/${username}/${collection}`);
};

const addFave = (username, collection, work_id) => {
  return api
    .post(`/users/${username}/${collection}/${work_id}`)
    .then(({ data }) => {
      return data;
    });
};

const deleteFave = (username, collection, work_id) => {
  return api.delete(`/users/${username}/${collection}/${work_id}`);
};

//Museum API calls

//Rijksmuseum

const rijksApi = axios.create({
  baseURL: "https://www.rijksmuseum.nl/api/en/collection",
});

const rijksApiKey = import.meta.env.VITE_RIJKS_API_KEY;

const getRijks = (type, q, p, ps) => {
  if (p === undefined || p === null) {
    p = 0;
  }

  let returnLimit = ps || 5;

  return rijksApi
    .get("", {
      params: {
        imgonly: true,
        type: type,
        q: q,
        p: p,
        ps: returnLimit,
        key: rijksApiKey,
      },
    })
    .then(({ data }) => {
      return data;
    });
};

const getPersonalRijks = (faveId) => {
  return rijksApi
    .get(`/${faveId}`, {
      params: {
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

const getCleveland = (type, q, p, limit, totalRijksWorks) => {
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

  if (p === undefined || p === null) {
    p = 0;
  }

  let offset = 0;
  let returnLimit = limit || 5;

  if (p === 0) {
    offset = 0;
  } else if (totalRijksWorks) {
    offset = (p - 1) * returnLimit - totalRijksWorks;
  } else {
    offset = (p - 1) * returnLimit;
  }

  return clevelandApi
    .get("", {
      params: {
        has_image: 1,
        type: adjustedType,
        q: q,
        limit: returnLimit,
        skip: offset,
      },
    })
    .then(({ data }) => {
      return data;
    });
};

const getPersonalCleveland = (faveId) => {
  return clevelandApi
    .get("", {
      params: { accession_number: faveId, has_image: 1 },
    })
    .then(({ data }) => {
      return data.data[0];
    });
};

// Exporting

export {
  getUserByUsername,
  signIn,
  signUp,
  getFavesbyUsername,
  deleteCollection,
  addFave,
  deleteFave,
  getRijks,
  getPersonalRijks,
  getCleveland,
  getPersonalCleveland,
};
