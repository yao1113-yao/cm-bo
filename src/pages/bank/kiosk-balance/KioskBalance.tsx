import { Card, Table } from "antd";
import { useKioskBalance } from "./hook/useKioskBalance";

const KioskBalance = () => {
  const { t, isLoading, apiData2, columnsCompanyGP } = useKioskBalance();

  return (
    <div>
      <Card title={t("kiosk balance")} loading={isLoading}>
        <Table columns={columnsCompanyGP} dataSource={apiData2} rowKey="srno" scroll={{ x: true }}></Table>
      </Card>
    </div>
  );
};

export default KioskBalance;
