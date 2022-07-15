import { MessageApiInjection } from "naive-ui/es/message/src/MessageProvider";
import { DialogApiInjection } from "naive-ui/es/dialog/src/DialogProvider";
import { LoadingBarApiInjection } from "naive-ui/es/dialog/src/LoadingBarProvider";

declare global {
  interface Window {
    $message: MessageApiInjection;
    $dialog: DialogApiInjection;
    $loadingBar: LoadingBarApiInjection;
  }

  interface ServerData {
    code: string;
    msg: string;
    data: object | string;
  }

  interface UserInfo {
    name: string;
  }

  interface SurveyPage {
    pageCount: number;
    data: [];
    total: number;
  }

  interface SurveyPageRaw {
    records: [];
    total: number;
    size: number;
    pages: number;
    current: number;
  }

  interface SurveyInfo {
    id: string;
    title: string;
    description: string;
    password: string;
    isActive: boolean;
    submitCount: number;
    createTime: string;
  }
}
