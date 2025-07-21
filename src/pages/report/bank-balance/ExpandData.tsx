import { useEffect, useState } from "react";
import { reportApi } from "../../../service/CallApi";
import { ITeamKioskBalance } from "../../../type/main.interface";
import { Card, Descriptions, message } from "antd";

const ExpandData = ({ record, userInput }: any) => {
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamKioskBalance[] | undefined>();

  useEffect(() => {
    handleGetTeamKioskBalance(userInput);
  }, []);

  async function handleGetTeamKioskBalance(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      companyID: record?.companyID,
      min: values?.min,
      max: values?.max,
    };
    await reportApi("/team-kiosk-balance-details", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  return (
    <div>
      <Card loading={isLoading}>
        <Descriptions column={3} bordered>
          {apiData?.map((items) => {
            return (
              <>
                <Descriptions.Item label="Game Name">{items?.gameName}</Descriptions.Item>
                <Descriptions.Item label="Balance System">
                  <div style={{ color: items?.balance <= 10000 ? "red" : "green", fontWeight: "600" }}>{items?.balance}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Balance Game Provider">
                  <div style={{ color: items?.balanceGP <= 10000 ? "red" : "green", fontWeight: "600" }}>{items?.balanceGP}</div>
                </Descriptions.Item>
              </>
            );
          })}
        </Descriptions>
      </Card>
    </div>
  );
};

export default ExpandData;
