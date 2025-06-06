import { useContext, useEffect, useState } from "react";
import { bankApi } from "../../../../service/CallApi";
import { Button, Form, message, Space, TableProps, Tooltip } from "antd";
import { ICompanyType, IDeviceType, ITransactionType } from "../../../../type/main.interface";
import { getAllItemCodeList } from "../../../../function/ApiFunction";
import { Api } from "../../../../context/ApiContext";
import { formatIndex, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useTranslation } from "react-i18next";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import Swal from "sweetalert2";

export const useMaybank = () => {
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const { t } = useTranslation();

  const { companyList } = useContext(Api);

  const [form] = Form.useForm();
  const [form2] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
  const [bankSelected, setBankSelected] = useState<string>("");
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();
  const [selectedCompany, setSelectedCompany] = useState<ICompanyType | undefined>();
  const [bankRecordList, setBankRecordList] = useState<[ITransactionType] | undefined>();

  useEffect(() => {
    getAllItemCodeList("MBank", setIsDeviceLoading, setAllBankList);
    // handleGetBankRecordList();
    const temp = companyList?.filter((items: any) => items.companyID === "BEST1");
    if (temp !== undefined) {
      setSelectedCompany(temp[0]);
    }
  }, []);
  console.log(isDeviceLoading);
  const bankRecordColumns: TableProps<ITransactionType>["columns"] = [
    {
      title: "#",
      hidden: false,
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("bankCode"),
      dataIndex: "bankCode",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankDate"),
      dataIndex: "bankDate",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("bankRemark"),
      dataIndex: "bankRemark",
      hidden: false,
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("debit"),
      dataIndex: "debit",
      hidden: false,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("credit"),
      dataIndex: "credit",
      hidden: false,
      align: "center",
      render: (text: number) => {
        return <div style={{ fontWeight: "600" }}>{formatNumber(text)}</div>;
      },
    },
    {
      title: t("action"),
      hidden: false,
      render: (record: any) => {
        return (
          <>
            <Space>
              {record?.debit !== 0 ? (
                <Tooltip title={t("assignBank")}>
                  <Button icon={<RightOutlined />} onClick={() => handleChangeDebitCredit(record)}>
                    Credit
                  </Button>
                </Tooltip>
              ) : (
                <Tooltip title={t("assignBank")}>
                  <Button icon={<LeftOutlined />} onClick={() => handleChangeDebitCredit(record)}>
                    Debit
                  </Button>
                </Tooltip>
              )}
            </Space>
          </>
        );
      },
    },
  ];

  async function handleGetBankRecordList(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      bankCode: values?.bank,
    };
    await bankApi("/bank-record-list", object)
      .then((result) => {
        setBankRecordList(result.data);
      })
      .catch((error) => {
        console.log(error);
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
      });
    setIsLoading(false);
  }

  function handleInsertBankTransaction() {
    Swal.fire({
      title: "Please confirm that data in google sheet is correct!",
      showCancelButton: true,
      confirmButtonText: "Submit",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          Company: selectedCompany?.companyID,
          SpreedSheetID: selectedCompany?.spreedSheetID,
          Bank: bankSelected,
        };
        await bankApi("/insert-bank-transaction", object)
          .then(() => {
            form.resetFields();
            setIsLoading(false);
            handleGetBankRecordList({ bank: handleGetBankRecordList });
            form2.setFieldValue("bank", bankSelected);
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
        setIsLoading(false);
      }
    });

    setIsLoading(false);
  }

  function handleOnChangeSelectedCompany() {}

  async function handleChangeDebitCredit(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      BankRecordSrno: values?.srno,
    };
    await bankApi("/update-debit-credit", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "Success",
        });
        // handleGetBankRecordList();
      })
      .catch((error) => {
        console.log(error);
        messageApi.open({
          type: "error",
          content: error.response.data.message,
        });
      });
    setIsLoading(false);
  }

  return { form, form2, contextHolder, companyList, isLoading, selectedCompany, setSelectedCompany, bankSelected, setBankSelected, handleOnChangeSelectedCompany, allBankList, bankRecordColumns, bankRecordList, handleInsertBankTransaction, handleGetBankRecordList };
};
