import { useBankBalance } from "./hook/useBankBalance";
import { Card, Table } from "antd";
import EditBankBalance from "./modal/EditBankBalance";

const BankBalance = () => {
  const { t, isLoading, form, openEditBankBalance, setOpenEditBankBalance, handleCloseModalEditBankBalance, selectedRecord, apiData, columns, handleGetCompanyBankList } = useBankBalance();

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
      {/* 
      <Card title={t("gp List")} loading={isLoading}>
        <Table columns={columnsCompanyGP} dataSource={apiData2} rowKey="srno" scroll={{ x: true }}></Table>
      </Card> */}

      {openEditBankBalance && <EditBankBalance form={form} openEditBankBalance={openEditBankBalance} setOpenEditBankBalance={setOpenEditBankBalance} selectedRecord={selectedRecord} handleCloseModalEditBankBalance={handleCloseModalEditBankBalance} handleGetCompanyBankList={handleGetCompanyBankList} />}
    </div>
  );
};

export default BankBalance;
