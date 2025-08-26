import { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { Api } from "../../../context/ApiContext";
import { userApi } from "../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { message } from "antd";

export const useLogin = () => {
  const { t, i18n } = useTranslation();
  const navigate = useNavigate();
  const [messageApi, contextHolder] = message.useMessage();

  const { userInfo, setUserInfo, setCompanyList, subdomain } = useContext(Api);

  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    if (userInfo) {
      navigate("/dashboard/deposit");
    }
  }, []);

  async function handleLogin(values: any) {
    setIsLoading(true);
    const object = { UserID: values?.userID, Password: values?.password, CompanyID: subdomain, UserType: values?.userType };
    await userApi("/user-login", object)
      .then((result) => {
        setUserInfo(result.data);
        setCompanyList(result.data2);
        localStorage.setItem("userID", result.data.userID);
        localStorage.setItem("userToken", result.data.token);
        console.log(result.data);
        navigate("/dashboard/deposit", { replace: true });
        setIsLoading(false);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message,
        });

        setIsLoading(false);
      });
    setIsLoading(false);
  }

  return { t, i18n, navigate, subdomain, contextHolder, isLoading, setIsLoading, handleLogin };
};
