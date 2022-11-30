import{busStopsData} from "@/api";
import{busEstimatedTime} from "@/api";


const actions = {
    async getBusStopsData(context,{city,RouteUID}){
        let result = await busStopsData(city,RouteUID);
        if(result.status == 200){
            context.commit("GETBUSSTATIONDATA",result.data);
            return "OK";
        }else{
            return Promise.reject(new Error("faile"));
        }
    },
    async getbusEstimatedTime(context,{city,RouteUID}){
        let result = await busEstimatedTime(city,RouteUID);
        if(result.status == 200){
            context.commit("GETBUSESTIMATEDTIME",result.data);
            return "OK";
        }else{
            return Promise.reject(new Error("faile"));
        }
    },
}

const mutations = {
    GETBUSSTATIONDATA(state,data){
        state.busStopsData = data;
    },
    GETBUSESTIMATEDTIME(state,data){
        state.estimatedTime = data;
    }

}

const state = {
    busStopsData:[],
    estimatedTime:[],
}

const getters = {

}

export default {
    namespaced:true,
    actions,
    mutations,
    state,
    getters
}