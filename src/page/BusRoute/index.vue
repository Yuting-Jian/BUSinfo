<template>
    <div class="br-wrapper">
        <div class="data-input">
            <select v-model="city">
                <option v-for="(city,index) in citylist" :key="index" :value="city.enName">{{city.name}}</option>
            </select>
            <input v-model="routeName" type="text" placeholder="請輸入公車路線，例: 307、紅10、265">
            <button type="button" v-show="routeName" @click="removeInput"><i class="fa-solid fa-xmark"></i></button>
        </div>
        <router-view></router-view>
    </div> 
</template>

<script>
import citylist from "@/utils/citylist"

export default {
    name:"BusRoute",
    data() {
        return {
            citylist,
            routeName:"",
            city:"Taipei",
        }
    },
    async mounted(){
        if(this.$route.path.indexOf("/busdetail") == -1){
            try{
                await this.$store.dispatch("busroute/getBusRouteByCity",{city:this.city,routeName:this.routeName});
            }catch(e){
                console.log(e);
            }
            this.$router.push({
                path:"/busroute/buslist",
                query:{
                    city:this.city,
                }
            });
        }
    },
    methods:{
        removeInput(){
            this.routeName = "";
        },
        async searchBuslist(){
            try{
                await this.$store.dispatch("busroute/getBusRouteByCity",{city:this.city,routeName:this.routeName});
            }catch(e){
                console.log(e);
            }
            this.$router.push({
                path:"/busroute/buslist",
                query:{
                    city:this.city,
                }
            });
        },  
    },
    watch:{
        routeName:{          
            handler(newValue,oldValue){
                this.searchBuslist();
            }
        },
        city:{           
            handler(newValue,oldValue){
                this.searchBuslist();
            }
        }
    }
}
</script>

<style lang="less" scoped>
    .br-wrapper{
        height: 100%;

        .data-input{
            padding-bottom: 24px;
            display: flex;
            justify-content: center;
            align-items: center;
            position: relative;

            input,select{
                height: 40px;
                border: 1px solid rgb(185, 184, 184);
            }

            select{
                width: 90px;
                border-radius: 0;
                outline: none;
                border-right: none;
                font-size: 16px;
                text-align: center;
                border-radius: 50px 0 0 50px;
            }

            input{
                width: 50%;
                padding: 1px 12px;
                box-sizing: border-box;
                outline: none; 
                border-radius: 0 50px 50px 0 ;
                font-size: 15px;

                &:focus{
                    height: 38px;
                    outline: 1px solid rgb(1, 59, 184);
                }    
            }
            
            button{
                padding: 0;
                border: none;
                background-color: rgba(0, 0, 0, 0);
                font-size: 20px;
                position: absolute;
                margin: auto 0;
                top:9px;
                left: 76%;
                cursor: pointer;
                
            }
        }
    }
</style>