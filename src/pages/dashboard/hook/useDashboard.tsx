import { Form } from "antd";
import { useState } from "react";
import { useTranslation } from "react-i18next";
import { useNavigate, useParams } from "react-router-dom";

export const useDashboard = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [form] = Form.useForm();
  const { PageType } = useParams();

  const [type, setType] = useState(PageType);

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

  return { t, navigate, form, type, handleOnChangeType, handleOnChangeBonus };
};
