import { useLogin } from "./hook/useLogin";

import "./login.scss";
import { Button, Card, Col, Form, Input, Row, Select, Spin } from "antd";
import { UserOutlined, LockOutlined } from "@ant-design/icons";

const Login = () => {
  const { t, subdomain, contextHolder, isLoading, handleLogin } = useLogin();

  return (
    <Row justify="center" align="middle" className="login-container">
      {contextHolder}
      <Col xs={23} md={13} xl={10} xxl={8}>
        <Card>
          <Spin spinning={isLoading}>
            <div className="login-box">
              <div className="logo-img">{/* <img src={Logo} alt="Logo" loading="lazy" /> */}</div>

              <Form layout="vertical" onFinish={handleLogin}>
                <div style={{ color: "white", fontWeight: "600", fontSize: "20px", paddingBottom: "10px" }}>CompanyID : {subdomain}</div>
                <Form.Item label={t("userID")} name="userID" rules={[{ required: true }]}>
                  <Input autoComplete="off" size="large" maxLength={200} prefix={<UserOutlined />} />
                </Form.Item>

                <Form.Item label={t("password")} name="password" rules={[{ required: true }]}>
                  <Input.Password size="large" autoComplete="off" maxLength={200} prefix={<LockOutlined />} />
                </Form.Item>

                <Form.Item label={t("userType")} name="userType" rules={[{ required: true, message: t("pleaseSelectUserType") }]}>
                  <Select placeholder={t("pleaseSelect")}>
                    <Select.Option value={2}>{t("Cashier")}</Select.Option>
                    <Select.Option value={3}>{t("Marketing")}</Select.Option>
                    <Select.Option value={4}>{t("AM")}</Select.Option>
                    <Select.Option value={4}>{t("GM")}</Select.Option>
                  </Select>
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
