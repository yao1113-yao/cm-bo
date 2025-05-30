import { Form, Input, InputNumber, Modal } from "antd";
import { useTranslation } from "react-i18next";

const EditBankBalance = ({ isLoading, form, openEditBankBalance, selectedRecord, handleOnChangeAmount, handleCloseModalEditBankBalance }: any) => {
  const { t } = useTranslation();
  return (
    <Modal open={openEditBankBalance} onCancel={() => handleCloseModalEditBankBalance()} footer={null} closable={false} title={t("editBankBalance")} loading={isLoading}>
      <Form layout="vertical" initialValues={selectedRecord} form={form}>
        <Form.Item label={t("bankCode")} name="bankCode">
          <Input disabled />
        </Form.Item>

        <Form.Item label={t("balance")} name="balance">
          <Input disabled />
        </Form.Item>
        <Form.Item label={t("currentBalance")} name="balance">
          <Input disabled />
        </Form.Item>

        <Form.Item label={t("amount")} name="amount">
          <InputNumber style={{ width: "100%" }} onChange={handleOnChangeAmount} />
        </Form.Item>

        <Form.Item label={t("finalBalance")} name="finalBalance">
          <InputNumber />
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default EditBankBalance;
