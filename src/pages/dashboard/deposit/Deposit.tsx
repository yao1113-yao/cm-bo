import { Button, Col, Divider, Form, Input, InputNumber, message, Row, Spin } from "antd";
import React, { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import CommonButton from "../../../components/CommonButton";
import Device from "../../../components/Device";
import { getAllGameProviderList, getAllItemCodeList } from "../../../function/ApiFunction";
import { IDeviceType, IGameProviderType, ITransactionType } from "../../../type/main.interface";
import Action from "./action/Action";
import DepositTable from "./table/DepositTable";
import { mainApi } from "../../../service/CallApi";
import PendingDepositTable from "./table/PendingDepositTable";
import { Api } from "../../../context/ApiContext";

interface DepositProps extends React.HTMLAttributes<HTMLElement> {
  type: string;
}

const Deposit = ({ type }: DepositProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { userInfo } = useContext(Api);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);
  const [isDeviceLoading, setIsDeviceLoading] = useState<boolean>(false);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();
  const [allDeviceList, setAllDeviceList] = useState<[IDeviceType] | undefined>();
  const [allBankList, setAllBankList] = useState<[IDeviceType] | undefined>();

  const [depositRecod, setDepositRecord] = useState<[ITransactionType] | undefined>();
  const [pendingDepositRecod, setPendingDepositRecord] = useState<[ITransactionType] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsGameLoading, setAllGameList);
    getAllItemCodeList("MDevice", setIsDeviceLoading, setAllDeviceList);
    getAllItemCodeList("MBank", setIsDeviceLoading, setAllBankList);
  }, []);

  useEffect(() => {
    handleGetTransactionRecord("deposit");
    handleGetPendingTransactionRecord("deposit");
  }, []);

  async function handleGetTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      type: type,
      RecordType: "Main",
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
      RecordType: "Main",
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      setPendingDepositRecord(result.data);
    });
    setIsLoading(false);
  }

  async function handleInsertGetTransactionRecord(values: any) {
    console.log(values);
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Main",
      Type: type,
      ...values,
    };
    await mainApi("/insert-deposit-transaction-record", object).then(() => {
      message.success("success");
      handleGetPendingTransactionRecord("deposit");
      form.resetFields();
    });
    setIsLoading(false);
  }

  const onChange = (e: any, key: any, type: any) => {
    const fields = form.getFieldsValue();

    const { users } = fields;
    if (type === "credit") {
      users[key].credit = e.target.value;
    }
    if (type === "bonusPer") {
      users[key].bonusPer = e.target.value;
    }
    if (type === "freeCredit") {
      users[key].freeCredit = e.target.value;
    }

    Object.assign(users[key], { credit: users[key].credit, bonus: Number(users[key].credit * users[key].bonusPer) / 100, total: Number((users[key].credit * users[key].bonusPer) / 100) + Number(users[key].credit) + Number(users[key].freeCredit ?? 0), cuci: Number(((users[key].credit * users[key].bonusPer) / 100 + Number(users[key].credit) + Number(users[key].freeCredit ?? 0)) * 2) });

    form.setFieldsValue({ users });

    const currTotal = users.reduce((acc: any, curr: any) => acc + Number(curr?.credit ?? 0), 0);
    form.setFieldValue("cashIn", currTotal);
  };

  return (
    <>
      {userInfo?.userType !== 2 && (
        <Form name="dynamic_form_nest_item" autoComplete="off" layout="vertical" onFinish={handleInsertGetTransactionRecord} initialValues={{ users: [{}] }} form={form}>
          <Form.List name="users">
            {(fields, { add, remove }) => (
              <>
                {fields.map(({ key, name, ...restField }) => (
                  <>
                    <Action onChange={onChange} allGameList={allGameList} allDeviceList={allDeviceList} key={key} name={name} remove={remove} {...restField} />
                  </>
                ))}
                <Form.Item>
                  <Button type="dashed" onClick={() => add()}>
                    Add field
                  </Button>
                </Form.Item>
              </>
            )}
          </Form.List>

          <Divider style={{ margin: "0px" }}>{t("bankDetails")}</Divider>

          <Row gutter={10}>
            <Col xs={3}>
              <Device list={allBankList} required={true} selectAll={false} label="bank" />
            </Col>

            <Col xs={3}>
              <Form.Item
                label={t("cashIn")}
                name="cashIn"
                rules={[
                  { required: true, message: t("pleaseSelect") },
                  { min: 0, type: "number", message: t("cannotLessThan0") },
                ]}
              >
                <InputNumber style={{ width: "100%" }} disabled />
              </Form.Item>
            </Col>

            <Col xs={3}>
              <Form.Item label={t("remark")} name="remark" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </Row>
          <Row>
            <CommonButton text="submit" />
          </Row>
        </Form>
      )}

      <PendingDepositTable pendingDepositRecod={pendingDepositRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
      <DepositTable depositRecord={depositRecod} />
    </>
  );
};

export default Deposit;
