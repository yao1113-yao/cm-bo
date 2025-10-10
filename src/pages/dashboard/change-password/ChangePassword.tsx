import { Button, Card, Col, Divider, Form, Input, message, Row, Table, TableProps, Tag, Tooltip } from "antd";
import GameProvider from "../../../components/GameProvider";
import { useTranslation } from "react-i18next";
import { useContext, useEffect, useRef, useState } from "react";
import { IGameProviderType, ITransactionType } from "../../../type/main.interface";
import { getAllGameProviderList } from "../../../function/ApiFunction";
import CommonButton from "../../../components/CommonButton";
import { mainApi } from "../../../service/CallApi";
import { RobotOutlined } from "@ant-design/icons";
import { formatDateTime, formatString } from "../../../function/CommonFunction";
import Swal from "sweetalert2";
import { Api } from "../../../context/ApiContext";
import { CheckOutlined } from "@ant-design/icons";
// interface DepositProps extends React.HTMLAttributes<HTMLElement> {
//   type: string;
// }

const ChangePassword = () => {
  const { t } = useTranslation();
  const [form] = Form.useForm();
  const [form1] = Form.useForm();
  const { userInfo, subdomain } = useContext(Api);

  const [messageApi, contextHolder] = message.useMessage();

  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");
  const userType = localStorage.getItem("userType");
  const [isLoading, setIsLoading] = useState<boolean>(false);
  console.log(isLoading);
  const [passwordRandom, setPasswordRandom] = useState<string>("");
  console.log(passwordRandom);
  const [apiData, setApiData] = useState<ITransactionType[]>([]);
  const [allGameList, setAllGameList] = useState<[IGameProviderType] | undefined>();

  useEffect(() => {
    getAllGameProviderList(setIsLoading, setAllGameList);
    handleGetPendingTransactionRecord("ChangePassword");

    const intervalId = setInterval(() => {
      handleGetPendingTransactionRecord("ChangePassword");
    }, 10000);

    return () => {
      clearInterval(intervalId); // Clear the interval on unmount
    };
  }, []);

  async function handleChangePlayerPassword(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      ...values,
    };
    await mainApi("/change-player-password", object)
      .then(() => {
        form.resetFields();
        handleGetPendingTransactionRecord("ChangePassword");

        messageApi.open({
          type: "success",
          content: "Waiting Bot",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  async function handleCheckPlayerBalance(values: any) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      companyID: subdomain,
      ...values,
    };
    await mainApi("/check-player-balance", object)
      .then(() => {
        form1.resetFields();
        handleGetPendingTransactionRecord("ChangePassword");

        messageApi.open({
          type: "success",
          content: "Waiting Bot",
        });
      })
      .catch(() => {
        messageApi.open({
          type: "error",
          content: "player ID not found",
        });
      });
    setIsLoading(false);
  }

  function generateRandomString(length = 10) {
    const small = "abcdefghjkmnopqrstuvwxyz";
    const big = "ABCDEFGHJKMNOPQRSTUVWXYZ";
    const number = "0123456789";

    // Generate 1 random big
    const bigPart = Array.from({ length: 1 }, () => big.charAt(Math.floor(Math.random() * big.length))).join("");

    const smallPart = Array.from({ length: 1 }, () => small.charAt(Math.floor(Math.random() * small.length))).join("");

    // Generate the rest of the string with alphanumeric characters
    const numberPart = Array.from({ length: length - 2 }, () => number.charAt(Math.floor(Math.random() * number.length))).join("");

    setPasswordRandom(bigPart + smallPart + numberPart);
    form.setFieldValue("password", bigPart + smallPart + numberPart);
  }

  const columns: TableProps<ITransactionType>["columns"] = [
    {
      title: "action",
      render: (record: any) => {
        return (
          <>
            {userInfo?.userType === 3 && record?.isSeen === 1 ? (
              <Tooltip title={t("Noted")}>
                <Button onClick={() => handleNotedTransaction(record)}>
                  <CheckOutlined />
                </Button>
              </Tooltip>
            ) : (
              ""
            )}
          </>
        );
      },
    },
    {
      title: t("recordType"),
      dataIndex: "recordType",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("status"),
      dataIndex: "mStatus",
      align: "center",
      render: (text: string, record) => {
        return record?.isSeen === 1 ? <Tag color="#87d068">DONE</Tag> : text === "PROCESSING" ? <Tag color="#2db7f5">PROCESSING</Tag> : text === "SUCCESS" ? <Tag color="yellow">SUCCESS</Tag> : <Tag color="#f50">BOT FAIL</Tag>;
      },
    },
    // {
    //   title: t("staff"),
    //   dataIndex: "mStaff",
    //   align: "center",
    //   render: (text: string) => {
    //     return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
    //   },
    // },
    {
      title: t("game"),
      dataIndex: "mGame",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("gameID"),
      dataIndex: "gameID",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("password"),
      dataIndex: "password",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("balance"),
      dataIndex: "balance",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("name"),
      dataIndex: "name",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("hpNo"),
      dataIndex: "hpNo",

      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("systemRemark"),
      dataIndex: "sysRemark1",
      align: "center",
      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatString(text)}</div>;
      },
    },
    {
      title: t("createDate"),
      dataIndex: "createDate",
      align: "center",

      render: (text: string) => {
        return <div style={{ fontWeight: "600" }}>{formatDateTime(text)}</div>;
      },
    },
  ];

  async function handleNotedTransaction(values: any) {
    Swal.fire({
      title: "Confirm to noted the transaction?",
      showCancelButton: true,
      confirmButtonText: "Noted",
    }).then(async (result) => {
      if (result.isConfirmed) {
        setIsLoading(true);
        const object = {
          UserID: userID,
          UserToken: userToken,
          UserType: userType,
          mktDetailsSrno: values?.srno,
          status: 1,
        };
        await mainApi("/update-transaction-status", object)
          .then(() => {
            handleGetPendingTransactionRecord("ChangePassword");
            messageApi.open({
              type: "success",
              content: "done",
            });
          })
          .catch(() => {
            messageApi.open({
              type: "error",
              content: "",
            });
          });
      }

      setIsLoading(false);
    });
  }

  async function handleGetPendingTransactionRecord(type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      UserType: userType,
      type: type,
      companyID: subdomain,

      RecordType: "ChangePassword",
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      setApiData(result.data);
    });
    setIsLoading(false);
  }

  const samePrev = useRef<boolean>(false);
  const prevClass = useRef<string>("row-highlight-1");

  const rowClassName = (record: any, index: number) => {
    samePrev.current = index > 0 ? record.mktSrno === apiData[index - 1]?.mktSrno : true;
    if (index === 0) prevClass.current = "row-highlight-1";
    if (samePrev.current) return prevClass.current;
    else {
      prevClass.current = prevClass.current === "row-highlight-1" ? "row-highlight-2" : "row-highlight-1";
      return prevClass.current;
    }
  };
  return (
    <>
      {contextHolder}
      <Divider>{t("change player password")}</Divider>
      <Card>
        <Form layout="vertical" onFinish={handleChangePlayerPassword} form={form}>
          <Row gutter={10}>
            <Col xs={4}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
            </Col>

            <Col xs={4}>
              <Form.Item label={t("gameLoginID")} name="gameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
            <Col xs={4}>
              <Form.Item label={t("password")} name="password" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input suffix={<RobotOutlined onClick={() => generateRandomString(8)} />} />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="submit" />
        </Form>

        <Divider>{t("check game balance")}</Divider>
        <Form layout="vertical" onFinish={handleCheckPlayerBalance} form={form1}>
          <Row gutter={10}>
            <Col xs={4}>
              <GameProvider list={allGameList} required={true} selectAll={false} label="game" />
            </Col>

            <Col xs={4}>
              <Form.Item label={t("gameLoginID")} name="gameLoginID" rules={[{ required: true, message: t("pleaseSelect") }]}>
                <Input autoComplete="off" />
              </Form.Item>
            </Col>
          </Row>

          <CommonButton text="submit" />
        </Form>
        <Divider>{t("record")}</Divider>

        <Card>
          <Table columns={columns} dataSource={apiData} scroll={{ x: true }} pagination={false} rowClassName={rowClassName} rowHoverable={false} />
        </Card>
      </Card>
    </>
  );
};

export default ChangePassword;
