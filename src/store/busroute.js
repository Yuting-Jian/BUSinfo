import {busRouteByCity} from "@/api";

const actions = {
    async getBusRouteByCity(context,{city,routeName}){
        let result = await busRouteByCity(city,routeName);
        if(result.status == 200){
            context.commit("GETBUSROUTEBYCITY",result.data);
            return "OK";
        }else{
            return Promise.reject(new Error("faile"));
        }
    }
}

const mutations = {
    GETBUSROUTEBYCITY(state,data){
        state.busData = data;
    }
}

const state = {
    busData:[],
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