<template>
  <div class="bd-wrapper">
    <div class="title">
        <h2>
            <i class="fa-solid fa-caret-left" @click="changeNumber(-1)" v-show="checkActive? go.length>1:back.length>1"></i>
            {{title}}
            <i class="fa-solid fa-caret-right" @click="changeNumber(1)" v-show="checkActive? go.length>1:back.length>1"></i>
        </h2>
        <div class="switch" :class="{active:!checkActive}" @click="toggle" v-show="switchShow">
            <div class="btn" :class="{active:!checkActive}" ></div>
            <span>去</span>
            <span>返</span>
        </div>
        <div class="circle" v-show="!(back.length > 0)">
            <p>循環線</p>
        </div>
    </div>
    <div class="bus-detail">
        <ul class="stoplist" >
            <li v-for="(stop,index) in busStopsList.Stops" :key="index">
                <div>
                    <p>{{stop.StopName.Zh_tw}}</p>
                    <span :class="{active: (secToMin(stop.EstimateTime) < 4) && stop.StopStatus == 0}">{{stopStatus(stop.StopStatus,stop.EstimateTime)}}</span>
                </div>
            </li>
        </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex"

export default {
    name:"BusDetail",
    data() {
        return {
            checkActive:true,
            go:[],
            back:[],
            gonumber:0,
            backnumber:0,
            timer:"",
        }
    },
    computed:{
        busStopsList(){
            if(this.checkActive){
                if(this.go[this.gonumber]){
                    this.dataComparison(this.go[this.gonumber]);
                }
                return this.go[this.gonumber] || [];
            }else{
                this.dataComparison(this.back[this.backnumber]);
                return this.back[this.backnumber] || [];
            }
        },
        switchShow(){
            let back = undefined;
            for(var i=0;i<this.back.length;i++){
                if(this.back[i].SubRouteUID == this.go[this.gonumber].SubRouteUID || this.back[i].SubRouteName.en == this.go[this.gonumber].SubRouteName.en){
                    this.backnumber = i;
                    back = this.back[i];
                    break;
                }
            }
            return back;
        },
        title(){
            if(this.checkActive){
                if(this.go.length < 1){
                    return "loading...";
                }else if(this.go.length == 1){
                    return this.go[this.gonumber].RouteName.Zh_tw
                }else{
                    return this.go[this.gonumber].SubRouteName.Zh_tw
                }
            }else{
                if(this.back.length < 1){
                    return "loading...";
                }else if(this.back.length == 1){
                    return this.back[this.backnumber].RouteName.Zh_tw
                }else{
                    return this.back[this.backnumber].SubRouteName.Zh_tw
                }
            }
            
        },
        ...mapState("busdetail",["busStopsData","estimatedTime"]),
    },
    async mounted() {
        try{
            await this.$store.dispatch("busdetail/getbusEstimatedTime",{city:this.$route.query.city,RouteUID:this.$route.query.RouteUID});
            await this.$store.dispatch("busdetail/getBusStopsData",{city:this.$route.query.city,RouteUID:this.$route.query.RouteUID});
            this.splitData();
        }catch(e){
            console.log(e);
        }
        this.timer = setInterval(async ()=>{
            try{
                await this.$store.dispatch("busdetail/getbusEstimatedTime",{city:this.$route.query.city,RouteUID:this.$route.query.RouteUID});
                await this.$store.dispatch("busdetail/getBusStopsData",{city:this.$route.query.city,RouteUID:this.$route.query.RouteUID});
                this.splitData();
            }catch(e){
                console.log(e);
            }
        },60000);
    },
    methods:{
        toggle(){
            if(!this.checkActive){
                for(let i ; i<this.go.length ; i++){
                    if(this.go[i].SubRouteUID == this.back[this.backnumber].SubRouteUID || this.go[i].SubRouteName.en == this.back[this.backnumber].SubRouteName.en){
                        this.gonumber = i;
                        break;
                    }
                }
            }
            this.checkActive = !this.checkActive;
        },
        splitData(){
            this.go = this.busStopsData.filter(item=>{
                return item.Direction == 0 && (item.SubRouteName.Zh_tw.indexOf("停駛") == -1);
            });

            this.back = this.busStopsData.filter(item=>{
                return item.Direction == 1 && (item.SubRouteName.Zh_tw.indexOf("停駛") == -1);
            });
        },
        dataComparison(data){
            if(!data.Comparison){

                data.Comparison = true;
                let Stops = data.Stops;
                if(this.estimatedTime[0].SubRouteUID){
                    for(let i=0;i<this.estimatedTime.length;i++){
                        if(this.estimatedTime[i].Direction == data.Direction && (this.estimatedTime[i].SubRouteUID == data.SubRouteUID)){
                            for(let j=0;j<Stops.length;j++){
                                if(this.estimatedTime[i].StopSequence){
                                    if(this.estimatedTime[i].StopSequence == Stops[j].StopSequence){
                                        Stops[j].EstimateTime = this.estimatedTime[i].EstimateTime;
                                        Stops[j].StopStatus = this.estimatedTime[i].StopStatus;
                                    }
                                }else{
                                    if(this.estimatedTime[i].StopUID == Stops[j].StopUID){
                                        Stops[j].EstimateTime = this.estimatedTime[i].EstimateTime;
                                        Stops[j].StopStatus = this.estimatedTime[i].StopStatus;
                                    }   
                                }
                            }
                        }
                    }
                }else{
                    for(let i=0;i<this.estimatedTime.length;i++){
                        if(this.estimatedTime[i].Direction == data.Direction){
                            for(let j=0;j<Stops.length;j++){
                                if(this.estimatedTime[i].StopSequence){
                                    if(this.estimatedTime[i].StopSequence == Stops[j].StopSequence && this.estimatedTime[i].StopUID == Stops[j].StopUID){
                                        Stops[j].EstimateTime = this.estimatedTime[i].EstimateTime;
                                        Stops[j].StopStatus = this.estimatedTime[i].StopStatus;
                                    }
                                }else{
                                    if(this.estimatedTime[i].StopUID == Stops[j].StopUID){
                                        Stops[j].EstimateTime = this.estimatedTime[i].EstimateTime;
                                        Stops[j].StopStatus = this.estimatedTime[i].StopStatus;
                                    }   
                                }
                            }
                        }
                    } 
                }
            } 
        },
        changeNumber(number){
            if(this.checkActive){
                this.gonumber += number;
                if(this.gonumber == this.go.length){
                    this.gonumber = 0;
                }else if(this.gonumber < 0 ){
                    this.gonumber = (this.go.length - 1);
                }
            }else{
                this.backnumber += number;
                if(this.backnumber == this.back.length){
                    this.backnumber = 0;
                }else if(this.backnumber < 0 ){
                    this.backnumber = (this.back.length - 1);
                }
            }    
        },
        stopStatus(status,estimatedTime){
            switch (status){
                case 0:
                    return `${this.secToMin(estimatedTime) == 0? "即將抵達":"預計"+this.secToMin(estimatedTime)+"min抵達"}`;
                case 1:
                    return `尚未發車`;
                case 2:
                    return `交管不停靠`;
                case 3:
                    return `末班車已過`;
                case 4:
                    return `今日未營運`;
            }
            
        },
        secToMin(estimatedTime){
            return Math.round(estimatedTime/60);
        }
    },
    destroyed(){
        clearInterval(this.timer);
    }
}
</script>
<style lang="less" scoped>
 .bd-wrapper{
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
                
                i{
                    display: inline-block;
                    margin: 0 10px;
                    font-size: 24px;
                    color: rgb(119, 119, 119);
                    cursor: pointer;

                    &:hover{
                        color: black;
                    }
                }
            }

            .switch{
                width: 34px;
                line-height: 22px;
                padding: 0 5px;
                border-radius: 30px;
                position: absolute;
                bottom: 8px;
                right: 24px;
                background-color: rgb(35, 156, 5);
                color: white;
                font-size: 14px;
                font-weight: 900;
                box-shadow: 0 3px 2px 1px inset rgba(0, 0, 0, 0.2);
                display: flex;
                justify-content: space-between;
                cursor: pointer;

                .btn{
                    width: 22px;
                    height: 22px;
                    position: absolute;
                    right: 0;
                    border-radius: 50%;
                    background-color: white;
                    box-shadow: 0px 2px 3px 0px rgba(102, 102, 102, 0.8),0px 0px 0px 1px rgba(148, 148, 148, 0.8);
                }

                .active{
                    left:0;
                }
            }

            .circle{
                p{
                    position: absolute;
                    bottom: 8px;
                    right: 24px;
                    font-weight: 800;
                }
            }

            .active{
                background-color: rgb(253, 31, 31);
            }

    }


    .bus-detail{
        height: calc(100% - 52px);
        background-color: white;
        border-radius: 0px 0px 20px 20px;
        box-shadow: 0 0 10px 0 rgba(114, 114, 114, 0.5);
        overflow: auto;
        box-sizing: border-box;
        padding: 0 12px 12px;

        .stoplist{
            padding: 0 12px;

            li{
                height: 48px;
                padding: 6px 12px;
                border-bottom: 1px solid rgb(192, 192, 192);
                display: flex;
                align-items: flex-end;

                div{
                    
                    p{
                        display: inline-block;
                        margin-right: 24px;
                        font-size: 20px;
                        font-weight: 900;
                    }

                    span{
                        display: inline-block;
                        padding: 5px 10px;
                        border-radius: 30px;
                        font-size: 14px;
                        font-weight: 700;
                        background-color: #CCC;
                    }

                    .active{
                        background-color: rgb(255, 208, 0);
                        color: rgb(0, 0, 0);
                    }
                }
            }
        }
    }
 }
</style>