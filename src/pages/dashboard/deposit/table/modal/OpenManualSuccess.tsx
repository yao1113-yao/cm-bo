import { Form, Input, Modal } from "antd";
import CommonButton from "../../../../../components/CommonButton";
import { useTranslation } from "react-i18next";

const OpenManualSuccess = ({ isLoading, openManualSuccess, handleCloseManualSuccessModal, selectedPendingDeposit, handleInsertManualSuccess }: any) => {
  const { t } = useTranslation();

  console.log(selectedPendingDeposit);
  return (
    <>
      <Modal open={openManualSuccess} onCancel={handleCloseManualSuccessModal} footer={null} closable={false} loading={isLoading}>
        <Form layout="vertical" initialValues={selectedPendingDeposit} onFinish={handleInsertManualSuccess}>
          <Form.Item label={t("game")} name="mGame" required>
            <Input disabled />
          </Form.Item>

          <Form.Item label={t("gameID")} name="gameID" required>
            <Input />
          </Form.Item>

          <Form.Item label={t("password")} name="password" required>
            <Input />
          </Form.Item>

          <Form.Item label={t("name")} name="name" required>
            <Input />
          </Form.Item>

          <Form.Item label={t("hpNo")} name="hpNo" required>
            <Input type="number" />
          </Form.Item>

          <Form.Item label={t("total")} name="total" required>
            <Input />
          </Form.Item>

          <CommonButton text="submit" />
        </Form>
      </Modal>
    </>
  );
};
export default OpenManualSuccess;
