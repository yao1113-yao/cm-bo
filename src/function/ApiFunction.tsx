import { message } from "antd";
import { deviceApi, gameProviderApi } from "../service/CallApi";

export async function getAllGameProviderList(setIsGameLoading: any, setAllGameList: any) {
  setIsGameLoading(true);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const object = {
    userID: userID,
    userToken: userToken,
  };

  await gameProviderApi("/all-gameprovider-list", object)
    .then((result) => {
      setAllGameList(result.data);
      setIsGameLoading(false);
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
      setIsGameLoading(false);
    });
}

export async function getAllItemCodeList(itemCode: string, setIsDeviceLoading: any, setAllDeviceList: any) {
  setIsDeviceLoading(true);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const object = {
    userID: userID,
    userToken: userToken,
    itemCode: itemCode,
  };

  await deviceApi("/all-itemcode-list", object)
    .then((result) => {
      setAllDeviceList(result.data);
      setIsDeviceLoading(false);
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
      setIsDeviceLoading(false);
    });
}
