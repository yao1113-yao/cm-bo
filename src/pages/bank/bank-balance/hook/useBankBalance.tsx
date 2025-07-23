import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, message, TableProps, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import { formatDateTime, formatIndex, formatNumber, formatString } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { ICompanyBankType } from "../../../../type/main.interface";
import { WalletOutlined } from "@ant-design/icons";
import { Api } from "../../../../context/ApiContext";
export const useBankBalance = () => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openEditBankBalance, setOpenEditBankBalance] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ICompanyBankType | undefined>();
  const [apiData, setApiData] = useState<ICompanyBankType[] | undefined>();
  const initialValues = location?.state?.userInput !== undefined ? { loginID: location?.state?.userInput?.loginID, status: location?.state.userInput.status, page: location?.state.userInput.page, pageSize: location?.state.userInput.pageSize } : { loginID: "", status: 9, page: 1, pageSize: 10 };

  useEffect(() => {
    handleGetCompanyBankList(initialValues);
  }, []);

  const columns: TableProps<ICompanyBankType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },

    {
      title: t("bankCode"),
      dataIndex: "bankCode",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },

    {
      title: t("lastUpdate"),
      dataIndex: "updateDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      ellipsis: true,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("action"),
      ellipsis: true,
      render: (record) => {
        return (
          <>
            <Tooltip>
              <Button icon={<WalletOutlined />} onClick={() => handleOpenModalEditBankBalance(record)}></Button>
            </Tooltip>
          </>
        );
      },
    },
  ];

  function handleOpenModalEditBankBalance(values: ICompanyBankType) {
    setSelectedRecord(values);
    setOpenEditBankBalance(true);
  }

  function handleCloseModalEditBankBalance() {
    form.resetFields();

    setSelectedRecord(undefined);
    setOpenEditBankBalance(false);
  }

  async function handleGetCompanyBankList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      bankCode: values?.bank,
    };
    await bankApi("/company-bank-list", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  return { t, isLoading, form, openEditBankBalance, setOpenEditBankBalance, handleCloseModalEditBankBalance, selectedRecord, apiData, setApiData, initialValues, columns, handleGetCompanyBankList };
};
