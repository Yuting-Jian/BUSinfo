<template>
    <div class="bm-wrapper">
        <div class="show-wrapper">
            <div class="show">
                <router-view></router-view>
            </div>
        </div>
        <ul class="menu-list">
            <li @click="toBusRoute">
                <i class="fa-solid fa-bus-simple"></i>
                <p>路線搜尋</p>
            </li>
            <li @click="toRoutePlan">
                <i class="fa-solid fa-route"></i>
                <p>地點搜尋</p>
            </li>
            <li @click="toLocation">
                <i class="fa-solid fa-map-location-dot"></i>
                <p>附近站牌</p>
            </li>
        </ul>
    </div>  
</template>

<script>
export default {
    name:'busman',
    methods: {
        toBusRoute(){
            this.$router.push({
                path:"/busroute/buslist",
                query:{
                    city:this.$route.query.city,
                }
            });
        },
        toLocation(){
            this.$router.push("/location");
        },
        toRoutePlan(){
            this.$router.push("/routeplan");
        }
    },   
}
</script>

<style lang="less" scoped>
.bm-wrapper{
    height: calc(100vh - 48px);
    min-height: 500px;
    max-width: 700px;
    background-color: rgb(77, 163, 233);
    margin: 24px auto;
    border-radius: 20px;
    box-shadow: 0 0 10px 0px rgba(51, 51, 51, 0.8);
    overflow: hidden;

    .show-wrapper{
        width: 100%;
        height: 80%;
        padding: 24px 24px 24px 24px;
        box-sizing: border-box;
        
        
        .show{
            width: 100%;
            height: 100%;
            padding: 24px;
            box-sizing: border-box;
            background-color: rgb(250, 243, 235);
            border-radius: 20px;
            box-shadow: 0 0 10px 0px rgba(42, 75, 102,0.8);
        }

    }

    .menu-list{
        width: 100%;
        height: 20%;
        padding: 0 24px;
        box-sizing: border-box;
        display: flex;
        justify-content: space-evenly;

        li{
            width: 30%;
            height: calc(100% - 24px);
            box-sizing: border-box;
            background-color: rgb(255, 192, 98);
            border-radius: 10px;
            box-shadow: 0px 6px 8px inset rgb(255, 217, 164),0px -3px 10px inset rgba(145, 109, 57,1);
            border: 2px solid rgb(182, 134, 68);
            display: flex;
            flex-direction: column;
            justify-content: center;
            align-items: center;
            cursor: pointer;
        
            i{
                font-size: 48px;
                margin-right: 12px;
            }

            p{
                padding: 8px;
                font-size: 30px;
                font-weight: 900;
            }
            
            i,p{
                transform: scale(0.9);
            }

            &:active{
                box-shadow: 0px -6px 8px inset rgba(255, 217, 164,0.6),0px 3px 10px 0px inset rgb(138, 103, 55);
                border: 2px solid rgb(138, 102, 51);
            }

        }

    }

}
@media (max-width:550px),(max-height:650px){
    .bm-wrapper{
         .menu-list{
            li{
                i{
                    font-size: 38px;
                }

                p{
                    font-size: 20px;
                }
            }  
         }
    }
}
</style>