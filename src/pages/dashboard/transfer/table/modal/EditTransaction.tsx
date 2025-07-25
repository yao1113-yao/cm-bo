import { Col, Form, Input, Modal, Row, Select } from "antd";
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
    await mainApi("/edit-transfer-transaction-details", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "edit-transfer-transaction-details",
        });
        setOpenEditTransaction(false);
        handleGetPendingTransactionRecord("Transfer");
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
            <Col xs={4}>
              <Form.Item label={t("game")} name="mGame" rules={[{ required: true }]}>
                <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("game")} optionFilterProp="label">
                  {allGameList?.map((items: any) => (
                    <Select.Option value={items.gameName} key={items.gameName}>
                      {items?.gameName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("gameLoginID")} name="gameID">
                <Input autoComplete="off" />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("Name")} name="name" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("HpNo")} name="hpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input type="number" autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("credit")} name="inCredit" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("remark")} name="remark">
                <Input style={{ width: "100%" }} autoComplete="off" />
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
