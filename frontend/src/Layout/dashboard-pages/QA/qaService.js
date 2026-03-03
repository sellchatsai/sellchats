import axios from "axios";

const API = "http://localhost:4000/api/qa";

/* CREATE */
export const createQA = async (payload) => {
  try {
    const res = await axios.post(API, payload);
    return res.data;
  } catch (err) {
    console.error("Create QA Error:", err);
    throw err;
  }
};

/* GET ALL BY USER */
export const getUserQAs = async (userId) => {
  try {
    const res = await axios.get(`${API}/all/${userId}`);
    return res.data;
  } catch (err) {
    console.error("Get User QAs Error:", err);
    throw err;
  }
};

/* GET SINGLE */
export const getQAById = async (id) => {
  try {
    const res = await axios.get(`${API}/${id}`);
    return res.data; 
  } catch (err) {
    console.error("Get QA By ID Error:", err);
    throw err;
  }
};

/* UPDATE */
export const updateQA = async (id, payload) => {
  try {
    const res = await axios.put(`${API}/${id}`, payload);
    return res.data;
  } catch (err) {
    console.error("Update QA Error:", err);
    throw err;
  }
};

/* DELETE */
export const deleteQA = async (id) => {
  try {
    const res = await axios.delete(`${API}/${id}`);
    return res.data;
  } catch (err) {
    console.error("Delete QA Error:", err);
    throw err;
  }
};