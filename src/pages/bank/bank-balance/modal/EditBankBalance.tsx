import { Form, Input, InputNumber, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { LogApi } from "../../../../service/CallApi";
import CommonButton from "../../../../components/CommonButton";
import { useContext } from "react";
import { Api } from "../../../../context/ApiContext";

const EditBankBalance = ({ isLoading, form, openEditBankBalance, setOpenEditBankBalance, selectedRecord, handleCloseModalEditBankBalance, handleGetCompanyBankList }: any) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  async function handleBankOpeningBalance(values: any) {
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      CompanyBankSrno: selectedRecord?.srno,
      balance: values?.amount,
    };
    await LogApi("/bank-opening-balance", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Insert Success",
        });
        setOpenEditBankBalance(false);
        handleGetCompanyBankList({ bank: "" });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
  }
  return (
    <>
      {contextHolder}
      <Modal open={openEditBankBalance} onCancel={() => handleCloseModalEditBankBalance()} footer={null} closable={false} title={t("editBankBalance")} loading={isLoading}>
        <Form layout="vertical" form={form} onFinish={handleBankOpeningBalance}>
          <Form.Item label={t("bankCode")}>
            <Input disabled value={selectedRecord?.bankCode} />
          </Form.Item>

          <Form.Item label={t("amount")} name="amount">
            <InputNumber style={{ width: "100%" }} />
          </Form.Item>

          <CommonButton text="Submit" />
        </Form>
      </Modal>
    </>
  );
};

export default EditBankBalance;
