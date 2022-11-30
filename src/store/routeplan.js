import {busRoutePlan} from "@/api"

const actions = {
    async getBusRoutePlan(context,positions){
        let result = await busRoutePlan(positions);
        if(result.status == 200){
            context.commit("GETBUSROUTEPLAN",result.data.data.routes);
            return "OK";
        }else{
            return Promise.reject(new Error("faile"));
        }
    }

}

const mutations = {
    GETBUSROUTEPLAN(state,data){
        state.planData = data;
    }
}

const state = {
    planData: [],
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