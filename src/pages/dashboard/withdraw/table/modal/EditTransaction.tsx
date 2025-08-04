import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import CommonButton from "../../../../../components/CommonButton";
import { useTranslation } from "react-i18next";
import { getAllGameProviderList, handleEditingTransaction } from "../../../../../function/ApiFunction";
import { IGameProviderType } from "../../../../../type/main.interface";
import { mainApi } from "../../../../../service/CallApi";
import { Api } from "../../../../../context/ApiContext";

const EditTransaction = ({ messageApi, openEditTransaction, selectedPendingDeposit, setOpenEditTransaction, handleGetPendingTransactionRecord }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  console.log(selectedPendingDeposit);
  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
  }, []);

  async function handleEditTransactionDetails(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      mktDetailsSrno: selectedPendingDeposit?.srno,
      ...values,
    };
    await mainApi("/edit-withdraw-transaction-details", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "edit-transaction-details",
        });
        handleOnCloseModal();
        handleGetPendingTransactionRecord("withdraw");
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  function handleOnCloseModal() {
    handleEditingTransaction(selectedPendingDeposit, 0);
    setOpenEditTransaction();
  }
  return (
    <div>
      <Modal width="70vw" open={openEditTransaction} onCancel={() => handleOnCloseModal()} footer={null} closable={false} loading={isLoading}>
        <Form form={form} initialValues={selectedPendingDeposit} layout="vertical" onFinish={handleEditTransactionDetails}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("game")} name="mGame" rules={[{ required: true }]}>
                <Select disabled={selectedPendingDeposit?.mStatus === "HOLD"} defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("game")} optionFilterProp="label">
                  {allGameList?.map((items: any) => (
                    <Select.Option value={items.gameName} key={items.gameName}>
                      {items?.gameName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("gameLoginID")} name="gameID">
                <Input autoComplete="off" disabled={selectedPendingDeposit?.mStatus === "HOLD"} />
              </Form.Item>
            </Col>
            {/* <Col xs={6}>
              <Form.Item label={t("password")} name="password">
                <Input />
              </Form.Item>
            </Col> */}
            <Col xs={6}>
              <Form.Item label={t("credit")} name="outCredit" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input disabled={selectedPendingDeposit?.mStatus === "HOLD"} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("cashOut")} name="bankOut" rules={[{ min: 0, type: "number", message: t("cannotLessThan0") }]}>
                <InputNumber style={{ width: "100%" }} disabled={selectedPendingDeposit?.mStatus === "HOLD"} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("customerBank")} name="customerBank" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("customerBankAccNo")} name="customerBankAccNo" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("customerBankAccName")} name="customerBankAccName" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("Remark")} name="remark" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
          </Row>
          <CommonButton text="submit" />
        </Form>
      </Modal>
    </div>
  );
};

export default EditTransaction;
