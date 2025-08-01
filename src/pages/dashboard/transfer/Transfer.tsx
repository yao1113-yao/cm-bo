import { Button, Checkbox, Col, Divider, Form, Input, InputNumber, message, Row, Select, Spin } from "antd";
import CommonButton from "../../../components/CommonButton";
import GameProvider from "../../../components/GameProvider";
import { mainApi } from "../../../service/CallApi";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useState } from "react";
import { IDeviceType, IGameProviderType, ITransactionType } from "../../../type/main.interface";
import { getAllGameProviderList, getAllItemCodeList } from "../../../function/ApiFunction";
import TransferTable from "./table/TransferTable";
import Action from "./action/Action";
import PendingTransferTable from "./table/PendingTransferTable";
import { Api } from "../../../context/ApiContext";

interface DepositProps extends React.HTMLAttributes<HTMLElement> {
  type: string;
}

const Transfer = ({ type }: DepositProps) => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const { userInfo } = useContext(Api);
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isActionLoading, setIsActionLoading] = useState<boolean>(false);
  const [freeCredit, setFreeCredit] = useState<boolean>(false);

  // const [creditAmount, setCreditAmount] = useState<number>(0);

  const [depositRecod, setDepositRecord] = useState<[ITransactionType] | undefined>();
  const [pendingTransferRecod, setPendingTransferRecod] = useState<[ITransactionType] | undefined>();
  const [allDeviceList, setAllDeviceList] = useState<[IDeviceType] | undefined>();

  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    getAllItemCodeList("MDevice", setIsLoading, setAllDeviceList);
  }, []);

  useEffect(() => {
    handleGetTransactionRecord("Transfer");
    handleGetPendingTransactionRecord("Transfer");
    const intervalId = setInterval(() => {
      handleGetTransactionRecord("Transfer");
      handleGetPendingTransactionRecord("Transfer");
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval on unmount
    };
  }, []);

  async function handleGetTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: "Transfer",
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
      RecordType: "Transfer",
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      setPendingTransferRecod(result.data);
    });
    setIsLoading(false);
  }

  async function handleInsertGetTransactionRecord(values: any) {
    const fields = form.getFieldsValue();

    const { users } = fields;
    let credit = 0;
    users.map((items: any) => {
      credit += Number(items.credit);
    });
    if (values?.credit === credit) {
      setIsActionLoading(true);
      const object = {
        UserID: userID,
        UserToken: userToken,
        RecordType: "Transfer",
        Type: type,
        FreeCredit: Number(freeCredit),
        ...values,
      };
      await mainApi("/insert-transfer-transaction-record", object).then(() => {
        messageApi.open({
          type: "success",
          content: "sent",
        });
        handleGetPendingTransactionRecord("Transfer");
        form.resetFields();
      });
      setIsActionLoading(false);
    } else {
      messageApi.open({
        type: "warning",
        content: "toCredit do not more than credit",
      });
    }
    //   console.log(values);
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

    // const currTotal = users.reduce((acc: any, curr: any) => acc + Number(curr?.credit ?? 0), 0);
    // if (currTotal > creditAmount) {
    //   messageApi.open({
    //     type: "error",
    //     content: "no",
    //   });
    //   form.setFieldValue(users[0].credit, "");

    //   console.log(key, users[key].credit);
    // }
  };
  function handleOnChangeFreeCredit() {
    setFreeCredit(!freeCredit);
    form.resetFields();
  }
  function handleOnChangeCreditAmount(values: any) {
    console.log(values);
    // setCreditAmount(values);
  }
  return (
    <>
      <Spin spinning={isActionLoading}>
        {contextHolder}
        {userInfo?.userType !== 2 && (
          <Form
            name="dynamic_form_nest_item"
            // onFinish={onFinish}
            autoComplete="off"
            layout="vertical"
            onFinish={handleInsertGetTransactionRecord}
            initialValues={{ users: [{}] }}
            form={form}
          >
            {!freeCredit && (
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
                  <Form.Item label={t("device")} name="device" rules={[{ required: true }]}>
                    <Select>
                      {allDeviceList?.map((items: any) => (
                        <Select.Option value={items.item} key={items.item}>
                          {items?.item}
                        </Select.Option>
                      ))}
                    </Select>
                  </Form.Item>
                </Col>

                <Col xs={3}>
                  <Form.Item label={t("credit")} name="credit" rules={[{ required: true, message: t("pleaseSelect") }]}>
                    <InputNumber style={{ width: "100%" }} prefix="-" onChange={handleOnChangeCreditAmount} />
                  </Form.Item>
                </Col>
              </Row>
            )}

            <Divider>{t("toID")}</Divider>

            <Checkbox onChange={handleOnChangeFreeCredit}>
              <div>&nbsp;Free Credit</div>
            </Checkbox>

            <Form.List name="users">
              {(fields, { add, remove }) => (
                <>
                  {fields.map(({ key, name, ...restField }) => (
                    <>
                      <Action onChange={onChange} allGameList={allGameList} key={key} name={name} remove={remove} {...restField} />
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

            <Row>
              <CommonButton text="submit" />
            </Row>
          </Form>
        )}

        <PendingTransferTable isPendingLoading={isLoading} pendingTransferRecod={pendingTransferRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
        <TransferTable isPendingLoading={isLoading} depositRecod={depositRecod} handleGetPendingTransactionRecord={handleGetPendingTransactionRecord} handleGetTransactionRecord={handleGetTransactionRecord} />
      </Spin>
    </>
  );
};

export default Transfer;
