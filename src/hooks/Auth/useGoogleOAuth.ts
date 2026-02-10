import { useEffect } from "react";
import { useAuth } from "./useAuth";
import { useNavigate } from "react-router-dom";
import { authApi } from "../../api/auth.api";
import { APP_URL } from "../../app/const";

export const useGoogleOAuth = () => {
  const {refetch} = useAuth();
  const navigate=useNavigate();
  useEffect(() => {
    const check =async ()=>{
      const hash = window.location.hash;
      if (hash) {
        console.log("Access hash:", hash);
        const params = new URLSearchParams(hash.substring(1));
        console.log("Access params:", params);
        const act = params.get("access_token");
        if (act) {
          console.log("Access Token:", act);
          // Gửi Access Token đến Backend
          const response = await authApi.gglogin({accessToken:hash});
          console.log(response.jwt);
          localStorage.setItem("jwtToken",response.jwt);

          refetch();

          navigate("/");

        }
      }
    }
    check();
  }, []);
  const handleLoginGG = () => {
    const clientId = '82696225190-hdskhqludierkcsj1r4h9cif8kb6lq2t.apps.googleusercontent.com'; 
    const redirectUri = `${APP_URL}/login`; 
    const scope = 'openid profile email';

    const authUrl = `https://accounts.google.com/o/oauth2/v2/auth?client_id=${clientId}&redirect_uri=${redirectUri}&response_type=token&scope=${scope}&prompt=login`;

    window.location.href = authUrl;
  };

  return handleLoginGG;
};
