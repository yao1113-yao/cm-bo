import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, message, TableProps, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import { formatDateTime, formatIndex, formatNumber, formatString } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { ICompanyBankType, ICompanyGPType } from "../../../../type/main.interface";
import { WalletOutlined } from "@ant-design/icons";
export const useBankBalance = () => {
  const { t } = useTranslation();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openEditBankBalance, setOpenEditBankBalance] = useState<boolean>(false);
  const [selectedRecord, setSelectedRecord] = useState<ICompanyBankType | undefined>();
  const [apiData, setApiData] = useState<ICompanyBankType[] | undefined>();
  const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  const initialValues = location?.state?.userInput !== undefined ? { loginID: location?.state?.userInput?.loginID, status: location?.state.userInput.status, page: location?.state.userInput.page, pageSize: location?.state.userInput.pageSize } : { loginID: "", status: 9, page: 1, pageSize: 10 };

  useEffect(() => {
    handleGetCompanyBankList(initialValues);
    handleGetCompanyGPList(initialValues);
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

  const columnsCompanyGP: TableProps<ICompanyGPType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
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
      title: t("balance"),
      dataIndex: "balance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
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
      render: () => {
        return <></>;
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

  function handleOnChangeAmount(values: any) {
    const balance = selectedRecord?.balance;
    form.setFieldValue("finalBalance", balance + values);
  }

  async function handleGetCompanyBankList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST1",
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

  async function handleGetCompanyGPList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST1",
      gameName: values?.gameName,
    };
    await bankApi("/company-gp-list", object)
      .then((result) => {
        setApiData2(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  return { t, isLoading, form, openEditBankBalance, handleCloseModalEditBankBalance, handleOnChangeAmount, selectedRecord, apiData, apiData2, setApiData, initialValues, columns, columnsCompanyGP, handleGetCompanyBankList };
};
