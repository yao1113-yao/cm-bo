import { Checkbox, Col, Divider, Form, Input, InputNumber, message, Row, Space } from "antd";
import CommonButton from "../../../components/CommonButton";
import Device from "../../../components/Device";
import GameProvider from "../../../components/GameProvider";
import { mainApi } from "../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { IDeviceType, IGameProviderType, ITransactionType } from "../../../type/main.interface";
import { getAllGameProviderList, getAllItemCodeList } from "../../../function/ApiFunction";
import WithdrawTable from "./table/WithdrawTable";
import PendingWithdrawTable from "./table/PendingWithdrawTable";
import { Api } from "../../../context/ApiContext";

interface DepositProps extends React.HTMLAttributes<HTMLElement> {
  type: string;
}

const Withdraw = ({ type }: DepositProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const { userInfo } = useContext(Api);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);
  const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
  const [cuciAllEnable, setCuciAllEnable] = useState<boolean>(false);
  const [withdrawRecod, setWithdrawRecord] = useState<[ITransactionType] | undefined>();
  const [pendingWithdrawRecod, setPendingWithdrawRecord] = useState<[ITransactionType] | undefined>();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [allDeviceList, setAllDeviceList] = useState<[IDeviceType] | undefined>();

  console.log(isDeviceLoading, isGameLoading, isLoading);
  useEffect(() => {
    getAllGameProviderList(setIsGameLoading, setAllGameList);
    getAllItemCodeList("MDevice", setIsDeviceLoading, setAllDeviceList);
  }, []);

  function handleOnChangeBonus(current: any, all: any) {
    if ("bonusPer" in current || "credit" in current) {
      const bonus = (all?.credit * all?.bonusPer) / 100;
      const total = (all?.credit * all?.bonusPer) / 100 + all?.credit;
      const minCuci = ((all?.credit * all?.bonusPer) / 100 + all?.credit) * 2;

      form.setFieldValue("bonus", Number(bonus) ? bonus : 0);
      form.setFieldValue("total", Number(total) ? total : 0);
      form.setFieldValue("cuci", Number(minCuci) ? minCuci : 0);
    }
  }

  async function handleGetTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Main",
      Type: type,
    };
    await mainApi("/transaction-record", object).then((result) => {
      setWithdrawRecord(result.data);
    });
    setIsLoading(false);
  }

  async function handleGetPendingTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      type: type,
      RecordType: "Main",
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      setPendingWithdrawRecord(result.data);
    });
    setIsLoading(false);
  }

  useEffect(() => {
    handleGetTransactionRecord("Withdraw");
    handleGetPendingTransactionRecord("Withdraw");
  }, []);

  async function handleInsertGetTransactionRecord(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Main",
      Type: type,
      ...values,
    };
    await mainApi("/insert-withdraw-transaction-record", object).then(() => {
      message.success("success");
      form.resetFields();
      handleGetPendingTransactionRecord("Withdraw");
    });
    setIsLoading(false);
  }

  function handleCheckFreeCredit() {
    setCuciAllEnable(!cuciAllEnable);
  }

  return (
    <>
      {userInfo?.userType !== 2 && (
        <Form layout="vertical" form={form} onValuesChange={handleOnChangeBonus} onFinish={handleInsertGetTransactionRecord}>
          <Row gutter={10}>
            <Col xs={3}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
            </Col>

            <Col xs={3}>
              <Form.Item label={t("gameLoginID")} name="gameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Form.Item label={t("name")} name="name" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Form.Item label={t("hpNo")} name="hpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Device list={allDeviceList} required={true} selectAll={false} label="device" />
            </Col>

            <Col xs={3}>
              <Form.Item
                label={
                  <Space>
                    {t("credit")}
                    <Checkbox onChange={handleCheckFreeCredit}>
                      <div>&nbsp;Cuci All</div>
                    </Checkbox>
                  </Space>
                }
                name="credit"
                rules={[{ required: !cuciAllEnable, message: t("pleaseSelect") }]}
              >
                <InputNumber style={{ width: "100%" }} disabled={cuciAllEnable} />
              </Form.Item>
            </Col>
          </Row>

          <Divider style={{ margin: "0px" }}>{t("bankDetails")}</Divider>

          <Row gutter={10}>
            <Col xs={3}>
              <Form.Item label={t("customerBank")} name="customerBank" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Form.Item label={t("customerBankAccNo")} name="customerBankAccNo" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Form.Item label={t("customerBankAccName")} name="customerBankAccName" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input />
              </Form.Item>
            </Col>

            {/* <Col xs={3}>
            <Form.Item label={t("hpNo")} name="customerHpNo" rules={[{ required: true, message: t("pleaseEnter") }]}>
              <Input />
            </Form.Item>
          </Col> */}

            <Col xs={3}>
              <Form.Item
                label={t("cashOut")}
                name="cashOut"
                rules={[
                  { required: true, message: t("pleaseSelect") },
                  { min: 0, type: "number", message: t("cannotLessThan0") },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Form.Item label={t("remark")} name="remark" rules={[{ required: true, message: t("pleaseEnter") }]}>
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <Row>
            <CommonButton text="submit" />
          </Row>
        </Form>
      )}

      <PendingWithdrawTable pendingWithdrawRecod={pendingWithdrawRecod} />
      <WithdrawTable withdrawRecod={withdrawRecod} />
    </>
  );
};

export default Withdraw;
