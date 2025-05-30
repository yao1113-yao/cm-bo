import { useBankBalance } from "./hook/useBankBalance";
import { Card, Table } from "antd";
import EditBankBalance from "./modal/EditBankBalance";

const BankBalance = () => {
  const { t, isLoading, form, openEditBankBalance, handleCloseModalEditBankBalance, handleOnChangeAmount, selectedRecord, apiData, apiData2, columns, columnsCompanyGP } = useBankBalance();
  return (
    <div>
      {/* <Form>
        <Row>
          <Col xs={4}>
            <Form.Item label={t("bank")}>
              
            </Form.Item>
          </Col>
        </Row>
      </Form> */}
      {/* <Divider /> */}

      <Card title={t("bank List")} loading={isLoading}>
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} pagination={false}></Table>
      </Card>

      <Card title={t("gp List")} loading={isLoading}>
        <Table columns={columnsCompanyGP} dataSource={apiData2} rowKey="srno" scroll={{ x: true }}></Table>
      </Card>

      {openEditBankBalance && <EditBankBalance form={form} openEditBankBalance={openEditBankBalance} selectedRecord={selectedRecord} handleOnChangeAmount={handleOnChangeAmount} handleCloseModalEditBankBalance={handleCloseModalEditBankBalance} />}
    </div>
  );
};

export default BankBalance;
