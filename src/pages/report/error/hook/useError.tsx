import { Form, message, TableProps } from "antd";
import { useContext, useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import dayjs from "dayjs";
import { reportApi } from "../../../../service/CallApi";
import { ITeamErrorReportType } from "../../../../type/main.interface";
import { formatIndex, formatString, searchDateRange } from "../../../../function/CommonFunction";
import { Api } from "../../../../context/ApiContext";

export const useError = () => {
  const { t } = useTranslation();
  const { companyList } = useContext(Api);

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [form] = Form.useForm();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [apiData, setApiData] = useState<ITeamErrorReportType[] | undefined>();
  //   const [apiData2, setApiData2] = useState<ITotalValueType | undefined>();
  const [userInput, setUserInput] = useState();

  const initialValues = {
    searchDate: searchDateRange("day"),
    companyID: "all",
    staffCode: "all",
  };
  useEffect(() => {
    handleGetErrorSummary(initialValues);
  }, []);

  async function handleGetErrorSummary(values: any) {
    setIsLoading(true);
    setUserInput(values);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      startDate: dayjs(values?.searchDate[0]).format("YYYY-MM-DD HH:mm:ss"),
      endDate: dayjs(values?.searchDate[1]).format("YYYY-MM-DD HH:mm:ss"),
      type: values?.type,
      companyID: values?.companyID,
      staffCode: values?.staffCode,
    };
    await reportApi("/error-report", object)
      .then((result) => {
        setApiData(result.data);
        setIsLoading(false);
      })
      .catch((error) => {
        message.error(error?.response?.data?.message);
      });
    setIsLoading(false);
  }

  const columns: TableProps<ITeamErrorReportType>["columns"] = [
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
      title: t("staffCode"),
      dataIndex: "userID",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("errorCount"),
      dataIndex: "errorCount",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "green" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("errorAmount(RM)"),
      dataIndex: "errorAmount",
      ellipsis: true,
      render: (text: string) => {
        return <div style={{ fontWeight: "600", color: "red" }}>{formatString(text)}</div>;
      },
    },
  ];

  return { t, companyList, form, isLoading, userInput, initialValues, columns, apiData, handleGetErrorSummary };
};
