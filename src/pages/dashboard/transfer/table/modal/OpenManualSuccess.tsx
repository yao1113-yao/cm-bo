import { Form, Input, Modal, Select } from "antd";
import CommonButton from "../../../../../components/CommonButton";
import { useTranslation } from "react-i18next";
import { IGameProviderType } from "../../../../../type/main.interface";
import { useEffect, useState } from "react";
import { getAllGameProviderList } from "../../../../../function/ApiFunction";

const OpenManualSuccess = ({ isLoading, setIsLoading, openManualSuccess, handleCloseManualSuccessModal, selectedPendingDeposit, handleInsertManualSuccess }: any) => {
  const { t } = useTranslation();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  console.log(selectedPendingDeposit);

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
  }, []);

  const initialValues = {
    mGame: selectedPendingDeposit?.mGame,
    gameID: selectedPendingDeposit?.gameID,
    name: selectedPendingDeposit?.name,
    hpNo: selectedPendingDeposit?.hpNo,
    credit: selectedPendingDeposit?.inCredit > 0 ? selectedPendingDeposit?.inCredit : selectedPendingDeposit?.outCredit,
    cuci: selectedPendingDeposit?.cuci,
  };
  return (
    <>
      <Modal open={openManualSuccess} onCancel={handleCloseManualSuccessModal} footer={null} closable={false} loading={isLoading}>
        <Form layout="vertical" initialValues={initialValues} onFinish={handleInsertManualSuccess}>
          <Form.Item label={t("game")} name="mGame" rules={[{ required: true }]}>
            <Select disabled defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("game")} optionFilterProp="label">
              {allGameList?.map((items: any) => (
                <Select.Option value={items.gameName} key={items.gameName}>
                  {items?.gameName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>

          <Form.Item label={t("gameID")} name="gameID" required>
            <Input />
          </Form.Item>

          <Form.Item label={t("password")} name="password">
            <Input autoComplete="off" />
          </Form.Item>

          <Form.Item label={t("name")} name="name" required>
            <Input disabled />
          </Form.Item>

          <Form.Item label={t("hpNo")} name="hpNo" required>
            <Input type="number" disabled />
          </Form.Item>

          <Form.Item label={t("credit")} name="credit" required>
            <Input disabled />
          </Form.Item>

          <CommonButton text="submit" />
        </Form>
      </Modal>
    </>
  );
};
export default OpenManualSuccess;
