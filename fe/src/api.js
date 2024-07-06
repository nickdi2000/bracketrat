/* eslint-disable */

import Axios from "axios";
import router from "./routes";

var baseURL = import.meta.env.VITE_API_URL; // || 'http://localhost:3000/v1/';
console.log("BaseURL: ", baseURL);

const axios = Axios.create({
  baseURL: baseURL,
});

axios.interceptors.request.use((request) => {
  const api_token = localStorage.getItem("token");
  if (api_token) {
    request.headers.Authorization = "Bearer " + api_token;
  }

  return request;
});

axios.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.log("API ERROR", error.response?.status);
    //if (error.response.status === 401 || error?.response?.status > 499) {
    if (error.response?.status === 401) {
      const _store = authStore();
      _store.destroy();
      router.push("/login");
    }

    if (error.response?.status === 404) {
      //router.push({ query: {} });
    }
    throw error;
    return error.response;
  }
);

const backendAPI = {
  getApiToken: async function (email, password) {
    const response = await axios.post("auth/token", {
      email: email,
      password: password,
    });

    return response.data;
  },

  // Universal REST functions

  get: async function (resource) {
    const response = await axios.get(resource);
    return response.data;
  },
  getPlayers: async function (bracketId) {
    const response = await axios.get("bracket/" + bracketId + "/players");
    return response.data;
  },
  show: async function (resource, id) {
    if (!id) {
      return {};
    }
    const response = await axios.get(resource + "/" + id);
    return response.data;
  },
  post: async function (resource, data = {}) {
    const response = await axios.post(resource, data);
    return response.data;
  },

  postPdf: async function (resource, documentId) {
    //const str = JSON.stringify(data);
    const response = await axios.post(
      resource,
      {
        documentId: documentId,
      },
      { responseType: "blob" }
    );
    return response.data;
  },
  put: async function (resource, data) {
    const response = await axios.put(resource, data);
    return response.data;
  },
  delete: async function (resource) {
    const response = await axios.delete(resource);
    return response.data;
  },
  patch: async function (resource, data) {
    const response = await axios.patch(resource, data);
    return response.data;
  },
  test: async function () {
    const response = await axios.get("test");
    return response.data;
  },

  register: async function (data) {
    const base_url =
      import.meta.env.VITE_API_URL || "http://localhost:3000/v1/";
    const response = await Axios.post(base_url + "auth/register", data);
    return response.data;
  },

  login: async function (data) {
    const base_url =
      import.meta.env.VITE_API_URL || "http://localhost:3000/v1/";
    const response = await Axios.post(base_url + "auth/login", data);
    return response.data;
  },

  uploadFile: async function (file) {
    let formData = new FormData();
    let url = import.meta.env.VITE_API_URL || "http://localhost:3000/v1/";
    formData.append("file", file);

    console.log(file instanceof File);
    console.log(file instanceof Blob);

    try {
      const response = await axios.post(`${url}datapoint/file`, formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      console.log(response);
      return response;
    } catch (err) {
      console.error(err);
      return err;
    }
  },
};

export default backendAPI;
