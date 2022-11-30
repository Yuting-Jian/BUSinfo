import axios from "axios";
import {GetAuthorizationHeader} from "@/utils/tdx_token"


const request = axios.create({
    baseURL:"https://tdx.transportdata.tw/api",
    timeout:3000,
});

request.interceptors.request.use(async(config)=>{
    
    const token = localStorage.getItem("tdx_token");
    const time = localStorage.getItem("tdx_time");
    const currentTime = new Date().getTime();

    if(!token || (currentTime - time) > 86000000){
        try{
            await GetAuthorizationHeader();
        }catch(e){
            console.log(e);
        }       
    }

    config.headers = {authorization:`Bearer ${localStorage.getItem("tdx_token")}`}

    return config
});

export default request;