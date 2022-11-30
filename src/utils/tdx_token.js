import axios from "axios";

export async function GetAuthorizationHeader() { 
    const paramter = {
        grant_type:"client_credentials",
        client_id: "s89521825-e2d6b387-0318-4486",
        client_secret: "94f8d475-eda9-408a-a3ca-637fbcc6eeb4"
    }

    const url = "https://tdx.transportdata.tw/auth/realms/TDXConnect/protocol/openid-connect/token";

    const result = await axios({
        method: "post", 
        data:paramter,
        timeout:3000,
        url,
        headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    });

    const time = new Date().getTime();

    if(result.status == 200){
        localStorage.setItem("tdx_token",result.data.access_token);
        localStorage.setItem("tdx_time",time);
    }else{
        return Promise.reject(new Error('faile'));
    }
}