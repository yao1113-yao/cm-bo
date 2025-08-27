import { Card } from "antd";
import Deposit from "../deposit/Deposit";
import Withdraw from "../withdraw/Withdraw";
import Rekemen from "../rekemen/Rekemen";
import Transfer from "../transfer/Transfer";

// interface DepositProps extends React.HTMLAttributes<HTMLElement> {
//   type: string;
// }

const All = () => {
  // const userID = localStorage.getItem("userID");
  // const userToken = localStorage.getItem("userToken");

  // const [isLoading, setIsLoading] = useState<boolean>(false);

  // useEffect(() => {
  //   // const intervalId = setInterval(() => {
  //   //   handleGetTransactionRecord("Main", "Deposit");
  //   //   handleGetTransactionRecord("Main", "Deposit");
  //   //   handleGetTransactionRecord("Main", "Withdraw");
  //   //   handleGetTransactionRecord("Rekemen", "Rekemen");
  //   //   handleGetTransactionRecord("Transfer", "Transfer");
  //   //   handleGetPendingTransactionRecord("Main", "Deposit");
  //   //   handleGetPendingTransactionRecord("Main", "Withdraw");
  //   //   handleGetPendingTransactionRecord("Rekemen", "Rekemen");
  //   //   handleGetPendingTransactionRecord("Transfer", "Transfer");
  //   // }, 10000);
  //   // return () => {
  //   //   clearInterval(intervalId); // Clear the interval on unmount
  //   // };
  //   // handleGetTransactionRecord("Main", "Deposit");
  //   // handleGetTransactionRecord("Main", "Withdraw");
  //   // handleGetTransactionRecord("Rekemen", "Rekemen");
  //   // handleGetTransactionRecord("Transfer", "Transfer");
  //   // handleGetPendingTransactionRecord("Main", "Deposit");
  //   // handleGetPendingTransactionRecord("Main", "Withdraw");
  //   // handleGetPendingTransactionRecord("Rekemen", "Rekemen");
  //   // handleGetPendingTransactionRecord("Transfer", "Transfer");
  // }, []);

  return (
    <>
      <Card>
        <Deposit type="deposit" />
        <Withdraw type="withdraw" />
        <Rekemen type="rekemen" />
        <Transfer type="transfer" />
      </Card>
    </>
  );
};

export default All;
