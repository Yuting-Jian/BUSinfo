
export default [
    {
        path:"/",
        redirect:"/busroute",
    },
    {
        name:"busroute",
        path:"/busroute",
        component:()=>import("@/page/BusRoute"),
        children: [
            {
              name: "buslist",
              path: "buslist",
              component: ()=>import("@/page/BusRoute/BusList"),
            },
            {
              name: "busdetail",
              path: "busdetail",
              component: ()=>import("@/page/BusRoute/BusDetail"),
            },
        ]
    },
    {
        name:"location",
        path:"/location",
        component:()=> import("@/page/Location"),
    },
    {
        name:"routeplan",
        path:"/routeplan",
        component:()=> import("@/page/RoutePlan"),
    }
]