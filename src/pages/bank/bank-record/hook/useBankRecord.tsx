import { useContext, useEffect, useRef, useState } from "react";
import { useTranslation } from "react-i18next";

import dayjs from "dayjs";
import { Button, Form, message, Space, TableProps, Tag, Tooltip } from "antd";
import { formatDateTime, formatNumber, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { bankApi, mainApi } from "../../../../service/CallApi";
import { IDeviceType, ITotalValueType, ITransactionType } from "../../../../type/main.interface";
import { CloseOutlined, ClockCircleOutlined, BankOutlined, EditOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";
import { Api } from "../../../../context/ApiContext";
import { getAllItemCodeList, handleEditingTransaction } from "../../../../function/ApiFunction";

export const useBankRecord = () => {
  const { userInfo, subdomain, companyList } = useContext(Api);
  const { t } = useTranslation();
  const [form] = Form.useForm();

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITransactionType[]>([]);
  const [apiData2, setApiData2] = useState<ITotalValueType | undefined>();
  //   const [apiData2, setApiData2] = useState<ICompanyGPType[] | undefined>();
  const [pagination, setPagination] = useState({ current: 1, pageSize: 10 });
  const [openBankRecord, setOpenBankRecord] = useState<boolean>(false);
  const [timer, setTimer] = useState<number>(5);
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [openEditTransaction, setOpenEditTransaction] = useState<boolean>(false);
  const [userInput, setUserInput] = useState<any>();

  const [selectedPendingDeposit, setSelectedPendingDeposit] = useState<ITransactionType | undefined>();
  const [isCheckAllAmount, setIsCheckAllAmount] = useState<boolean>(false);
  const [selected, setSelected] = useState<ITransactionType[]>([]);
  const [changeStaffCodeModal, setChangeStaffCodeModal] = useState<boolean>(false);
  const [changeCashierModal, setChangeCashierModal] = useState<boolean>(false);

  const handleTableChange = (pagination: any) => {
    setPagination(pagination);
  };
  let count = 5;
  const initialValues = {
    searchDate: searchDateRange("day"),
    companyID: "all",
    bank: "all",
    type: "all",
    remark: "",
    keyword: "",
    searchCompanyID: "all",
  };
  useEffect(() => {
    getAllItemCodeList("MBank", setIsLoading, setAllBankList);
    handleGetBankRecordMarketingList(initialValues);
  }, []);

  function OpenModalBankRecord(values: any) {
    setSelectedPendingDeposit(values);
    setOpenBankRecord(!openBankRecord);
  }

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: t("action"),
      align: "center",
      ellipsis: true,
      hidden: userInfo && userInfo?.userType !== 2,
      render: (record) => {
        return record?.status === 1 ? (
          <Space>
            <Tooltip title={t("ShowRecordToMkt")}>
              <Button onClick={() => handleShowRecord(record)}>
                <ClockCircleOutlined />
              </Button>
            </Tooltip>
            {record?.kioskErrorSrno === 0 && (
              <>
                <Tooltip title={t("Error(Take Out Bank)")}>
                  <Button icon={<CloseOutlined />} onClick={() => handleTakeOutBankTransaction(record)}></Button>
                </Tooltip>
                <Tooltip title={t("assignBank")}>
                  <Button icon={<BankOutlined />} onClick={() => OpenModalBankRecord(record)} disabled={record?.isEditing === 1}></Button>
                </Tooltip>

                <Tooltip title={t("editRecord")}>
                  <Button icon={<EditOutlined />} onClick={() => OpenModalEditTransaction(record)} disabled={record?.isEditing === 1}></Button>
                </Tooltip>
              </>
            )}
            {/* 
            {record?.credit > record?.mktBankIn && (
             
            )} */}
          </Space>
        ) : (
          ""
        );
      },
    },
    {
      title: t("mktCreateDate"),
      dataIndex: "createDate",
      align: "center",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("bankCreateDate"),
      dataIndex: "bankDate",
      align: "center",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
    {
      title: t("status"),
      dataIndex: "status",
      align: "center",
      render: (text: number) => {
        return text === 1 ? <Tag color="#87d068">Assign</Tag> : text === 2 ? <Tag color="#108ee9">Payment</Tag> : <Tag color="#f50">Haven't</Tag>;
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      align: "center",
      hidden: (userInfo && userInfo?.userType === 2) || userInfo?.userType === 3,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("recordType"),
      dataIndex: "recordType",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{text === "Main" ? "DEPOSIT" : formatString(text)}</div>;
      },
    },
    {
      title: t("Cashier"),
      dataIndex: "updateBy",
      align: "center",
      hidden: (userInfo && userInfo?.userType === 2) || userInfo?.userType === 3,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("Marketing"),
      dataIndex: "mStaff",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("game"),
      dataIndex: "mGame",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("password"),
      dataIndex: "password",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("name"),
      dataIndex: "name",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("hpNo"),
      dataIndex: "hpNo",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("device"),
      dataIndex: "mDevice",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("remark"),
      dataIndex: "remark",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankIn"),
      dataIndex: "credit",
      align: "center",
      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno !== 0 && record.mktSrno === apiData[(pagination?.current - 1) * pagination.pageSize + index - 1]?.mktSrno && record?.recordType !== "Withdraw") return <div>-</div>;
        return <div style={{ fontWeight: "600", backgroundColor: (record?.mktBankIn !== 0 ? "black" : "") && (record?.kioskErrorSrno === 0 && record?.mktBankIn > text ? "red" : record?.mktBankIn < text ? "green" : record?.kioskErrorSrno !== 0 ? "yellow" : "") }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bankOut"),
      dataIndex: "debit",
      align: "center",
      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno !== 0 && record.mktSrno === apiData[(pagination?.current - 1) * pagination.pageSize + index - 1]?.mktSrno && record?.recordType !== "Withdraw") return <div>-</div>;
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("mktBankIn"),
      dataIndex: "mktBankIn",
      hidden: false,
      align: "center",

      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno !== 0 && record.mktSrno === apiData[(pagination?.current - 1) * pagination.pageSize + index - 1]?.mktSrno) return <div>-</div>;
        return <div style={{ fontWeight: "600", backgroundColor: (record?.credit !== 0 ? "black" : "") && (record?.kioskErrorSrno === 0 && text > record?.credit ? "red" : record?.kioskErrorSrno === 0 && text < record?.credit ? "green" : record?.kioskErrorSrno !== 0 ? "yellow" : "") }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("mktBankOut"),
      dataIndex: "mktBankOut",
      hidden: false,
      align: "center",

      render: (text: number, record, index: number) => {
        if (index > 0 && record.mktSrno !== 0 && record.mktSrno === apiData[(pagination?.current - 1) * pagination.pageSize + index - 1]?.mktSrno) return <div>-</div>;
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bank"),
      dataIndex: "mBank",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankRemark"),
      dataIndex: "bankRemark",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("mktInCredit"),
      dataIndex: "inValue",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("mktOutCredit"),
      dataIndex: "outValue",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bonus"),
      dataIndex: "bonus",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("bonus") + "%",
      dataIndex: "bonusPer",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text * 100 + " %")}</div>;
      },
    },
    {
      title: t("total"),
      dataIndex: "total",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("freeCredit"),
      dataIndex: "freeCredit",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("cuci"),
      dataIndex: "cuci",
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
  ];

  function OpenModalEditTransaction(values: any) {
    setSelectedPendingDeposit(values);
    setOpenEditTransaction(true);
    handleEditingTransaction(values, 1);
  }

  async function handleShowRecord(values: any) {
    Swal.fire({
      title: "Confirm show the record to MKT?",
      showCancelButton: true,
      confirmButtonText: "Show",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          UserType: userType,
          mktSrno: values?.mktSrno,
        };
        await mainApi("/show-record", object)
          .then(() => {
            handleGetBankRecordMarketingList(initialValues);
            messageApi.open({
              type: "success",
              content: "done",
            });
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "",
            });
          });
      }

      setIsLoading(false);
    });
  }
  console.log(timer);
  async function handleTakeOutBankTransaction(values: any) {
    Swal.fire({
      title: `Do you want to take out the bank?`,
      showConfirmButton: false,
      showCancelButton: true,
      didOpen: () => {
        const intervalId = setInterval(() => {
          Swal.update({
            text: `${count}`, //This will use the current value of alertText
          });
          count--;
          setTimer(count);

          if (count <= 0) {
            // Example: Stop after 5 seconds
            clearInterval(intervalId); // Stop the interval
            Swal.update({
              title: `Do you want to take out the bank?`, // This will use the current value of alertText
              text: "0",
            });
            Swal.update({
              showConfirmButton: true,
              showCancelButton: true,
              confirmButtonText: "Take out",
              cancelButtonText: "Cancel",
            });
          }
        }, 1000);
      },
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          UserType: userType,
          mktSrno: values?.mktSrno,
        };
        await bankApi("/take-out-bank", object)
          .then(() => {
            handleGetBankRecordMarketingList(initialValues);
            messageApi.open({
              type: "success",
              content: "done",
            });
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "",
            });
          });
      }

      setIsLoading(false);
    });
  }

  // async function handleAssignPaymentTransaction(values: any) {
  //   Swal.fire({
  //     title: "Do you want to assign bank?",
  //     showCancelButton: true,
  //     confirmButtonText: "Assign Payment",
  //   }).then(async (result) => {
  //     if (result.isConfirmed) {
  //       setIsLoading(true);
  //       const object = {
  //         UserID: userID,
  //         UserToken: userToken,
  //         bankRecordSrno: values?.srno,
  //       };
  //       await bankApi("/assign-payment", object)
  //         .then(() => {
  //           handleGetBankRecordMarketingList(initialValues);
  //           messageApi.open({
  //             type: "success",
  //             content: "done",
  //           });
  //         })
  //         .catch(() => {
  //           messageApi.open({
  //             type: "error",
  //             content: "",
  //           });
  //         });
  //     }

  //     setIsLoading(false);
  //   });
  // }

  const samePrev = useRef<boolean>(false);
  const prevClass = useRef<string>("row-highlight-1");

  const rowClassName = (record: any, index: number) => {
    samePrev.current = index > 0 ? record.mktSrno === apiData[(pagination?.current - 1) * pagination.pageSize + index - 1]?.mktSrno && record.mktSrno !== 0 : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };

  async function handleGetBankRecordMarketingList(values: any) {
    setIsLoading(true);
    const input = { ...values };

    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: userInfo?.userType === 2 || userInfo?.userType === 3 ? subdomain : values?.companyID,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      type: values?.type,
      keyword: values?.keyword,
      searchCompanyID: values?.searchCompanyID,
      // bankCode: values?.bank,
      // remark: values?.remark,
    };
    setUserInput(input);

    await bankApi("/bank-marketing-list", object)
      .then((result) => {
        setApiData(result.data);
        setApiData2(result.data2);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }
  function handleSearchByFilter(values: any) {
    console.log(values);
    if (values === "day") {
      form.setFieldValue("searchDate", searchDateRange(values));
      handleGetBankRecordMarketingList({ searchDate: searchDateRange(values), type: form.getFieldValue("type"), bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark"), keyword: form.getFieldValue("keyword") });
    } else {
      form.setFieldValue("searchDate", [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")]);
      handleGetBankRecordMarketingList({ searchDate: [dayjs().startOf("day").add(-1, "day"), dayjs().endOf("day").add(-1, "day")], type: form.getFieldValue("type"), bank: form.getFieldValue("bank"), remark: form.getFieldValue("remark"), keyword: form.getFieldValue("keyword") });
    }
  }

  function handleCheckingCheckBox(item: any) {
    setSelected(item);
  }

  console.log(selected);

  return { t, userInfo, companyList, userInput, form, contextHolder, isLoading, allBankList, apiData, setApiData, apiData2, openEditTransaction, setOpenEditTransaction, initialValues, timer, columns, handleGetBankRecordMarketingList, handleSearchByFilter, rowClassName, pagination, handleTableChange, selectedPendingDeposit, setSelectedPendingDeposit, openBankRecord, setOpenBankRecord, messageApi, isCheckAllAmount, setIsCheckAllAmount, changeStaffCodeModal, setChangeStaffCodeModal, changeCashierModal, setChangeCashierModal, handleCheckingCheckBox, selected, setSelected };
};
