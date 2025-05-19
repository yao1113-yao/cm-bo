import dayjs from "dayjs";
import utc from "dayjs/plugin/utc";
import timeZone from "dayjs/plugin/timezone";
import { message, Tag } from "antd";

export const DATE_FORMAT = "YYYY-MM-DD";
export const DATE_TIME_FORMAT = "YYYY-MM-DD HH:mm:ss";

export function formatString(input: string) {
  if (input === "" || input === undefined || input === null) {
    return "-";
  } else {
    return input;
  }
}

export function formatIndex(input: number) {
  return `${input + 1}.`;
}

export function formatNumber(input: number, decimal = 2) {
  return Number(input).toLocaleString("en-US", {
    maximumFractionDigits: decimal,
    minimumFractionDigits: decimal,
  });
}

export function formatDateTime(input: any) {
  if (input === "" || input === undefined || input === null) {
    return "-";
  } else if (dayjs(input).format("YYYY-MM-DD HH:mm:ss") <= "1900-01-01 00:00:00") {
    return "-";
  } else {
    return dayjs(input).format("YYYY-MM-DD HH:mm:ss");
  }
}

export function searchDateRange(range: "day" | "month" | "year") {
  return [dayjs().startOf(range), dayjs().endOf(range)];
}

export function formatStatus(input: any, t: any) {
  if (input === 1) {
    return <Tag color="#389e0d">{t("active")}</Tag>;
  } else {
    return <Tag color="#f50">{t("inActive")}</Tag>;
  }
}

export function trimFormInput(form: any, event: any) {
  const inputId = event.target.id;
  const inputVal = event.target.value;
  const trimString = String(inputVal).trim();

  form.setFieldsValue({
    [inputId]: trimString,
  });

  return;
}

export function handleCopyAndPaste(Component: any, values: any, t: any) {
  if (Component === "RegisterPlayer") {
    const text = `PlayerID : ${values?.playerID}\nPassword : ${values?.password}`;
    navigator.clipboard.writeText(text);
  } else if (Component === "RegisterAgent") {
    const text = `AgentID : ${values?.agentID}\nPassword : ${values?.password}${values?.agentType === 3 && `\nApiToken : ${values?.apiToken}`} `;
    navigator.clipboard.writeText(text);
  }
  message.success(t("copySuccess"));
}

export function selectFilter(input: string, option: any) {
  const temp = typeof option.children === "string" ? option.children : option.children.join("");
  return temp.toLowerCase().includes(input.toLowerCase());
}
