import { Card, Form, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import CommonButton from "../../../components/CommonButton";
import { useRHBBank } from "./hook/useRHBBank";

const RHBBank = () => {
  const { form, contextHolder, isLoading, handleInsertMaybankTransaction } = useRHBBank();

  return (
    <div>
      {contextHolder}{" "}
      <Card title="Cimb Bank" loading={isLoading}>
        <Form onFinish={handleInsertMaybankTransaction} form={form}>
          <Form.Item name="transaction">
            <TextArea style={{ height: "30vh" }} />
          </Form.Item>

          <CommonButton text="submit" />
        </Form>
      </Card>
      <Table />
    </div>
  );
};

export default RHBBank;
