import { Checkbox, Col, Form, Input, Row, Select, Space } from "antd";

import { MinusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";
import { useState } from "react";

const Action = ({ onChange, allGameList, key, name, remove, ...rest }: any) => {
  const { t } = useTranslation();

  const [newIDEnable, setNewIDEnable] = useState<boolean>(false);
  function handleCheckNewID() {
    setNewIDEnable(!newIDEnable);
  }

  return (
    <>
      <Row gutter={10}>
        <Col xs={3}>
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
                {t("toGameLoginID")}
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

        <Col xs={3}>
          <Form.Item label={t("toName")} name={[name, "name"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input autoComplete="off" />
          </Form.Item>
        </Col>

        <Col xs={3}>
          <Form.Item label={t("toHpNo")} name={[name, "hpNo"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input autoComplete="off" />
          </Form.Item>
        </Col>
        <Col xs={3}>
          <Form.Item label={t("credit")} name={[name, "credit"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input style={{ width: "100%" }} onChange={(e) => onChange(e, rest.fieldKey, "credit")} />
          </Form.Item>
        </Col>

        {rest.fieldKey !== 0 && <MinusCircleOutlined onClick={() => remove(name)} />}
      </Row>
    </>
  );
};

export default Action;
