import { useTranslation } from "react-i18next";
import { Form, Select } from "antd";

interface IStatusListProps {
  selectAll: boolean;
  required: boolean;
}
const StatusList = ({ selectAll, required }: IStatusListProps) => {
  const { t } = useTranslation();

  return (
    <Form.Item label={t("status")} name="status" rules={[{ required: required, message: t("pleaseSelectStatus") }]}>
      <Select placeholder={t("pleaseSelect")}>
        {selectAll && <Select.Option value={9}>{t("all")}</Select.Option>}
        <Select.Option value={1}>{t("active")}</Select.Option>
        <Select.Option value={0}>{t("inactive")}</Select.Option>
      </Select>
    </Form.Item>
  );
};

export default StatusList;
