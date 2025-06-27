import { Form, Input, InputNumber, message, Modal } from "antd";
import { useTranslation } from "react-i18next";
import { LogApi } from "../../../../service/CallApi";
import CommonButton from "../../../../components/CommonButton";

const EditKioskBalance = ({ isLoading, openEditKioskBalance, setOpenEditKioskBalance, selectedRecord, handleCloseModalEditBankBalance, handleGetCompanyGPList }: any) => {
  const { t } = useTranslation();
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  async function handleKioskOpeningBalance(values: any) {
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: "BEST8",
      CompanyGPSrno: selectedRecord?.srno,
      balance: values?.amount,
    };
    await LogApi("/kiosk-opening-balance", object)
      .then(() => {
        console.log("first");
        messageApi.open({
          type: "success",
          content: "Insert Success",
        });
        setOpenEditKioskBalance(false);
        handleGetCompanyGPList({ gameName: "" });
      })
      .catch(() => {
        console.log("first");
        messageApi.open({
          type: "error",
          content: "api error",
        });
      });
  }
  return (
    <>
      {contextHolder}
      <Modal open={openEditKioskBalance} onCancel={() => handleCloseModalEditBankBalance()} footer={null} closable={false} title={t("editBankBalance")} loading={isLoading}>
        <Form layout="vertical" onFinish={handleKioskOpeningBalance}>
          <Form.Item label={t("gameName")}>
            <Input disabled value={selectedRecord?.gameName} />
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

export default EditKioskBalance;
