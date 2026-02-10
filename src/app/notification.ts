import { notification } from "antd";

notification.config({
  top: 24,           // khoảng cách từ top
  duration: 3,       // thời gian hiển thị mặc định
  placement: 'topRight', // vị trí
  rtl: false,
  getContainer: () => document.body, // render trực tiếp trên body
  maxCount: 3,       // số notification hiển thị tối đa
});
