import { Col, Divider, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useEffect, useState } from "react";
import CommonButton from "../../../../../components/CommonButton";
import { useTranslation } from "react-i18next";
import { getAllGameProviderList, handleEditingTransaction } from "../../../../../function/ApiFunction";
import { IGameProviderType } from "../../../../../type/main.interface";
import { mainApi } from "../../../../../service/CallApi";

const EditTransaction = ({ messageApi, openEditTransaction, selectedPendingDeposit, setOpenEditTransaction, handleGetPendingTransactionRecord }: any) => {
  const { t } = useTranslation();
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
      companyID: "BEST8",
      mktDetailsSrno: selectedPendingDeposit?.srno,
      ...values,
    };
    await mainApi("/edit-rekemen-transaction-details", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "edit-rekemen-transaction-details",
        });
        setOpenEditTransaction(false);
        handleGetPendingTransactionRecord("Rekemen");
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

  function onChange() {
    const credit = form.getFieldValue("inCredit");
    const bonus = form.getFieldValue("bonus");
    const totalBonus = Number(credit) * (Number(bonus) / 100);
    form.setFieldValue("totalBonus", Number(totalBonus));
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
              <Form.Item label={t("rekemenGameLoginID")} name="gameID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("rekemenName")} name="name" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("rekemenHpNo")} name="hpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("bonus") + "(%)"} name="bonus" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input disabled />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("totalBonus")} name="totalBonus" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input disabled />
              </Form.Item>
            </Col>
          </Row>

          <Divider>{t("newCustomerDetails")}</Divider>

          <Row gutter={10}>
            <Col xs={4}>
              <Form.Item label={t("game")} name="toGame" rules={[{ required: true }]}>
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
              <Form.Item label={t("gameLoginID")} name="toGameID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("name")} name="toName" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("hpNo")} name="toHpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input type="number" autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("credit")} name="inCredit" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <InputNumber style={{ width: "100%" }} onChange={onChange} />
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
