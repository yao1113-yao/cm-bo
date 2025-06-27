import { Col, Divider, Form, Input, InputNumber, message, Row, Spin } from "antd";
import CommonButton from "../../../components/CommonButton";
import GameProvider from "../../../components/GameProvider";
import { mainApi } from "../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { IGameProviderType, ITransactionType } from "../../../type/main.interface";
import { getAllGameProviderList } from "../../../function/ApiFunction";
import RekemenTable from "./table/RekemenTable";
import PendingRekemenTable from "./table/PendingRekemenTable";
import { Api } from "../../../context/ApiContext";

interface DepositProps extends React.HTMLAttributes<HTMLElement> {
  type: string;
}

const Rekemen = ({ type }: DepositProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { userInfo } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [depositRecod, setDepositRecord] = useState<[ITransactionType] | undefined>();
  const [pendingWithdrawRecod, setPendingWithdrawRecod] = useState<[ITransactionType] | undefined>();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  const initialValues = { bonusPer: "20" };

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
  }, []);

  useEffect(() => {
    handleGetTransactionRecord("Rekemen");
    handleGetPendingTransactionRecord("Rekemen");
    const intervalId = setInterval(() => {
      handleGetTransactionRecord("Rekemen");
      handleGetPendingTransactionRecord("Rekemen");
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval on unmount
    };
  }, []);

  function handleOnChangeBonus(current: any, all: any) {
    if ("credit" in current) {
      const totalBonus = (all?.credit * all?.bonusPer) / 100;

      form.setFieldValue("totalBonus", Number(totalBonus) ? totalBonus : 0);
    }
  }
  async function handleGetTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Rekemen",
      Type: type,
    };
    await mainApi("/transaction-record", object).then((result) => {
      setDepositRecord(result.data);
    });
    setIsLoading(false);
  }

  async function handleGetPendingTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      type: type,
      RecordType: "Rekemen",
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      setPendingWithdrawRecod(result.data);
    });
    setIsLoading(false);
  }

  async function handleInsertGetTransactionRecord(values: any) {
    setIsActionLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Rekemen",
      Type: type,
      ...values,
    };
    await mainApi("/insert-rekemen-transaction-record", object).then(() => {
      message.success("success");
      form.resetFields();
      handleGetPendingTransactionRecord("Rekemen");
    });
    setIsActionLoading(false);
  }

  return (
    <>
      <Spin spinning={isActionLoading}>
        {userInfo?.userType !== 2 && (
          <Form layout="vertical" form={form} onValuesChange={handleOnChangeBonus} onFinish={handleInsertGetTransactionRecord} initialValues={initialValues}>
            <Row gutter={10}>
              <Col xs={3}>
                <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
              </Col>

              <Col xs={3}>
                <Form.Item label={t("rekemenGameLoginID")} name="gameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("rekemenName")} name="name" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("rekemenHpNo")} name="hpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("bonus") + "(%)"} name="bonusPer" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input disabled />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("totalBonus")} name="totalBonus" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input disabled />
                </Form.Item>
              </Col>
            </Row>

            <Divider>{t("newCustomerDetails")}</Divider>
            <Row gutter={10}>
              <Col xs={3}>
                <GameProvider list={allGameList} required={true} selectAll={false} label="toGame" />
              </Col>
              <Col xs={3}>
                <Form.Item label={t("gameLoginID")} name="toGameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input />
                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item label={t("name")} name="toName" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("hpNo")} name="toHpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input type="number" />
                </Form.Item>
              </Col>
              <Col xs={3}>
                <Form.Item label={t("credit")} name="credit" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <InputNumber style={{ width: "100%" }} />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <CommonButton text="submit" />
            </Row>
          </Form>
        )}
        <PendingRekemenTable isPendingLoading={isLoading} pendingRekemenRecod={pendingWithdrawRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
        <RekemenTable isPendingLoading={isLoading} depositRecord={depositRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
      </Spin>
    </>
  );
};

export default Rekemen;
