import axios from "../utils/axios.customize";

const loginFunction = async (payload) => {
  try {
    const res = await axios.post("/authen/login", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const registerFunction = async (payload) => {
  try {
    const res = await axios.post("/authen/signup", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getAuthenUser = async () => {
  try {
    const res = await axios.get("/user/get-authenticated-user");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getReceiptDetails = async (id) => {
  try {
    const res = await axios.get(`/receipt/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const ratingReceipt = async (id, payload) => {
  try {
    const res = await axios.put(`/receipt/${id}/rating`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//===============CHEF API=======================
const getAllMyReceipts = async () => {
  try {
    const res = await axios.get("/receipt/get-my");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const addNewReceipt = async (payload) => {
  try {
    const res = await axios.post("/receipt/add-receipt", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const updateReceipt = async (id, payload) => {
  try {
    const res = await axios.put(`/receipt/${id}/update-receipt`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteReceipt = async (id) => {
  try {
    const res = await axios.delete(`/receipt/${id}/delete-receipt`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllSteps = async () => {
  try {
    const res = await axios.get("/step/get-all");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const addNewStep = async (payload) => {
  try {
    const res = await axios.post("/step/add-step", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const updateStep = async (id, payload) => {
  try {
    const res = await axios.put(`/step/${id}/update-step`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteStep = async (id) => {
  try {
    const res = await axios.delete(`/step/${id}/delete-step`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllMyRestaurants = async () => {
  try {
    const res = await axios.get("/restaurant/get-my");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getRestaurantDetails = async (id) => {
  try {
    const res = await axios.get(`/restaurant/${id}`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const addNewRestaurant = async (payload) => {
  try {
    const res = await axios.post("/restaurant/add-restaurant", payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const updateRestaurant = async (id, payload) => {
  try {
    const res = await axios.put(`/restaurant/${id}/update-restaurant`, payload);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const deleteRestaurant = async (id) => {
  try {
    const res = await axios.delete(`/restaurant/${id}/delete-restaurant`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getAllChefPackages = async () => {
  try {
    const res = await axios.get("/subscription/get-chef");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const getMyPackage = async () => {
  try {
    const res = await axios.get("/subscription/get-my");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

//=====================ADMIN API=======================
const getAllUsers = async () => {
  try {
    const res = await axios.get("/user/get-all");
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

const toggleActive = async (id) => {
  try {
    const res = await axios.put(`/user/${id}/toogle-avtive`);
    return res.data;
  } catch (error) {
    console.log(error);
  }
};

export {
  loginFunction,
  registerFunction,
  getAuthenUser,
  getReceiptDetails,
  ratingReceipt,
  getAllMyReceipts,
  addNewReceipt,
  updateReceipt,
  deleteReceipt,
  getAllSteps,
  addNewStep,
  updateStep,
  deleteStep,
  getAllMyRestaurants,
  getRestaurantDetails,
  addNewRestaurant,
  updateRestaurant,
  deleteRestaurant,
  getAllChefPackages,
  getMyPackage,
  getAllUsers,
  toggleActive,
};
