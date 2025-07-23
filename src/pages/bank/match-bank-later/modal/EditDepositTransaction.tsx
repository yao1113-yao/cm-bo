import { Col, Form, Input, InputNumber, Modal, Row, Select } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { IGameProviderType } from "../../../../type/main.interface";
import { getAllGameProviderList, handleEditingTransaction } from "../../../../function/ApiFunction";
import { mainApi } from "../../../../service/CallApi";
import CommonButton from "../../../../components/CommonButton";
import { Api } from "../../../../context/ApiContext";

const EditDepositTransaction = ({ messageApi, openEditTransaction, selectedPendingDeposit, setOpenEditTransaction, handleGetMatchBankLaterList, userInput }: any) => {
  const { t } = useTranslation();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [form] = Form.useForm();
  const { subdomain } = useContext(Api);

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
  }, []);

  const initialValues = {
    mGame: selectedPendingDeposit?.mGame,
    gameID: selectedPendingDeposit?.gameID,
    inCredit: selectedPendingDeposit?.inCredit,
    freeCredit: selectedPendingDeposit?.freeCredit,
    bonus: selectedPendingDeposit?.bonusPer * 100,
    total: selectedPendingDeposit?.total,
    cuci: selectedPendingDeposit?.cuci,
    remark: selectedPendingDeposit?.remark,
  };

  async function handleEditTransactionDetails(values: any) {
    setIsLoading(true);
    console.log(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: subdomain,
      mktDetailsSrno: selectedPendingDeposit?.srno,
      ...values,
    };
    await mainApi("/edit-deposit-transaction-details", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "edit-deposit-transaction-details",
        });
        handleOnCloseModal();
        handleGetMatchBankLaterList(userInput);
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

  const onChange = () => {
    const inCredit = form.getFieldValue("inCredit");
    const freeCredit = form.getFieldValue("freeCredit");
    const bonus = form.getFieldValue("bonus");
    console.log(Number((inCredit * bonus) / 100));
    form.setFieldValue("total", Number(inCredit) + Number(freeCredit) + Number((inCredit * bonus) / 100));
    form.setFieldValue("cuci", (Number(inCredit) + Number(freeCredit) + Number((inCredit * bonus) / 100)) * 2);
    form.setFieldValue("total", Number(inCredit) + Number(freeCredit) + Number((inCredit * bonus) / 100));
  };
  return (
    <div>
      <Modal width="70vw" open={openEditTransaction} onCancel={() => handleOnCloseModal()} footer={null} closable={false} loading={isLoading}>
        <Form form={form} initialValues={initialValues} layout="vertical" onFinish={handleEditTransactionDetails}>
          <Row gutter={20}>
            <Col xs={6}>
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
            <Col xs={6}>
              <Form.Item label={t("gameLoginID")} name="gameID">
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            {/* <Col xs={6}>
              <Form.Item label={t("password")} name="password">
                <Input />
              </Form.Item>
            </Col> */}
            <Col xs={6}>
              <Form.Item label={t("credit")} name="inCredit" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input onChange={onChange} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("freeCredit")} name="freeCredit">
                <Input onChange={onChange} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("bonus(%)")} name="bonus" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input onChange={onChange} />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("total")} name="total">
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("minCuci")} name="cuci">
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>
            <Col xs={6}>
              <Form.Item label={t("remark")} name="remark">
                <Input style={{ width: "100%" }} autoComplete="off" />
              </Form.Item>
            </Col>
          </Row>
          <CommonButton text="search" />
        </Form>
      </Modal>
    </div>
  );
};

export default EditDepositTransaction;
