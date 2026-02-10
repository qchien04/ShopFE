import type { MessageInstance } from 'antd/es/message/interface';

let messageApi: MessageInstance;

export const setMessageApi = (api: MessageInstance) => {
  messageApi = api;
};

export const antdMessage = {
  success: (content: string) => messageApi?.success(content),
  error: (content: string) => messageApi?.error(content),
  warning: (content: string) => messageApi?.warning(content),
  info: (content: string) => messageApi?.info(content),
};
