import Vuex from "vuex";
import Vue from "vue";

Vue.use(Vuex);

import busroute from "./busroute";
import busdetail from "./busdetail";
import routeplan from "./routeplan";

export default new Vuex.Store({
    modules:{
        busroute,
        busdetail,
        routeplan
    },
});