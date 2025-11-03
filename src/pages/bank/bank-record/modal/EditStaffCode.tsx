import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Api } from "../../../../context/ApiContext";
import { Col, Form, Modal, Row, Select, Spin } from "antd";
import { getAllStaffList } from "../../../../function/ApiFunction";
import { IUserType } from "../../../../type/main.interface";
import CommonButton from "../../../../components/CommonButton";
import { bankApi } from "../../../../service/CallApi";

const EditStaffCode = ({ messageApi, changeStaffCodeModal, selected, setChangeStaffCodeModal, handleGetBankRecordMarketingList, setSelected, userInput }: any) => {
  const { t } = useTranslation();
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [allStaffList, setAllStaffList] = useState<[IUserType] | undefined>();

  useEffect(() => {
    getAllStaffList(setIsLoading, subdomain, setAllStaffList);
  }, []);

  async function handleEditTransactionDetails(values: any) {
    setIsLoading(true);
    console.log(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      ListStaffCodeSrno: selected,
      staffCode: values?.staffCode,
    };
    console.log(object);
    await bankApi("/edit-staff-code", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "edit-staff-code",
        });
        setChangeStaffCodeModal(false);
        setSelected(undefined);
        handleGetBankRecordMarketingList(userInput);
      })
      .catch((error) => {
        messageApi.open({
          type: "error",
          content: error?.response?.data?.message,
        });
      });
    setIsLoading(false);
  }

  return (
    <Modal width="70vw" open={changeStaffCodeModal} onCancel={() => setChangeStaffCodeModal(false)} footer={null} closable={false}>
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical" onFinish={handleEditTransactionDetails}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("staffCode")} name="staffCode" rules={[{ required: true }]}>
                <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("game")} optionFilterProp="label">
                  {allStaffList?.map((items: any) => (
                    <Select.Option value={items.gameName} key={items.gameName}>
                      {items?.gameName}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <CommonButton text="submit" />
        </Form>
      </Spin>
    </Modal>
  );
};

export default EditStaffCode;
