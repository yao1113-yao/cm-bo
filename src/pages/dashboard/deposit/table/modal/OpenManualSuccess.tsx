import { Form, Input, Modal } from "antd";
import CommonButton from "../../../../../components/CommonButton";
import { useTranslation } from "react-i18next";

const OpenManualSuccess = ({ openManualSuccess, handleCloseManualSuccessModal, selectedPendingDeposit, handleInsertManualSuccess }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <Modal open={openManualSuccess} onCancel={handleCloseManualSuccessModal} footer={null} closable={false}>
        <Form layout="vertical" initialValues={selectedPendingDeposit} onFinish={handleInsertManualSuccess}>
          <Form.Item label={t("game")} name="mGame">
            <Input />
          </Form.Item>

          <Form.Item label={t("gameID")} name="gameID">
            <Input />
          </Form.Item>

          <Form.Item label={t("name")} name="name">
            <Input />
          </Form.Item>

          <Form.Item label={t("hpNo")} name="hpNo">
            <Input />
          </Form.Item>

          <Form.Item label={t("total")} name="total">
            <Input />
          </Form.Item>

          <CommonButton text="submit" />
        </Form>
      </Modal>
    </>
  );
};
export default OpenManualSuccess;
