import { useTranslation } from "react-i18next";

import { Button, Space } from "antd";
import { ClearOutlined, SearchOutlined, CheckOutlined } from "@ant-design/icons";

interface ICommonButtonProps {
  text: string;
}
const CommonButton = ({ text }: ICommonButtonProps) => {
  const { t } = useTranslation();
  const icon = text === "search" ? <SearchOutlined /> : <CheckOutlined />;

  return (
    <Space>
      <Button danger icon={<ClearOutlined />} type="primary" htmlType="reset">
        {t("clear")}
      </Button>

      <Button icon={icon} type="primary" htmlType="submit">
        {t(text)}
      </Button>
    </Space>
  );
};

export default CommonButton;
