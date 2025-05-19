import { useState } from "react";
import { bankApi } from "../../../../service/CallApi";
import { Form, message } from "antd";

export const useCimbBank = () => {
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);

  async function handleInsertMaybankTransaction(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      ...values,
    };
    await bankApi("/insert-cimb-transaction", object)
      .then(() => {
        form.resetFields();
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

  return { form, contextHolder, isLoading, handleInsertMaybankTransaction };
};
