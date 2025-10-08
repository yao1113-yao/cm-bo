import { Checkbox, Col, Divider, Form, Input, InputNumber, message, Row, Space, Spin } from "antd";
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
  const { userInfo, subdomain } = useContext(Api);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [messageApi, contextHolder] = message.useMessage();

  const [cuciAllEnable, setCuciAllEnable] = useState<boolean>(false);
  const [withdrawRecod, setWithdrawRecord] = useState<[ITransactionType] | undefined>();
  const [pendingWithdrawRecod, setPendingWithdrawRecord] = useState<[ITransactionType] | undefined>();
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [allDeviceList, setAllDeviceList] = useState<[IDeviceType] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    getAllItemCodeList("MDevice", setIsLoading, setAllDeviceList);
  }, []);

  useEffect(() => {
    handleGetTransactionRecord("Withdraw");
    handleGetPendingTransactionRecord("Withdraw");
    const intervalId = setInterval(() => {
      handleGetTransactionRecord("Withdraw");
      handleGetPendingTransactionRecord("Withdraw");
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval on unmount
    };
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
      companyID: subdomain,
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
      companyID: subdomain,
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      setPendingWithdrawRecord(result.data);
    });
    setIsLoading(false);
  }

  async function handleInsertGetTransactionRecord(values: any) {
    setIsActionLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Withdraw",
      Type: type,
      companyID: subdomain,
      game: values?.game,
      gameLoginID: values?.gameLoginID,
      name: values?.name,
      hpNo: values?.hpNo,
      device: values?.device,
      credit: cuciAllEnable ? 0 : values?.credit,
      customerBank: values?.customerBank,
      customerBankAccNo: values?.customerBankAccNo,
      customerBankAccName: values?.customerBankAccName,
      cashOut: values?.cashOut,
      remark: values?.remark,
    };
    await mainApi("/insert-withdraw-transaction-record", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "success",
        });
        form.resetFields();
        setCuciAllEnable(false);
        handleGetPendingTransactionRecord("Withdraw");
      })
      .catch((error) => {
        console.log(error?.response?.data?.message);
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message,
        });
      });
    setIsActionLoading(false);
  }

  function handleCheckFreeCredit() {
    setCuciAllEnable(!cuciAllEnable);
    form.setFieldValue("credit", 0);
  }

  const roundUpFormatter = (num: any) => {
    // If the number is a decimal, round it up
    if (typeof num === "number" && num % 1 !== 0) {
      return Math.trunc(num);
    }
    return num;
  };

  return (
    <>
      {contextHolder}
      <Spin spinning={isActionLoading}>
        {userInfo?.userType !== 2 && (
          <Form layout="vertical" form={form} onValuesChange={handleOnChangeBonus} onFinish={handleInsertGetTransactionRecord}>
            <Row gutter={10}>
              <Col xs={3}>
                <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
              </Col>

              <Col xs={3}>
                <Form.Item label={t("gameLoginID")} name="gameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("name")} name="name" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("hpNo")} name="hpNo" rules={[{ required: true, message: t("pleaseSelect") }]}>
                  <Input type="number" autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Device list={allDeviceList} required={true} selectAll={false} label="device" />
              </Col>

              <Col xs={4}>
                <Form.Item
                  label={
                    <Space>
                      {t("credit")}
                      <Checkbox onChange={handleCheckFreeCredit}>
                        <div>&nbsp;Free ID Cuci All</div>
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
                  <Input autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("customerBankAccNo")} name="customerBankAccNo" rules={[{ required: true, message: t("pleaseEnter") }]}>
                  <Input autoComplete="off" />
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("customerBankAccName")} name="customerBankAccName" rules={[{ required: true, message: t("pleaseEnter") }]}>
                  <Input autoComplete="off" />
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
                  {cuciAllEnable ? (
                    <InputNumber style={{ width: "100%" }} />
                  ) : (
                    <InputNumber
                      style={{ width: "100%" }}
                      step={1}
                      formatter={(value: any) => value.toString().split(".")[0]} // Removes any decimal part for display
                      parser={(value: any) => parseInt(value, 10)}
                    />
                  )}
                </Form.Item>
              </Col>

              <Col xs={3}>
                <Form.Item label={t("remark")} name="remark">
                  <Input autoComplete="off" />
                </Form.Item>
              </Col>
            </Row>

            <Row>
              <CommonButton text="submit" />
            </Row>
          </Form>
        )}

        <PendingWithdrawTable isPendingLoading={isLoading} pendingWithdrawRecod={pendingWithdrawRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
        <WithdrawTable isPendingLoading={isLoading} withdrawRecod={withdrawRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
      </Spin>
    </>
  );
};

export default Withdraw;
