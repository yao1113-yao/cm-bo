import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import { Api } from "../../../../context/ApiContext";
import { Col, Form, Modal, Row, Select, Spin } from "antd";
import { getAllStaffList } from "../../../../function/ApiFunction";
import { IUserType } from "../../../../type/main.interface";
import CommonButton from "../../../../components/CommonButton";
import { bankApi } from "../../../../service/CallApi";

const EditCashierCode = ({ messageApi, changeCashierModal, selected, setChangeCashierModal, handleGetBankRecordMarketingList, setSelected, userInput }: any) => {
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
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      ListMktDetailsSrno: selected,
      staffSrno: values?.staffSrno,
    };
    console.log(object);
    await bankApi("/edit-cashier-code", object)
      .then(() => {
        messageApi.open({
          type: "success",
          content: "edit-cashier-code",
        });
        setChangeCashierModal(false);
        setSelected([]);
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
    <Modal width="70vw" open={changeCashierModal} onCancel={() => setChangeCashierModal(false)} footer={null} closable={false} title={t("Edit Cashier Code")}>
      <Spin spinning={isLoading}>
        <Form form={form} layout="vertical" onFinish={handleEditTransactionDetails}>
          <Row gutter={20}>
            <Col xs={6}>
              <Form.Item label={t("staffCode")} name="staffSrno" rules={[{ required: true }]}>
                <Select defaultActiveFirstOption={true} filterOption={(inputValue, option: any) => option.props.children.toString().toLowerCase().includes(inputValue.toLowerCase())} showSearch style={{ width: "100%" }} placeholder={t("select") + " " + t("game")} optionFilterProp="label">
                  {allStaffList?.map(
                    (items: any) =>
                      items?.userType === 3 && (
                        <Select.Option value={items.srno} key={items.userID}>
                          {items?.userID}
                        </Select.Option>
                      )
                  )}
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

export default EditCashierCode;
