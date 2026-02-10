import type { HookAPI } from 'antd/es/modal/useModal';

let modalApi: HookAPI;

export const setModalApi = (api: HookAPI) => {
  modalApi = api;
};

export const antdModal = {
  confirm: (options: Parameters<HookAPI['confirm']>[0]) =>
    modalApi?.confirm(options),

  success: (options: Parameters<HookAPI['success']>[0]) =>
    modalApi?.success(options),

  error: (options: Parameters<HookAPI['error']>[0]) =>
    modalApi?.error(options),

  warning: (options: Parameters<HookAPI['warning']>[0]) =>
    modalApi?.warning(options),

  info: (options: Parameters<HookAPI['info']>[0]) =>
    modalApi?.info(options),
};
