<template>
    <div class="bl-wrapper">
        <div class="title" >
            <h2 v-show="noKeelung">搜尋清單</h2>
            <h2 v-show="!noKeelung">目前沒有提供基隆公車的路線資料</h2>
        </div>
        <ul class="bus-list">
            <li v-for="(bus,index) in busData" :key="index" @click="toBusDetail($route.query.city,bus.RouteUID)" v-show="noKeelung">
                <div class="route">
                    <h3>{{bus.RouteName.Zh_tw}}</h3>
                    <div class="routedetail">
                        <p>{{bus.DepartureStopNameZh}}-{{bus.DestinationStopNameZh}}</p>
                        <p v-show="bus.SubRoutes[0].Headsign && bus.City == 'Keelung'">附屬路線:{{bus.SubRoutes[0].Headsign}}</p>
                    </div>
                </div>
                <i class="fa-solid fa-circle-chevron-right"></i>
            </li>
        </ul>
    </div>
</template>

<script>
import {mapState} from "vuex"

export default {
    name:"BusList",
    data() {
        return {
            busRouteData:[],        
        }
    },
    computed:{
        ...mapState("busroute",["busData"]),
        noKeelung(){
            return this.$route.query.city != "Keelung";
        }
    },
    methods:{
        toBusDetail(city,RouteUID){
            this.$router.push({
                path:"/busroute/busdetail",
                query:{
                    city,
                    RouteUID
                }
            });
        }
    },           
}
</script>

<style lang="less" scoped>
.bl-wrapper{
    height: calc(100% - 64px);

    .title{
            position: relative;

            h2{
                background-color: white;
                font-size: 20px;
                font-weight: 700;
                line-height: 52px;
                border-radius: 20px 20px 0 0;
                text-align: center;
                box-shadow: 0 0 10px 0 rgba(114, 114, 114, 0.5);   
            }
    }

    .bus-list{
            height: calc(100% - 52px);
            background-color: white;
            border-radius: 0px 0px 20px 20px;
            box-shadow: 0 0 10px 0 rgba(114, 114, 114, 0.5);
            overflow: auto;
            box-sizing: border-box;
            padding: 0 12px 12px;

            li{
                height: 36px;
                padding: 12px 12px;
                border-bottom: 1px solid rgb(192, 192, 192);
                display: flex;
                align-items: flex-end;
                justify-content: space-between;
                cursor: pointer;

                .route{
                    display: flex;
                    align-items: flex-end;
                    color: rgb(0, 0, 0);

                    h3{
                        font-size: 24px;
                        font-weight: 700;
                        margin-right: 6px;
                    }

                    .routedetail{
                        p{
                            font-size: 14px;
                        }   
                    }
                }

                i{
                    font-size: 20px;
                    color: rgb(255, 0, 0);
                }

                &:hover{
                    
                    i{
                        color: rgb(4, 153, 11);
                    }
                }

                &:active{
                        transform: scale(0.95);
                }
            }
    }
}
</style>