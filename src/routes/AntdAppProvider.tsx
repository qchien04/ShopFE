import { App } from 'antd';
import { useEffect } from 'react';
import { setMessageApi } from '../utils/antdMessage';
import { setModalApi } from '../utils/antdModal';

export default function AntdAppProvider({ children }: { children: React.ReactNode }) {
  const { message, modal } = App.useApp();

  useEffect(() => {
    setMessageApi(message);
    setModalApi(modal);
  }, [message]);

  return <>{children}</>;
}
