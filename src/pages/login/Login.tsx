import { useLogin } from "./hook/useLogin";

import "./login.scss";
import { Button, Card, Col, Form, Input, Row, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const { t, contextHolder, isLoading, handleLogin } = useLogin();

  return (
    <Row justify="center" align="middle" className="login-container">
      {contextHolder}
      <Col xs={23} md={13} xl={10} xxl={8}>
        <Card>
          <Spin spinning={isLoading}>
            <div className="login-box">
              <div className="logo-img">{/* <img src={Logo} alt="Logo" loading="lazy" /> */}</div>

              <Form layout="vertical" onFinish={handleLogin}>
                <Form.Item label={t("userID")} name="userID" rules={[{ required: true }]}>
                  <Input autoComplete="off" size="large" maxLength={200} prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item label={t("password")} name="password" rules={[{ required: true }]}>
                  <Input.Password size="large" autoComplete="off" maxLength={200} prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item>
                  <Button block ghost size="large" shape="round" type="primary" style={{ color: "white", borderColor: "white", borderWidth: 1 }} htmlType="submit">
                    {t("login")}
                  </Button>
                </Form.Item>
              </Form>
            </div>
          </Spin>
        </Card>
      </Col>
    </Row>
  );
};

export default Login;
