import axios from "axios"

const axiosInstance = axios.create({
    baseURL: 'http://localhost:3001',
    headers: {
      'Content-Type': 'application/json; charset=utf-8'
    }
});

export const fetchAllData = () => {
    return axiosInstance.get(`/data`).then(response => response.data);
}

export const fetchDataByCusNo = (cusNo, option) => {
  return axiosInstance.get(`/data/${cusNo}?option=${option}`).then(response => response.data);
}