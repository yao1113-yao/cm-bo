import { Col, Form, Input, Row, Select } from "antd";

import { MinusCircleOutlined } from "@ant-design/icons";
import { useTranslation } from "react-i18next";

const Action = ({ onChange, allGameList, key, name, remove, ...rest }: any) => {
  const { t } = useTranslation();

  return (
    <>
      <Row gutter={10}>
        <Col xs={3}>
          <Form.Item label={t("game")} name={[name, "game"]} rules={[{ required: true }]}>
            <Select>
              {allGameList?.map((items: any) => (
                <Select.Option value={items.gameName} key={items.gameName}>
                  {items?.gameName}
                </Select.Option>
              ))}
            </Select>
          </Form.Item>
        </Col>

        <Col xs={3}>
          <Form.Item label={t("toGameLoginID")} name={[name, "gameLoginID"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={3}>
          <Form.Item label={t("toName")} name={[name, "name"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input />
          </Form.Item>
        </Col>

        <Col xs={3}>
          <Form.Item label={t("toHpNo")} name={[name, "hpNo"]} rules={[{ required: true, message: t("pleaseSelect") }]}>
            <Input />
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
