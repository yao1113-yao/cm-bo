import { Col, Form, Input, Modal, Row } from "antd";
import { useContext, useState } from "react";
import CommonButton from "../../../../../components/CommonButton";
import Device from "../../../../../components/Device";
import { LogApi } from "../../../../../service/CallApi";
import { Api } from "../../../../../context/ApiContext";
import dayjs from "dayjs";

const EditBankAdjustment = ({ messageApi, selectedPendingDeposit, editBankAdjustment, setEditBankAdjustment, handleGetBankErrorReport, allBankList }: any) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const { subdomain } = useContext(Api);
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [form] = Form.useForm();

  async function handleEditBankAdjustment(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      bankAdjustmentSrno: selectedPendingDeposit?.srno,
      bankCode: values?.bankCode,
      amount: values?.amount,
      remark: values?.remark,
    };
    await LogApi("/edit-bank-adjustment", object)
      .then(() => {
        form.resetFields();
        messageApi.open({
          type: "success",
          content: "Edit Success",
        });
        form.setFieldValue("searchDate", [dayjs().subtract(6, "hour"), dayjs()]);
        handleGetBankErrorReport({ searchDate: [dayjs().subtract(6, "hour"), dayjs()], staffSrno: 0, bank: "all", remark: "" });
        setEditBankAdjustment(false);
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  return (
    <Modal width="70vw" open={editBankAdjustment} onCancel={() => setEditBankAdjustment(!editBankAdjustment)} footer={null} closable={false} loading={isLoading}>
      <Form layout="vertical" initialValues={selectedPendingDeposit} onFinish={handleEditBankAdjustment}>
        <Row gutter={10}>
          <Col xs={6}>
            <Device list={allBankList} label="bankCode" selectAll={false} required />
          </Col>
          <Col xs={6}>
            <Form.Item label={"amount"} name="amount">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label={"remark"} name="remark">
              <Input />
            </Form.Item>
          </Col>
          <Col xs={6}>
            <Form.Item label=" ">
              <CommonButton text="search" />
            </Form.Item>
          </Col>
        </Row>
      </Form>
    </Modal>
  );
};

export default EditBankAdjustment;
