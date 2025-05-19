import { useEffect, useState } from "react";
import DepositTable from "../deposit/table/DepositTable";
import WithdrawTable from "../withdraw/table/WithdrawTable";
import RekemenTable from "../rekemen/table/RekemenTable";
import TransferTable from "../transfer/table/TransferTable";
import PendingDepositTable from "../deposit/table/PendingDepositTable";
import PendingTransferTable from "../transfer/table/PendingTransferTable";
import PendingRekemenTable from "../rekemen/table/PendingRekemenTable";
import PendingWithdrawTable from "../withdraw/table/PendingWithdrawTable";
import { mainApi } from "../../../service/CallApi";
import { ITransactionType } from "../../../type/main.interface";
import { Card } from "antd";

// interface DepositProps extends React.HTMLAttributes<HTMLElement> {
//   type: string;
// }

const All = () => {
  const userID = localStorage.getItem("userID");
  const userToken = localStorage.getItem("userToken");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [depositRecod, setDepositRecord] = useState<[ITransactionType] | undefined>();
  const [withdrawRecod, setWithdrawRecord] = useState<[ITransactionType] | undefined>();
  const [rekemenRecod, setRekemenRecord] = useState<[ITransactionType] | undefined>();
  const [transferRecod, setTransferRecord] = useState<[ITransactionType] | undefined>();
  const [pendingDepositRecod, setPendingDepositRecod] = useState<[ITransactionType] | undefined>();
  const [pendingWithdrawRecod, setPendingWithdrawRecod] = useState<[ITransactionType] | undefined>();
  const [pendingRekemenRecod, setPendingWRekemenRecod] = useState<[ITransactionType] | undefined>();
  const [pendingTransferRecod, setPendingTransferRecod] = useState<[ITransactionType] | undefined>();

  useEffect(() => {
    handleGetTransactionRecord("Main", "Deposit");
    handleGetTransactionRecord("Main", "Withdraw");
    handleGetTransactionRecord("Rekemen", "Rekemen");
    handleGetTransactionRecord("Transfer", "Transfer");
    handleGetPendingTransactionRecord("Main", "Deposit");
    handleGetPendingTransactionRecord("Main", "Withdraw");
    handleGetPendingTransactionRecord("Rekemen", "Rekemen");
    handleGetPendingTransactionRecord("Transfer", "Transfer");
  }, []);

  async function handleGetTransactionRecord(recordType: string, type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      RecordType: recordType,
      Type: type,
    };
    console.log(type);
    await mainApi("/transaction-record", object).then((result) => {
      if (type === "Deposit") {
        setDepositRecord(result.data);
      }
      if (type === "Withdraw") {
        setWithdrawRecord(result.data);
      }
      if (type === "Rekemen") {
        setRekemenRecord(result.data);
      }
      if (type === "Transfer") {
        setTransferRecord(result.data);
      }
    });
    setIsLoading(false);
  }

  async function handleGetPendingTransactionRecord(recordType: string, type: string) {
    setIsLoading(true);
    const object = {
      UserID: userID,
      UserToken: userToken,
      type: type,
      RecordType: recordType,
    };
    await mainApi("/pending-transaction-record", object).then((result) => {
      if (type === "Deposit") {
        setPendingDepositRecod(result.data);
      }
      if (type === "Withdraw") {
        setPendingWithdrawRecod(result.data);
      }
      if (type === "Rekemen") {
        setPendingWRekemenRecod(result.data);
      }
      if (type === "Transfer") {
        setPendingTransferRecod(result.data);
      }
    });
    setIsLoading(false);
  }
  return (
    <>
      <Card loading={isLoading}>
        <PendingDepositTable pendingDepositRecod={pendingDepositRecod} />
        <DepositTable depositgRecod={depositRecod} />
        <PendingWithdrawTable pendingWithdrawRecod={pendingWithdrawRecod} />
        <WithdrawTable withdrawRecod={withdrawRecod} />
        <PendingRekemenTable pendingRekemenRecod={pendingRekemenRecod} />
        <RekemenTable rekemenRecod={rekemenRecod} />
        <PendingTransferTable pendingTransferRecod={pendingTransferRecod} />
        <TransferTable transferRecod={transferRecod} />
      </Card>
    </>
  );
};

export default All;
