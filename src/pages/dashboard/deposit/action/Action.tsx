import { Button, Checkbox, Col, Form, Input, InputNumber, message, Row, Select, Space, Tooltip } from "antd";

import { MinusCircleOutlined, SearchOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";
import { mainApi } from "../../../../service/CallApi";

const Action = ({ onChange, allGameList, allDeviceList, key, name, remove, form, welcomeBonusEnable, setWelcomeBonusEnable, hiBonusEnable, setHiBonusEnable, ...rest }: any) => {
  const { t } = useTranslation();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [messageApi, contextHolder] = message.useMessage();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [newIDEnable, setNewIDEnable] = useState<boolean>(false);
  const [freeCreditEnable, setFreeCreditEnable] = useState<boolean>(false);

  function handleCheckNewID() {
    setNewIDEnable(!newIDEnable);
  }

  function handleCheckFreeCredit() {
    setFreeCreditEnable(!freeCreditEnable);
  }

  function handleCheckWelcomeBonus() {
    setWelcomeBonusEnable(!welcomeBonusEnable);

    const fields = form.getFieldsValue();

    const { users } = fields;
    if (users) {
      users[0].bonusPer = "";

      users[0].customerBank = "";
      users[0].customerBankAccName = "";
      users[0].customerBankAccNo = "";
    }
  }

  function handleCheckHiBonus() {
    setHiBonusEnable(!hiBonusEnable);

    const fields = form.getFieldsValue();

    const { users } = fields;
    if (users) {
      users[0].bonusPer = "";
      users[0].customerBank = "";
      users[0].customerBankAccName = "";
      users[0].customerBankAccNo = "";
    }
  }

  async function handleSearchPLayerID(key: number) {
    const fields = form.getFieldsValue();
    const { users } = fields;

    if (!users[key]?.gameLoginID) {
      messageApi.warning("gameLoginID cannot be empty");
      return;
    }

    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      GameID: users[key].gameLoginID,
    };

    try {
      const result = await mainApi("/search-game-id", object);
      const res = result.data?.[0];

      if (res) {
        const newUsers = [...users];
        newUsers[key] = {
          ...newUsers[key],
          name: res.name,
          hpNo: res.phone,
          device: res.mDevice,
        };
        form.setFieldsValue({ users: newUsers });
        messageApi.success("Success");
      }
    } catch (error: any) {
      // only clear when failed
      form.resetFields([["users", key, "gameLoginID"]]);

      // if you want to clear the other fields too
      form.setFields([
        { name: ["users", key, "name"], value: "" },
        { name: ["users", key, "hpNo"], value: "" },
        { name: ["users", key, "device"], value: "" },
      ]);

      messageApi.error(error?.response?.data?.message || "Search failed");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      {contextHolder}
      <Row gutter={10}>
        <Col xs={4}>
          <Form.Item label={t("game")} name={[name, "game"]} rules={[{ required: true }]}>
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
          <Form.Item
            label={
              <Space>
                {t("gameLoginID")}
                <Checkbox onChange={handleCheckNewID}>
                  <div>&nbsp;New ID</div>
                </Checkbox>
              </Space>
            }
            name={[name, "gameLoginID"]}
            rules={[{ required: !newIDEnable, message: t("pleaseSelect") }]}
          >
            <Row justify="space-between">
              <Col xs={20}>
                <Input disabled={newIDEnable} autoComplete="off" style={{ width: "100%" }} />
              </Col>
              <Col xs={4} style={{ textAlign: "end" }}>
                <Tooltip title="Search ID">
                  <Button icon={<SearchOutlined />} disabled={newIDEnable} onClick={() => handleSearchPLayerID(name)} loading={isLoading}></Button>
                </Tooltip>
              </Col>
            </Row>
          </Form.Item>
        </Col>

        {name > 0 ? (
          ""
        ) : (
          <>
            <Col xs={4}>
              <Form.Item label={t("name")} name={[name, "name"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("hpNo")} name={[name, "hpNo"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input type="number" />
              </Form.Item>
            </Col>
          </>
        )}

        <Col xs={4}>
          <Form.Item label={t("device")} name={[name, "device"]} rules={[{ required: true }]}>
            <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("device")} optionFilterProp="label">
              {allDeviceList?.map((items: any) => (
                <Select.Option value={items.item} key={items.item}>
                  {items?.item}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>
        <Col xs={4}>
          <Form.Item
            label={
              <Space>
                {t("credit")}
                <Checkbox onChange={handleCheckFreeCredit}>
                  <div>&nbsp;Free Credit</div>
                </Checkbox>
              </Space>
            }
            name={[name, "credit"]}
            rules={[{ required: true, message: t("pleaseSelect") }]}
          >
            <Input style={{ width: "100%" }} onChange={(e) => onChange(e, name, "credit")} />
          </Form.Item>
        </Col>

        <Col xs={4}>
          <Form.Item label={t("freeCredit")} name={[name, "freeCredit"]}>
            <Input style={{ width: "100%" }} disabled={!freeCreditEnable} onChange={(e) => onChange(e, name, "freeCredit")} />
          </Form.Item>
        </Col>

        {/* <Col xs={4}>
          <Form.Item label={t("bonus(%)")} name={[name, "bonusPer"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input style={{ width: "100%" }} onChange={(e) => onChange(e, rest.fieldKey, "bonusPer")} />
          </Form.Item>
        </Col> */}
        <Col xs={6}>
          <Form.Item
            label={
              <Space>
                {t("bonus(%)")}
                {name === 0 && (
                  <>
                    <Checkbox onChange={handleCheckWelcomeBonus} disabled={hiBonusEnable}>
                      <div>&nbsp;Welcome Bonus</div>
                    </Checkbox>
                    <Checkbox onChange={handleCheckHiBonus} disabled={welcomeBonusEnable}>
                      <div>&nbsp;Hi Bonus</div>
                    </Checkbox>
                  </>
                )}
              </Space>
            }
            name={[name, "bonusPer"]}
            rules={[{ required: true, message: t("pleaseSelect") }]}
          >
            <InputNumber style={{ width: "100%" }} onChange={(e) => onChange(e, name, "bonusPer")} max={welcomeBonusEnable ? 30 : hiBonusEnable ? 100 : 25} />
          </Form.Item>
        </Col>

        {name === 0 && welcomeBonusEnable && (
          <>
            <Col xs={4}>
              <Form.Item label={t("customerBank")} name={[name, "customerBank"]}>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("customerBankAccName")} name={[name, "customerBankAccName"]}>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("customerBankAccNo")} name={[name, "customerBankAccNo"]}>
                <Input style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </>
        )}
      </Row>

      <Row gutter={10}>
        <Col xs={4}>
          <Form.Item label={t("bonus")} name={[name, "bonus"]}>
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
        </Col>

        <Col xs={4}>
          <Form.Item label={t("total")} name={[name, "total"]}>
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
        </Col>

        <Col xs={4}>
          <Form.Item label={t("minCuci")} name={[name, "cuci"]}>
            <InputNumber style={{ width: "100%" }} disabled />
          </Form.Item>
        </Col>

        {rest.fieldKey !== 0 && <MinusCircleOutlined onClick={() => remove(name)} />}
      </Row>
    </>
  );
};

export default Action;
