import { Card, Form, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import CommonButton from "../../../components/CommonButton";
import { useMaybank } from "./hook/useMaybank";

const Maybank = () => {
  const { form, contextHolder, isLoading, handleInsertMaybankTransaction } = useMaybank();

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

export default Maybank;
