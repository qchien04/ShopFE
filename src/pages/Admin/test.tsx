import { Button, Input } from "antd";
import { adminApi } from "../../api/admin.api";
import { useState } from "react";

const Test = () => {
  const [cfDomain,setDomain]=useState<string>("");
  
  const confirmWebhook = async () => {
    try {
      console.log(cfDomain)
      const url=await adminApi.confirmWebhook(cfDomain)
      console.log(url)

    } catch (err) {
      console.error(err);
    }
  };


  const onADmin = async () => {
    try {
      const url=await adminApi.payUpdate()

      console.log(url)

    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{width:300,display:"flex",flexDirection:"column",gap:10}}>
    <Input onChange={(e)=>setDomain(e.target.value)} />
    <Button type="primary" block onClick={confirmWebhook}>
      confirmWebhook
    </Button>

    <Button block onClick={onADmin}>
      ADMIN (kiểm tra các đơn thanh toán)
    </Button>
    </div>
    
  );
};

export default Test;
