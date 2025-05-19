import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IGameProviderType } from "../../../../type/main.interface";
import { getAllGameProviderList } from "../../../../function/ApiFunction";
import { playerApi } from "../../../../service/CallApi";
import { message } from "antd";

export const usePlayerRegister = () => {
  const { t } = useTranslation();

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
  }, []);

  async function handleRegisterPlayer(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      ...values,
    };
    await playerApi("/register-player", object)
      .then((result: any) => {
        messageApi.open({
          type: "success",
          content: result?.message,
        });
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

  return { t, contextHolder, isLoading, allGameList, handleRegisterPlayer };
};
