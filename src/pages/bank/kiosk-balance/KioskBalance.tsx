import { Card, Table } from "antd";
import { useKioskBalance } from "./hook/useKioskBalance";
import EditKioskBalance from "./modal/EditKioskBalance";
import { useState } from "react";
import ExpandData from "./ExpandData";

const KioskBalance = () => {
  const { t, isLoading, apiData2, openEditKioskBalance, selectedRecord, handleCloseModalEditBankBalance, setOpenEditKioskBalance, columnsCompanyGP, handleGetCompanyGPList } = useKioskBalance();
  const [expandedRowKeys, setExpandedRowKeys] = useState<string[]>([]);

  function handleTableRowExpand(expended: any, record: any) {
    const keys = [];

    if (expended) {
      keys.push(record.gameName);
    }

    setExpandedRowKeys(keys);
  }
  return (
    <div>
      <Card title={t("kiosk balance")} loading={isLoading}>
        <Table
          columns={columnsCompanyGP}
          dataSource={apiData2}
          rowKey="gameName"
          scroll={{ x: true }}
          pagination={false}
          expandable={{
            expandedRowKeys: expandedRowKeys,
            onExpand: handleTableRowExpand,
            expandedRowRender: (record) => {
              if (record.gameName === expandedRowKeys[0]) {
                return (
                  <div>
                    <ExpandData record={record} />
                  </div>
                );
              }
            },
          }}
        ></Table>
      </Card>

      {openEditKioskBalance && <EditKioskBalance openEditKioskBalance={openEditKioskBalance} setOpenEditKioskBalance={setOpenEditKioskBalance} selectedRecord={selectedRecord} handleCloseModalEditBankBalance={handleCloseModalEditBankBalance} handleGetCompanyGPList={handleGetCompanyGPList} />}
    </div>
  );
};

export default KioskBalance;
