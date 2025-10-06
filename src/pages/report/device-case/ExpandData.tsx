import { useEffect, useState } from "react";
import { Card, message, Table, TableProps } from "antd";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { ITeamCaseType } from "../../../type/main.interface";
import { formatIndex, formatString } from "../../../function/CommonFunction";
import { reportApi } from "../../../service/CallApi";

const ExpandData = ({ record, userInput }: any) => {
  const { t } = useTranslation();
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamCaseType[] | undefined>();

  useEffect(() => {
    handleGetTeamDeviceCaseDetails(userInput);
  }, []);

  const columns: TableProps<ITeamCaseType>["columns"] = [
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
      title: t("totalCase"),
      dataIndex: "totalCase",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },

    {
      title: t("totalDepositCase"),
      dataIndex: "totalDepositCase",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalWithdrawCase"),
      dataIndex: "totalWithdrawCase",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalDeposit(RM)"),
      dataIndex: "totalDeposit",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("totalWithdraw(RM)"),
      dataIndex: "totalWithdraw",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
  ];

  async function handleGetTeamDeviceCaseDetails(values: any) {
    setIsLoading(true);

    const object = {
      UserID: userID,
      UserToken: userToken,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      deviceID: record?.mDevice,
    };
    await reportApi("/device-case-details", object)
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
