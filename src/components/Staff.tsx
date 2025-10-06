import { Form, Select } from "antd";
import { useTranslation } from "react-i18next";
import { IUserType } from "../type/main.interface";

interface IStaffSelectListProps {
  list: [IUserType] | undefined;
  required: boolean;
  selectAll: boolean;
  label: string;
}

const Staff = ({ list, required = false, selectAll = true, label = "staff" }: IStaffSelectListProps) => {
  const { t } = useTranslation();

  return (
    <Form.Item label={t(label ? label : "staff")} name={label} rules={[{ required: required }]}>
      <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t(label)} optionFilterProp="label">
        {selectAll && <Select.Option value={0}>{t("all")}</Select.Option>}
        {list?.map((items: any) => (
          <Select.Option value={items.srno} key={items.srno}>
            {items?.userID} ({items?.userType === 2 ? "Cashier" : "Marketing"})
          </Select.Option>
        ))}
      </Select>
    </Form.Item>
  );
};

export default Staff;
