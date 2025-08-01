import { useEffect, useState } from "react";
import { Card, message, Table, TableProps } from "antd";
import { reportApi } from "../../../../service/CallApi";
import { ITeamSalesDetailsType } from "../../../../type/main.interface";
import { formatIndex, formatNumber, formatString } from "../../../../function/CommonFunction";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";

const ExpandData = ({ record, userInput }: any) => {
  const { t } = useTranslation();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamSalesDetailsType[] | undefined>();

  useEffect(() => {
    handleGetStaffSalesDetails(userInput);
  }, []);

  const columns: TableProps<ITeamSalesDetailsType>["columns"] = [
    {
      title: "#",
      render: (_any: any, _text: any, index: number) => {
        return formatIndex(index);
      },
    },
    {
      title: t("companyID"),
      dataIndex: "companyID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalDeposit(RM)"),
      dataIndex: "deposit",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalWithdraw(RM)"),
      dataIndex: "withdraw",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalProfit(RM)"),
      ellipsis: true,
      render: (record) => {
        return <div style={{ fontWeight: "600", color: record?.deposit - record?.withdraw > 0 ? "green" : record?.deposit - record?.withdraw < 0 ? "red" : "black" }}>{formatNumber(record?.deposit - record?.withdraw)}</div>;
      },
    },
  ];

  async function handleGetStaffSalesDetails(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      staffCode: record?.userID,
    };
    await reportApi("/staff-sales-details", object)
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
        <Table columns={columns} dataSource={apiData} rowKey="srno" scroll={{ x: true }} rowHoverable={false} />
      </Card>
    </div>
  );
};

export default ExpandData;
