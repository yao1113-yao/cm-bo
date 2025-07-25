import { Checkbox, Col, Form, Input, InputNumber, Row, Select, Space } from "antd";

import { MinusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Action = ({ onChange, allGameList, allDeviceList, key, name, remove, form, ...rest }: any) => {
  const { t } = useTranslation();

  const [newIDEnable, setNewIDEnable] = useState<boolean>(false);
  const [freeCreditEnable, setFreeCreditEnable] = useState<boolean>(false);
  // const [welcomeBonusEnable, setWelcomeBonusEnable] = useState<boolean>(false);

  function handleCheckNewID() {
    setNewIDEnable(!newIDEnable);
  }

  function handleCheckFreeCredit() {
    setFreeCreditEnable(!freeCreditEnable);
  }

  // function handleCheckWelcomeBonus() {
  //   setWelcomeBonusEnable(!welcomeBonusEnable);
  // }
  return (
    <>
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
            <Input disabled={newIDEnable} autoComplete="off" />
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
            <Input style={{ width: "100%" }} onChange={(e) => onChange(e, rest.fieldKey, "credit")} />
          </Form.Item>
        </Col>

        <Col xs={4}>
          <Form.Item label={t("freeCredit")} name={[name, "freeCredit"]}>
            <Input style={{ width: "100%" }} disabled={!freeCreditEnable} onChange={(e) => onChange(e, rest.fieldKey, "freeCredit")} />
          </Form.Item>
        </Col>

        <Col xs={4}>
          <Form.Item label={t("bonus(%)")} name={[name, "bonusPer"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input style={{ width: "100%" }} onChange={(e) => onChange(e, rest.fieldKey, "bonusPer")} />
          </Form.Item>
        </Col>
        {/* <Col xs={4}>
          <Form.Item
            label={
              <Space>
                {t("bonus(%)")}
                <Checkbox onChange={handleCheckWelcomeBonus}>
                  <div>&nbsp;Welcome Bonus</div>
                </Checkbox>
              </Space>
            }
            name={[name, "bonusPer"]}
            rules={[{ required: true, message: t("pleaseSelect") }]}
          >
            <InputNumber style={{ width: "100%" }} onChange={(e) => onChange(e, rest.fieldKey, "bonusPer")} max={welcomeBonusEnable ? 30 : 20} />
          </Form.Item>
        </Col> */}
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
        {/* {welcomeBonusEnable && (
          <>
            <Col xs={4}>
              <Form.Item label={t("customerBank")} name={[name, "customerBank"]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("customerBankName")} name={[name, "customerBankName"]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("customerBankAccNo")} name={[name, "customerBankAccNo"]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>
          </>
        )} */}

        {rest.fieldKey !== 0 && <MinusCircleOutlined onClick={() => remove(name)} />}
      </Row>
    </>
  );
};

export default Action;
