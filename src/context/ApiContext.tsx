import { createContext, Dispatch, ReactNode, SetStateAction, useEffect, useState } from "react";
import { Spin } from "antd";
import { userApi } from "../service/CallApi";
import { ICompanyType, IUserType } from "../type/main.interface";

interface IApiContextType {
  windowWidth: number;
  windowHeight: number;
  userInfo: IUserType | undefined;
  setUserInfo: Dispatch<SetStateAction<IUserType | undefined>>;
  companyList: [ICompanyType] | undefined;
  setCompanyList: Dispatch<SetStateAction<[ICompanyType] | undefined>>;
}

const initApiContext: IApiContextType = {
  windowWidth: screen.availWidth,
  windowHeight: screen.availHeight,
  userInfo: undefined,
  setUserInfo: () => {},
  companyList: undefined,
  setCompanyList: () => {},
};

export const Api = createContext<IApiContextType>(initApiContext);

interface IApiContextProps {
  children: ReactNode;
}

const ApiContext = ({ children }: IApiContextProps) => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [userInfo, setUserInfo] = useState<IUserType | undefined>(undefined);
  const [companyList, setCompanyList] = useState<[ICompanyType] | undefined>();

  const [windowWidth, setWindowWidth] = useState<number>(screen.availWidth);
  const [windowHeight, setWindowHeight] = useState<number>(screen.availHeight);

  useEffect(() => {
    handleFirstLoad();

    window.addEventListener("resize", () => {
      setWindowWidth(screen.availWidth);
      setWindowHeight(screen.availHeight);
    });
    return () => {
      setWindowWidth(screen.availWidth);
      setWindowHeight(screen.availHeight);
    };
  }, []);

  async function handleFirstLoad() {
    const object = {
      UserID: localStorage.getItem("userID") ?? "",
      UserToken: localStorage.getItem("userToken") ?? "",
    };
    await userApi("/validate-token", object)
      .then((result) => {
        setUserInfo(result.data);
        setCompanyList(result.data2);
        localStorage.setItem("userToken", result.data.token);
      })
      .catch(() => {});
    setIsLoading(false);
  }

  if (isLoading) {
    return <Spin spinning={isLoading}></Spin>;
  }

  const values: IApiContextType = { windowWidth, windowHeight, userInfo, setUserInfo, companyList, setCompanyList };
  return <Api.Provider value={values}>{children}</Api.Provider>;
};

export default ApiContext;
