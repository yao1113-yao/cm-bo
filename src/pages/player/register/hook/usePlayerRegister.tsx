import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IGameProviderType, IPlayerTask } from "../../../../type/main.interface";
import { getAllGameProviderList } from "../../../../function/ApiFunction";
import { playerApi } from "../../../../service/CallApi";
import { message, TableProps, Tag } from "antd";
import { Api } from "../../../../context/ApiContext";
import { formatDateTime, formatIndex, formatString } from "../../../../function/CommonFunction";

export const usePlayerRegister = () => {
  const { t } = useTranslation();
  const { userInfo } = useContext(Api);

  const [messageApi, contextHolder] = message.useMessage();

  const { subdomain } = useContext(Api);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isFreeID, setIsFreeID] = useState<boolean>(false);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [apiData, setApiData] = useState<IPlayerTask[] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    userInfo?.userType === 3 && handleGetPlayerTaskList();
  }, []);

  const columns: TableProps<IPlayerTask>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("action"),
      dataIndex: "action",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameName"),
      dataIndex: "gameName",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("countNumber"),
      dataIndex: "countNumber",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("countSuccess"),
      dataIndex: "countSuccess",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("status"),
      dataIndex: "status",
      ellipsis: true,
      render: (text: number, record: any) => {
        return text === -1 ? <Tag>BOT PROCESSING</Tag> : text === 2 && record?.countNumber === record?.countSuccess ? <Tag color="#389e0d"> DONE</Tag> : text === 3 ? <Tag color="#f50">BOT FAIL</Tag> : <Tag color="#108ee9">BOT PROCESSING</Tag>;
      },
    },
    {
      title: t("SysRemark1"),
      dataIndex: "sysRemark1",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("updateDate"),
      dataIndex: "updateDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
  ];

  async function handleRegisterPlayer(values: any) {
    if ((values?.game === "MYBOSS2" && values?.password !== undefined) || (values?.game === "NUTZCLUB" && values?.password !== undefined)) {
      messageApi.open({
        type: "warning",
        content: "Myboss And Nutzclub cannot set password",
      });
    } else {
      // console.log((values?.game !== "MYBOSS2" && values?.password !== "") || (values?.game !== "NUTZCLUB" && values?.password !== ""));
      setIsLoading(true);
      const object = {
        UserID: userID,
        UserToken: userToken,
        UserType: userType,
        companyID: subdomain,
        IsFreeID: isFreeID ? 1 : 0,
        ...values,
      };
      await playerApi("/register-player", object)
        .then((result: any) => {
          messageApi.open({
            type: "success",
            content: result?.message,
          });
          handleGetPlayerTaskList();
          setIsFreeID(false);
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
  }

  async function handleGetPlayerTaskList() {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
    };
    await playerApi("/player-task-list", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
  }

  return { t, userInfo, contextHolder, isLoading, allGameList, columns, isFreeID, setIsFreeID, apiData, handleRegisterPlayer };
};
