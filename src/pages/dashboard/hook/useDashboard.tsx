import { Form } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";
import { Api } from "../../../context/ApiContext";
import { mainApi } from "../../../service/CallApi";
import { IPendingMarketingCountType } from "../../../type/main.interface";

export const useDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { PageType } = useParams();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const { userInfo, subdomain } = useContext(Api);
  const [type, setType] = useState(PageType);

  const [count, setCount] = useState<IPendingMarketingCountType | undefined>();

  useEffect(() => {
    handleGetPendingTransactionRecordCount();
    const intervalId = setInterval(() => {
      handleGetPendingTransactionRecordCount();
    }, 10000);
    return () => {
      clearInterval(intervalId); // Clear the interval on unmount
    };
  }, []);

  async function handleGetPendingTransactionRecordCount() {
    // setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
    };
    await mainApi("/pending-transaction-record-count", object).then((result) => {
      setCount(result.data);
    });
    // setIsLoading(false);
  }

  function handleOnChangeType(values: any) {
    setType(values);
    navigate(`/dashboard/${values}`);
    form.resetFields();
  }

  function handleOnChangeBonus(current: any, all: any) {
    if ("bonusPer" in current || "credit" in current) {
      const bonus = (all?.credit * all?.bonusPer) / 100;
      const total = (all?.credit * all?.bonusPer) / 100 + all?.credit;
      const minCuci = ((all?.credit * all?.bonusPer) / 100 + all?.credit) * 2;

      form.setFieldValue("bonus", Number(bonus) ? bonus : 0);
      form.setFieldValue("total", Number(total) ? total : 0);
      form.setFieldValue("cuci", Number(minCuci) ? minCuci : 0);
    }
  }

  // async function handleInsertGetTransactionRecord(values: any) {
  //   setIsLoading(true);
  //   const object = {
  //     UserID: userID,
  //     UserToken: userToken,
  //     PageType: "Main",
  //     Type: type,
  //     ...values,
  //   };
  //   await mainApi("/insert-transaction-record", object).then(() => {
  //     message.success("success");
  //     form.resetFields();
  //     handleGetTransactionRecord("withdraw");
  //     handleGetTransactionRecord("deposit");
  //   });
  //   setIsLoading(false);
  // }

  return { t, navigate, form, type, userInfo, count, handleOnChangeType, handleOnChangeBonus };
};
