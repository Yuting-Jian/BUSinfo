import VueRouter from "vue-router";
import Vue from "vue";
import routes from "./routes"

Vue.use(VueRouter);

let originPush = VueRouter.prototype.push;
let originReplace = VueRouter.prototype.replace;

VueRouter.prototype.push = function(location,resolve=()=>{},reject=()=>{}){
    originPush.call(this,location,resolve,reject);
}
VueRouter.prototype.replace = function(location,resolve=()=>{},reject=()=>{}){
    originReplace.call(this,location,resolve,reject);
}

export default new VueRouter({
    routes,
});