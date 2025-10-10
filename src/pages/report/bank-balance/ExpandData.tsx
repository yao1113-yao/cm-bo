import { useEffect, useState } from "react";
import { reportApi } from "../../../service/CallApi";
import { ITeamBankBalance } from "../../../type/main.interface";
import { Card, Descriptions, message, Tag } from "antd";

const ExpandData = ({ record, userInput }: any) => {
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamBankBalance[] | undefined>();

  useEffect(() => {
    handleGetTeamKioskBalance(userInput);
  }, []);

  async function handleGetTeamKioskBalance(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: record?.companyID,
      min: values?.min,
      max: values?.max,
    };
    await reportApi("/team-bank-balance-details", object)
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
                <Descriptions.Item label="Bank Code">
                  <div style={{ fontWeight: "600" }}>{items?.bankCode}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Bank Balance">
                  <div style={{ color: items?.balance <= 10000 ? "red" : "green", fontWeight: "600" }}>{items?.balance}</div>
                </Descriptions.Item>
                <Descriptions.Item label="Status">
                  <Tag color={items?.status === 1 ? "#389e0d" : "#f50"}>{items?.status === 1 ? "Active" : "Inactive"}</Tag>
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
