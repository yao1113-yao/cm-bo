import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, message, Space, TableProps, Tooltip } from "antd";
import { useLocation } from "react-router-dom";
import { formatIndex, formatNumber, formatString } from "../../../../function/CommonFunction";
import { bankApi } from "../../../../service/CallApi";
import { ICompanyGPType, IGameProviderType } from "../../../../type/main.interface";
import { getAllGameProviderList } from "../../../../function/ApiFunction";

import { WalletOutlined, SyncOutlined } from "@ant-design/icons";
import { Api } from "../../../../context/ApiContext";
import Swal from "sweetalert2";
export const useKioskBalance = () => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const location = useLocation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [openEditKioskBalance, setOpenEditKioskBalance] = useState<boolean>(false);
  const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  const [selectedRecord, setSelectedRecord] = useState<ICompanyGPType | undefined>();

  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  const initialValues = location?.state?.userInput !== undefined ? { loginID: location?.state?.userInput?.loginID, status: location?.state.userInput.status, page: location?.state.userInput.page, pageSize: location?.state.userInput.pageSize } : { loginID: "", status: 9, page: 1, pageSize: 10 };

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);

    handleGetCompanyGPList(initialValues);
  }, []);

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
      title: t("balanceGP"),
      dataIndex: "balanceGP",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("balanceSystem"),
      dataIndex: "balance",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("action"),
      ellipsis: true,
      render: (record) => {
        return (
          <Space>
            <Tooltip title="editBalance">
              <Button icon={<WalletOutlined />} onClick={() => handleOpenModalEditBankBalance(record)}></Button>
            </Tooltip>
            <Tooltip title="syncBalanceGP">
              <Button icon={<SyncOutlined />} onClick={() => handleCheckBalanceGP(record)}></Button>
            </Tooltip>
          </Space>
        );
      },
    },
  ];

  async function handleGetCompanyGPList(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
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

  async function handleCheckBalanceGP(values: any) {
    Swal.fire({
      title: "Do you want to check balance gp?",
      showCancelButton: true,
      confirmButtonText: "yes",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          companyGPSrno: values?.srno,
        };
        await bankApi("/check-balance-gp", object)
          .then((result: any) => {
            handleGetCompanyGPList(initialValues);
            messageApi.open({
              type: "success",
              content: result.message + ". Action need fews minutes to process",
            });
          })
          .catch((error) => {
            messageApi.open({
              type: "error",
              content: error?.response?.data?.message,
            });
          });
      }

      setIsLoading(false);
    });
  }

  function handleOpenModalEditBankBalance(values: ICompanyGPType) {
    setSelectedRecord(values);
    setOpenEditKioskBalance(true);
  }

  function handleCloseModalEditBankBalance() {
    form.resetFields();

    setSelectedRecord(undefined);
    setOpenEditKioskBalance(false);
  }

  return { t, contextHolder, isLoading, form, allGameList, selectedRecord, handleCloseModalEditBankBalance, openEditKioskBalance, setOpenEditKioskBalance, apiData2, initialValues, columnsCompanyGP, handleGetCompanyGPList };
};
