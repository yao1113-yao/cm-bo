import { Card, Col, Form, Input, InputNumber, Row } from "antd";
import { usePlayerRegister } from "./hook/usePlayerRegister";
import GameProvider from "../../../components/GameProvider";
import CommonButton from "../../../components/CommonButton";

const PlayerRegister = () => {
  const { t, contextHolder, isLoading, allGameList, handleRegisterPlayer } = usePlayerRegister();
  return (
    <>
      {contextHolder}

      <Card title={t("registerPlayer")} loading={isLoading}>
        <Form layout="vertical" onFinish={handleRegisterPlayer}>
          <Row gutter={10}>
            <Col xs={4}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
            </Col>

            <Col xs={4}>
              <Form.Item label={t("score")} name="score" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item
                label={t("countPlayer")}
                name="countPlayer"
                rules={[
                  { required: true, message: t("pleaseSelect") },
                  { min: 1, type: "number", message: t("cannotLessThan1") },
                  { max: 10, type: "number", message: t("cannotMoreThan10") },
                ]}
              >
                <InputNumber style={{ width: "100%" }} />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("name")} name="name">
                <Input />
              </Form.Item>
            </Col>

            <Col xs={4}>
              <Form.Item label={t("phone")} name="phone">
                <Input />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("remark")} name="remark">
                <Input />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="submit" />
        </Form>
      </Card>
    </>
  );
};

export default PlayerRegister;
