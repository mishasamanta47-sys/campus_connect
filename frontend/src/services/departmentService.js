import axios from "axios";

const BASE_URL = "http://localhost:5000/api/departments";

const getAuthHeaders = () => ({
  Authorization: `Bearer ${localStorage.getItem("token")}`,
});

export const getDepartments = async () => {
  const { data } = await axios.get(BASE_URL);
  return data.departments || [];
};

export const getDepartmentById = async (id) => {
  const { data } = await axios.get(`${BASE_URL}/${id}`);
  return data.department;
};

export const createDepartment = async (payload) => {
  const { data } = await axios.post(BASE_URL, payload, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const updateDepartment = async (id, payload) => {
  const { data } = await axios.put(`${BASE_URL}/${id}`, payload, {
    headers: getAuthHeaders(),
  });
  return data;
};

export const deleteDepartment = async (id) => {
  const { data } = await axios.delete(`${BASE_URL}/${id}`, {
    headers: getAuthHeaders(),
  });
  return data;
};
