import axios from "axios";
import Swal from "sweetalert2";

export default function ApiBaseUrl(domain: string) {
  const api = axios.create({
    baseURL: `${domain}/`,
  });

  const onResponseSuccess = (response: any) => {
    if (response?.data?.status === true && (window.location.pathname === "/" || window.location.pathname === "/login")) {
      window.location.replace("/dashboard/deposit");
    }
    return response;
  };

  const onResponseError = (error: any) => {
    if (error.code === "ERR_NETWORK" || error.message === "Network Error" || error.message.includes("ERR_NETWORK_CHANGED")) {
      console.warn("Network changed or temporarily disconnected, ignored.");
      return Promise.reject(error); // 让它安静地过，不弹任何错误框
    }

    if (error?.response?.status === 500) {
      Swal.fire({
        text: "Error 500. Please try again later.",
        icon: "error",
      }).then((result) => (result.isConfirmed || result.dismiss || result.isDenied) && window.location.reload());
    }

    if (error?.response?.status === 401) {
      localStorage.removeItem("UserID");
      localStorage.removeItem("UserToken");

      if (window.location.pathname !== "/") {
        window.location.replace("/");
      }
    }
    return Promise.reject(error);
  };

  api.interceptors.response.use(onResponseSuccess, onResponseError);
  return api;
}
