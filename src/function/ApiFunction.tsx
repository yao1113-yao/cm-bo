import { message } from "antd";
import { bankApi, deviceApi, gameProviderApi, mainApi, staffApi } from "../service/CallApi";
export async function getAllGameProviderList(setIsGameLoading: any, setAllGameList: any) {
  setIsGameLoading(true);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const subdomain = window.location.hostname.split(".")[0] === "testcm" ? "BEST1" : window.location.hostname.split(".")[0] === "localhost" ? "BEST1" : window.location.hostname.split(".")[0].toUpperCase();

  console.log("");

  const object = {
    userID: userID,
    userToken: userToken,
    userType: userType,
    companyID: subdomain,
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
  const userType = localStorage.getItem("userType");

  const object = {
    userID: userID,
    userToken: userToken,
    userType: userType,
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

export async function getAllStaffList(setIsLoading: any, companyID: string, setAllStaffList: any) {
  setIsLoading(true);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const object = {
    userID: userID,
    userToken: userToken,
    userType: userType,
    CompanyID: companyID,
  };

  await staffApi("/staff-list", object)
    .then((result) => {
      setAllStaffList(result.data);
      setIsLoading(false);
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
      setIsLoading(false);
    });
}

export async function getAllBankList(companyID: string, bankCode: string, setIsDeviceLoading: any, setAllDeviceList: any) {
  setIsDeviceLoading(true);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const object = {
    userID: userID,
    userToken: userToken,
    userType: userType,
    companyID: companyID,
    bankCode: bankCode,
  };

  await bankApi("/company-bank-list", object)
    .then((result) => {
      setAllDeviceList(result.data);
      setIsDeviceLoading(false);
    })
    .catch((error) => {
      message.error(error?.response?.data?.message);
      setIsDeviceLoading(false);
    });
}

export async function handleEditingTransaction(values: any, status: number) {
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const object = {
    UserID: userID,
    UserToken: userToken,
    userType: userType,
    mktDetailsSrno: values?.srno,
    status: status,
  };
  await mainApi("/update-editing-transaction", object);
}
