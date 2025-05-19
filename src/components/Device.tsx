import { Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { IDeviceType } from "../type/main.interface";

interface IDeviceSelectListProps {
  list: [IDeviceType] | undefined;
  required: boolean;
  selectAll: boolean;
  label: string;
}

const Device = ({ list, required = false, selectAll = true, label = "device" }: IDeviceSelectListProps) => {
  const { t } = useTranslation();

  return (
    <Form.Item label={t(label ? label : "device")} name={label} rules={[{ required: required }]}>
      <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t(label)} optionFilterProp="label">
        {selectAll && <Select.Option value="all">{t("all")}</Select.Option>}
        {list?.map((items: any) => (
          <Select.Option value={items.item} key={items.item}>
            {items?.item}
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default Device;
