import request from "./request";

// BusList的資料
export function busRouteByCity(city,routeName){
    if(routeName){
        return request({method:"get",url:`/basic/v2/Bus/Route/City/${city}/${routeName}?$format=JSON`});
    }else{
        return request({method:"get",url:`/basic/v2/Bus/Route/City/${city}?$format=JSON`});
    }
}

// BusDetail的資料

// Bus站序資料
export function busStopsData(city,RouteUID){
    return request({method:"get",url:`/basic/v2/Bus/StopOfRoute/City/${city}?$filter=RouteUID eq '${RouteUID}'&$format=JSON`});
}
// Bus預估到站資料
export function busEstimatedTime(city,RouteUID){
    return request({method:"get",url:`/basic/v2/Bus/EstimatedTimeOfArrival/City/${city}?$filter=RouteUID eq '${RouteUID}'&$format=JSON`});
}

// RoutePlan資料
export function busRoutePlan({origin,destination}){
    return request({method:"get",url:`/maas/routing?origin=${origin.lat},${origin.lng}&destination=${destination.lat},${destination.lng}&gc=1&top=1&transit=5&transfer_time=5,15&last_mile_mode=0&first_mile_mode=0&last_mile_time=10`});
}

