import { Form, message, TableProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { ITeamBankBalance } from "../../../../type/main.interface";
import { formatIndex, formatString } from "../../../../function/CommonFunction";
import { reportApi } from "../../../../service/CallApi";
import { Api } from "../../../../context/ApiContext";

export const useTeamBankBalance = () => {
  const { t } = useTranslation();
  const { companyList } = useContext(Api);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [userInput, setUserInput] = useState();
  const [apiData, setApiData] = useState<ITeamBankBalance[] | undefined>();

  const initialValues = {
    companyID: "all",
    min: 0,
    max: 0,
  };
  useEffect(() => {
    handleGetBankKioskBalance(initialValues);
  }, []);

  async function handleGetBankKioskBalance(values: any) {
    setIsLoading(true);
    setUserInput(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: values?.companyID,
      min: values?.min,
      max: values?.max,
    };
    await reportApi("/team-bank-balance", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  const columns: TableProps<ITeamBankBalance>["columns"] = [
    {
      title: "#",
      key: "srno",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("companyID"),
      key: "companyID",
      dataIndex: "companyID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankCount"),
      key: "bankCount",
      dataIndex: "bankCount",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },

    {
      title: t("totalBalance"),
      key: "totalBalance",
      dataIndex: "totalBalance",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
  ];

  return { t, companyList, form, isLoading, initialValues, columns, userInput, apiData, handleGetBankKioskBalance };
};
