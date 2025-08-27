import { Badge, Button, Card, Col, Divider, Row } from "antd";
import { useDashboard } from "./hook/useDashboard";
import "./dashboard.scss";
import Deposit from "./deposit/Deposit";
import Withdraw from "./withdraw/Withdraw";
import Rekemen from "./rekemen/Rekemen";
import Transfer from "./transfer/Transfer";
import All from "./all/All";
import ChangePassword from "./change-password/ChangePassword";

const Dashboard = () => {
  const { t, type, userInfo, handleOnChangeType, count } = useDashboard();

  console.log(count);

  return (
    <div className="dashboard-container">
      <Card className="user-input">
        <Row gutter={20}>
          {userInfo?.userType !== 3 && (
            <Col xs={4}>
              <Button style={{ width: "100%", backgroundColor: type === "all" ? "#bfbfbf" : "" }} onClick={() => handleOnChangeType("all")}>
                {t("all")}
              </Button>
            </Col>
          )}

          <Col xs={4}>
            <Button style={{ width: "100%", backgroundColor: type === "deposit" ? "#bfbfbf" : "" }} onClick={() => handleOnChangeType("deposit")}>
              {t("deposit")} <Badge count={count?.countDeposit} showZero></Badge>
            </Button>
          </Col>

          <Col xs={4}>
            <Button style={{ width: "100%", backgroundColor: type === "withdraw" ? "#bfbfbf" : "" }} onClick={() => handleOnChangeType("withdraw")}>
              {t("withdraw")} <Badge count={count?.countWithdraw} showZero></Badge>
            </Button>
          </Col>

          <Col xs={4}>
            <Button style={{ width: "100%", backgroundColor: type === "rekemen" ? "#bfbfbf" : "" }} onClick={() => handleOnChangeType("rekemen")}>
              {t("rekemen")} <Badge count={count?.countRekemen} showZero></Badge>
            </Button>
          </Col>

          <Col xs={4}>
            <Button style={{ width: "100%", backgroundColor: type === "transfer" ? "#bfbfbf" : "" }} onClick={() => handleOnChangeType("transfer")}>
              {t("transfer")} <Badge count={count?.countTransfer} showZero></Badge>
            </Button>
          </Col>

          <Col xs={4}>
            <Button style={{ width: "100%", backgroundColor: type === "changePassword" ? "#bfbfbf" : "" }} onClick={() => handleOnChangeType("changePassword")}>
              {t("changePassword")}
            </Button>
          </Col>
        </Row>

        <Divider style={{ margin: "0px" }}>{t("details")}</Divider>

        {type === "all" ? <All /> : type === "deposit" ? <Deposit type={type} /> : type === "withdraw" ? <Withdraw type={type} /> : type === "rekemen" ? <Rekemen type={type} /> : type === "transfer" ? <Transfer type={type} /> : type === "changePassword" ? <ChangePassword /> : ""}
      </Card>

      {/* <Divider>{t("withdrawRecord")}</Divider>

      <Card>
        <Table columns={columns} dataSource={withdrawRecord} scroll={{ x: true }} />
      </Card> */}
    </div>
  );
};

export default Dashboard;
