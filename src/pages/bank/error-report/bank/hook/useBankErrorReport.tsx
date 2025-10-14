import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { Button, Form, message, Space, TableProps, Tooltip } from "antd";
import { IBankErrorType, IDeviceType, ILogType, IUserType } from "../../../../../type/main.interface";
import { getAllItemCodeList, getAllStaffList } from "../../../../../function/ApiFunction";
import { formatDateTime, formatNumber, formatString } from "../../../../../function/CommonFunction";
import { LogApi } from "../../../../../service/CallApi";
import { Api } from "../../../../../context/ApiContext";
import { BankOutlined, DeleteOutlined, EditOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import Swal from "sweetalert2";

export const useBankErrorReport = () => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isKioskReportLoading, setKioskReportIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<IBankErrorType[] | undefined>();
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();
  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ILogType | undefined>();
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [editBankAdjustment, setEditBankAdjustment] = useState<boolean>(false);

  const initialValues = {
    searchDate: [dayjs().subtract(6, "hour"), dayjs()],
    staffSrno: 0,
    bank: "all",
    remark: "",
  };

  useEffect(() => {
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    getAllStaffList(setIsLoading, subdomain, setAllStaffList);
    handleGetBankErrorReport(initialValues);
  }, []);

  const columns: TableProps<IBankErrorType>["columns"] = [
    {
      title: "action",
      align: "center",
      ellipsis: true,
      render: (record) => {
        return (
          record?.bankRecordSrno === 0 && (
            <Space>
              <Tooltip title={t("assignBank")}>
                <Button icon={<BankOutlined />} onClick={() => OpenModalBankRecord(record)}></Button>
              </Tooltip>

              <Tooltip title={t("edit")}>
                <Button icon={<EditOutlined />} onClick={() => OpenEditAdjustmentModal(record)}></Button>
              </Tooltip>
              <Tooltip title={t("delete")}>
                <Button icon={<DeleteOutlined />} onClick={() => handleDeleteBankRecord(record)}></Button>
              </Tooltip>
            </Space>
          )
        );
      },
    },
    {
      title: t("type"),
      dataIndex: "type",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
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
      title: t("staffID"),
      dataIndex: "staffID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },

    {
      title: t("amount"),
      dataIndex: "amount",
      ellipsis: true,
      render: (text: number) => {
        return <div style={{ fontWeight: "600", color: text < 0 ? "red" : "green" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("remark"),
      dataIndex: "remark",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("createBy"),
      dataIndex: "createBy",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: "createDate",
      dataIndex: "createDate",
      hidden: false,
      render: (text: Date) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("updateBy"),
      dataIndex: "updateBy",
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

  function OpenModalBankRecord(values: any) {
    setSelectedPendingDeposit(values);
    setOpenBankRecord(!openBankRecord);
  }

  function OpenEditAdjustmentModal(values: any) {
    setSelectedPendingDeposit(values);
    setEditBankAdjustment(!editBankAdjustment);
  }

  function handleDeleteBankRecord(record: any) {
    Swal.fire({
      title: "Please confirm that data will be delete in system",
      showCancelButton: true,
      confirmButtonText: "Submit",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setKioskReportIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          UserType: userType,
          bankAdjustmentSrno: record?.srno,
        };
        await LogApi("/delete-bank-adjustment", object)
          .then(() => {
            form.setFieldValue("searchDate", [dayjs().subtract(6, "hour"), dayjs()]);
            handleGetBankErrorReport({ searchDate: [dayjs().subtract(6, "hour"), dayjs()], staffSrno: 0, bank: "all", remark: "" });
            setKioskReportIsLoading(false);

            messageApi.open({
              type: "success",
              content: "Success",
            });
          })
          .catch((error) => {
            console.log(error);
            messageApi.open({
              type: "error",
              content: error.response.data.message,
            });
          });
        setKioskReportIsLoading(false);
      }
    });

    setKioskReportIsLoading(false);
  }

  async function handleInsertBankError(values: any) {
    setKioskReportIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      type: values?.type,
      // staffSrno: values?.staffSrno,
      bankCode: values?.bank,
      amount: values?.amount,
      remark: values?.remark,
    };
    await LogApi("/insert-bank-adjustment", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Insert Success",
        });
        form.setFieldValue("searchDate", [dayjs().subtract(6, "hour"), dayjs()]);
        handleGetBankErrorReport({ searchDate: [dayjs().subtract(6, "hour"), dayjs()], staffSrno: 0, bank: "all", remark: "" });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setKioskReportIsLoading(false);
  }

  async function handleGetBankErrorReport(values: any) {
    setKioskReportIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      staffSrno: values?.staffSrno,
      bankCode: values?.bank,
      remark: values?.remark,
      type: "all",
    };
    await LogApi("/bank-adjustment-list", object)
      .then((result) => {
        setApiData(result.data);
        setKioskReportIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setKioskReportIsLoading(false);
  }

  return { t, messageApi, contextHolder, isLoading, isKioskReportLoading, form, allBankList, allStaffList, apiData, selectedPendingDeposit, setSelectedPendingDeposit, openBankRecord, setOpenBankRecord, editBankAdjustment, setEditBankAdjustment, initialValues, columns, handleInsertBankError, handleGetBankErrorReport };
};
