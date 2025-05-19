import { Card, Form, Table } from "antd";
import TextArea from "antd/es/input/TextArea";
import CommonButton from "../../../components/CommonButton";
import { useCimbBank } from "./hook/useCimbBank";
import { useEffect, useState } from "react";
import axios from "axios";

const CimbBank = () => {
  const { form, contextHolder, isLoading, handleInsertMaybankTransaction } = useCimbBank();
  const [csvData, setCsvData] = useState([]);

  const [test, setTest] = useState<string>("");
  const change = (a, b) => {
    setTest(b.transaction);
  };
  console.log(test);

  useEffect(() => {
    fetchCSVData(); // Fetch the CSV data when the component mounts
  }, []);

  const fetchCSVData = () => {
    const csvUrl = "https://docs.google.com/spreadsheets/d/e/2PACX-1vQQ9QaLvbFd-ylgJgsO6xTpebiCEO7iZkXjC_TdzuN0xpL-GUhaVjgNb3xbB3sSrBFwwPtCxJfM7Yd2/pub?output=csv"; // Replace with your Google Sheets CSV file URL

    axios
      .get(csvUrl) // Use Axios to fetch the CSV data
      .then((response) => {
        console.log(response.data);
        const parsedCsvData = parseCSV(response.data); // Parse the CSV data into an array of objects
        // setCsvData(parsedCsvData); // Set the fetched data in the component's state
        console.log(parsedCsvData); // Now you can work with 'csvData' in your component's state.
      })
      .catch((error) => {
        console.error("Error fetching CSV data:", error);
      });
  };

  function parseCSV(csvText) {
    const rows = csvText.split(/\r?\n/); // Use a regular expression to split the CSV text into rows while handling '\r'
    const headers = rows[0].split(","); // Extract headers (assumes the first row is the header row)
    const data = []; // Initialize an array to store the parsed data
    for (let i = 1; i < rows.length; i++) {
      const rowData = rows[i].split(","); // Use the regular expression to split the row while handling '\r'
      const rowObject = {};
      for (let j = 0; j < headers.length; j++) {
        rowObject[headers[j]] = rowData[j];
      }
      data.push(rowObject);
    }
    return data;
  }

  return (
    <div>
      {contextHolder}
      <Card title="Cimb Bank" loading={isLoading}>
        <Form onFinish={handleInsertMaybankTransaction} form={form} onValuesChange={change}>
          <Form.Item name="transaction">
            <TextArea style={{ height: "30vh" }} />
          </Form.Item>

          <CommonButton text="submit" />
        </Form>
      </Card>

      <p style={{ whiteSpace: "pre-wrap" }}>{test}</p>
      {/* <Table /> */}
    </div>
  );
};

export default CimbBank;
