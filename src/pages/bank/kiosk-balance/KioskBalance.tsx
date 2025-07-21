import { Card, Table } from "antd";
import { useKioskBalance } from "./hook/useKioskBalance";
import EditKioskBalance from "./modal/EditKioskBalance";

const KioskBalance = () => {
  const { t, isLoading, apiData2, openEditKioskBalance, selectedRecord, handleCloseModalEditBankBalance, setOpenEditKioskBalance, columnsCompanyGP, handleGetCompanyGPList } = useKioskBalance();

  console.log(openEditKioskBalance);
  return (
    <div>
      <Card title={t("kiosk balance")} loading={isLoading}>
        <Table columns={columnsCompanyGP} dataSource={apiData2} rowKey="srno" scroll={{ x: true }} pagination={false}></Table>
      </Card>

      {openEditKioskBalance && <EditKioskBalance openEditKioskBalance={openEditKioskBalance} setOpenEditKioskBalance={setOpenEditKioskBalance} selectedRecord={selectedRecord} handleCloseModalEditBankBalance={handleCloseModalEditBankBalance} handleGetCompanyGPList={handleGetCompanyGPList} />}
    </div>
  );
};

export default KioskBalance;
