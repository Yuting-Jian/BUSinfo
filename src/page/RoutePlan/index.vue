<template>
  <div class="rp-wrapper">
    <div class="address">
      <div class="origin" ref="origin">
        <i class="fa-solid fa-house"></i>
        <input type="text" placeholder="出發地" @focus="addOutline('origin')" @focusout="removeOutline('origin')" v-model="originAddress">
      </div>
      <i class="fa-solid fa-down-long"></i>
      <div class="destination" ref="destination">
        <i class="fa-solid fa-location-dot"></i>
        <input type="text" placeholder="目的地" @focus="addOutline('destination')" @focusout="removeOutline('destination')" v-model="destinationAddress">
      </div>
      <button type="button" @click="routePlan">規劃路線</button>
    </div>
    <div class="plan-wrpper">
      <h2 class="title">規劃結果</h2>
      <div class="loading" v-show="showStatus == 0"><i class="fa-solid fa-spinner" ref="loading"></i></div>
      <div class="error" v-show="showStatus == 1"><span>{{errorMessage}}</span></div>
      <ul class="plan-list" v-show="showStatus == 2">  
        <li class="transportation" v-for="plan,index of planlist.sections" :key="index" >
          <div class="text">
            <p>{{plan.departure.place.type == "place"? "出發點":plan.departure.place.name }}</p>
            <div>
              <i class="fa-solid " :class="{'fa-person-walking':(plan.type == 'pedestrian'),'fa-bus':(plan.type == 'transit')}"></i>
              <p>{{plan.type == "pedestrian"? "步行":plan.transport.number}}</p>
            </div>
            <p>{{plan.arrival.place.type == "place"? "目的地":plan.arrival.place.name }}</p>
          </div>
          <i class="fa-solid fa-chevron-down" v-show="!(planlist.sections.length == (index+1))"></i>
        </li>
      </ul>
    </div>
  </div>
</template>

<script>
import {mapState} from "vuex";

export default {
  name:"RoutePlan",
  data() {
    return {
      originAddress:"",
      destinationAddress:"",
      positions:{
        origin:{},
        destination:{}
      },
      errorMessage:"",
      showStatus:2,
      timer:"",
      
    }
  },
  computed:{
    ...mapState("routeplan",["planData"]),
    planlist(){
      return this.planData[0] || [];
    }
  },
  methods: {
    addOutline(attr){
      this.$refs[attr].style.outline = '1px solid rgb(1, 59, 184)';
    },
    removeOutline(attr){
      this.$refs[attr].style.outline = 'none';
    },
    routePlan(){
      if(!this.originAddress || !this.destinationAddress){
        this.showStatus = 1;
        this.errorMessage = "上述地址請勿空白";
      }else{
        let deg = 0;
        this.showStatus = 0;

        this.timer = setInterval(()=>{
          deg += 45;
          if(deg == 360) deg = 0 ;
          this.$refs.loading.style.transform =`rotate(${deg}deg)`;
        },150);

        let geo = new google.maps.Geocoder();

        let pro = new Promise((resolve,reject)=>{
            geo.geocode({address:this.originAddress},(result,status)=>{
              if(status == "OK"){
                this.positions.origin.lat = result[0].geometry.location.lat();
                this.positions.origin.lng = result[0].geometry.location.lng();

                geo.geocode({address:this.destinationAddress},(result,status)=>{
                  if(status == "OK"){
                    this.positions.destination.lat = result[0].geometry.location.lat();
                    this.positions.destination.lng = result[0].geometry.location.lng();
                    resolve("OK");
                  }else{
                    reject(status);
                  }
                });
              }else{
                reject(status);
              }
          });
        });

        pro.then(async (value)=>{
          try{
            await this.$store.dispatch("routeplan/getBusRoutePlan",this.positions);
            clearInterval(this.timer);
            this.showStatus = 2;
          }catch(e){
            console.log(e);
          }
        },(reason)=>{
          clearInterval(this.timer);
          this.showStatus = 1;
          this.errorMessage = "請輸入較詳細的地址，例:板橋區中山路1段161號";
        });
      }     
    }
  },
}
</script>
<style lang="less" scoped>
.rp-wrapper{
  height: 100%;

  .address{
    height: 25%;
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center;

    .origin,.destination{
      width: 70%;
      border: 1px solid rgb(185, 184, 184);
      background-color: white;
      box-sizing: border-box; 
      border-radius: 50px;

      i,input{
        line-height: 36px;
      }

      i{
        display: inline-block;
        width: 10%;
        text-align: center;
        font-size: 20px;
      }

      input{
        width: 85%;
        padding: 0;
        font-size: 15px;
        border: none;
        outline: none;
        vertical-align:top
      }
    }

    .destination{
      i{
        color: red;
      }
    }

    i{
      font-size: 20px;
    }

    button{
      line-height: 24px;
      width: 68px;
      border-radius: 5px;
      border: none;
      border: 1px solid gray;
      background-color: rgb(223, 223, 223);
      box-shadow: -3px 3px 3px 0px inset rgb(241, 241, 241),3px -3px 3px 0px inset rgb(189, 188, 188);
      cursor: pointer;

      &:active{
        box-shadow: 1px -1px 2px 0px inset rgb(207, 207, 207),-1px 1px 3px 0px inset rgb(158, 157, 157);
        font-size: 12px;
        // border: 1px solid black;
      }
    }
  }
  
  .plan-wrpper{
    width: 100%;
    height: calc(75% - 12px);
    margin: 12px auto 0 auto;

    .title{
      line-height: 46px;
      text-align: center;
      background-color: white;
      border-radius: 15px 15px 0 0;
      box-shadow: 0 0 10px 0 rgba(114, 114, 114, 0.5);
      font-size: 19px;
      font-weight: 900;
      position: relative;
    }

    .plan-list,.error,.loading{
        height: calc(100% - 46px);
        width: 100%;
        border-radius: 0 0 15px 15px;
        box-shadow: 0 0 10px 0 rgba(114, 114, 114, 0.5);
        overflow: auto;
    }
    
    .loading,.error{
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: rgb(231, 230, 230);

        i{
          font-size: 40px;
        }

        span{
          text-align: center;
          font-weight: 800;
        }
    }

    .plan-list{
      background-color: white;
      padding: 0 24px;
      box-sizing: border-box;

      .transportation{
        padding-top: 12px;

        .text{
          display: flex;


          & > p{
            width: 50%;
            line-height: 50px;
            font-size: 22px;
            font-weight: 900;
            text-align: center;
            border-bottom: 1px solid black;
          }

          div{
            padding: 0 12px;
            text-align: center;

            i{
              width: 32px;
              font-size: 30px;
            }

            p{
              width:100%;
              line-height: 20px;
              font-size: 12px;
              font-weight: 900;
            }
          }
        }

        i{
          width: 100%;
          padding: 0;
          font-size: 18px;
          text-align: center;
        }
      }
    }
  } 
}

@media (max-width:500px) {
  .rp-wrapper{

    .address{
      .origin,.destination{
        i{
          font-size: 16px;
        }
      }
    }

    .plan-wrpper{
      
      .plan-list{
        background-color: white;
        padding: 0 16px;
        box-sizing: border-box;

        .transportation{
          padding-top: 12px;

          .text{
            display: flex;


            & > p{
              width: 50%;
              line-height: 40px;
              font-size: 16px;
              text-align: center;
              font-weight: 900;
              border-bottom: 1px solid black;
            }

            div{
              padding: 0 8px;
              text-align: center;

              i{
                width: 32px;
                font-size: 22px;
              }

              p{
                width:100%;
                line-height: 20px;
                font-size: 12px;
                font-weight: 900;
              }
            }
          }

          i{
            width: 100%;
            padding: 0;
            font-size: 18px;
            text-align: center;
          }
        }
      }
    } 
  }
}
</style>
