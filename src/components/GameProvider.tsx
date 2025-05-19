import { Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { IGameProviderType } from "../type/main.interface";

interface IGameProviderSelectListProps {
  list: [IGameProviderType] | undefined;
  required: boolean;
  selectAll: boolean;
  label: string;
}

const GameProvider = ({ list, required = false, selectAll = true, label = "game" }: IGameProviderSelectListProps) => {
  const { t } = useTranslation();

  return (
    <Form.Item label={t(label ? label : "game")} name={label} rules={[{ required: required }]}>
      <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t(label)} optionFilterProp="label">
        {selectAll && <Select.Option value="all">{t("all")}</Select.Option>}
        {list?.map((items: any) => (
          <Select.Option value={items.gameName} key={items.gameName}>
            {items?.gameName}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default GameProvider;
