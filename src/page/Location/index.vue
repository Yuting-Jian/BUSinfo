<template>
    <div id="map">
        <p v-show="errorCheck">{{errorMessage}}</p>
    </div>
</template>

<script>

export default {
    name:"Location",
    data() {
        return {
            errorMessage:"",
            errorCheck:"false",
        }
    },
    mounted() {
        this.selfposition();
    },
    methods:{
        selfposition(){
            let{geo_success,geo_error} = this;

            if(navigator.geolocation.getCurrentPosition){
                navigator.geolocation.getCurrentPosition(geo_success,geo_error);
            }else{
                this.errorMessage = "您的瀏覽器不支持Geolocation";
                this.errorCheck = true;
            }
        },
        async geo_success(position){
            let location = {
                lat:position.coords.latitude,
                lng:position.coords.longitude,
            }
            this.initMap(location);

        },
        geo_error(error){
            this.errorMessage = "用戶拒絕提供相關位置資訊，如已提供請重整頁面";
            this.errorCheck = true;
        },
        initMap(location){
            const map = new google.maps.Map(document.getElementById("map"), {
                zoom: 18,
                center: location,
                styles:[
                    {
                        featureType:"poi.business",
                        stylers: [
                            { visibility: "off"}
                        ]
                    },
                ]
            });
            let marker = new google.maps.Marker({
                position: location,
                map,
            });
        },
    }
}
</script>

<style lang="less" scoped>
    #map{
        width: 100%;
        height: 100%;
        border-radius: 15px;
        background: rgb(204, 204, 204);
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        box-shadow: 0px 0px 6px 0px rgb(128, 124, 120);

        p{
            font-size: 20px;
            font-weight: 900;
            padding: 12px;
        }
    }
</style>