import { Card, Col, Form, Input, message, Row } from "antd";
import GameProvider from "../../../components/GameProvider";
import { useTranslation } from "react-i18next";
import { useEffect, useState } from "react";
import { IGameProviderType } from "../../../type/main.interface";
import { getAllGameProviderList } from "../../../function/ApiFunction";
import CommonButton from "../../../components/CommonButton";
import { mainApi } from "../../../service/CallApi";
import { RobotOutlined } from "@ant-design/icons";
// interface DepositProps extends React.HTMLAttributes<HTMLElement> {
//   type: string;
// }

const ChangePassword = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isGameLoading, setIsGameLoading] = useState<boolean>(false);
  const [passwordRandom, setPasswordRandom] = useState<string>("");

  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  console.log(isGameLoading, passwordRandom);
  useEffect(() => {
    getAllGameProviderList(setIsGameLoading, setAllGameList);
  }, []);

  async function handleChangePlayerPassword(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      ...values,
    };
    await mainApi("/change-player-password", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Waiting Bot",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  function generateRandomString(length = 10) {
    const small = "abcdefghjkmnopqrstuvwxyz";
    const big = "ABCDEFGHJKMNOPQRSTUVWXYZ";
    const number = "0123456789";

    // Generate 1 random big
    const bigPart = Array.from({ length: 1 }, () => big.charAt(Math.floor(Math.random() * big.length))).join("");

    const smallPart = Array.from({ length: 1 }, () => small.charAt(Math.floor(Math.random() * small.length))).join("");

    // Generate the rest of the string with alphanumeric characters
    const numberPart = Array.from({ length: length - 2 }, () => number.charAt(Math.floor(Math.random() * number.length))).join("");

    setPasswordRandom(bigPart + smallPart + numberPart);
    form.setFieldValue("password", bigPart + smallPart + numberPart);
  }

  return (
    <>
      {contextHolder}
      <Card loading={isLoading}>
        <Form layout="vertical" onFinish={handleChangePlayerPassword} form={form}>
          <Row gutter={10}>
            <Col xs={4}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
            </Col>

            <Col xs={4}>
              <Form.Item label={t("gameLoginID")} name="gameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("password")} name="password" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input suffix={<RobotOutlined onClick={() => generateRandomString(8)} />} />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="submit" />
        </Form>
      </Card>
    </>
  );
};

export default ChangePassword;
