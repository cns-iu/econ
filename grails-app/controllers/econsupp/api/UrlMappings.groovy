package econsupp.api

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/econ-ucsdmap"(redirect:'/ECONSupp/ucsdmap.html')
        "/econ-hexmap"(redirect:'/ECONSupp/hexmap.html')
        "/econ-admin"(redirect:'/ECONSupp-admin/index.html')
        "500"(view: '/error')
        "404"(view: '/notFound')
        "/met_list"(controller: "met_list")
        "/med_author"(controller: "med_author")
        "/med_master"(controller: "med_master")
        "/met_sums"(controller: "met_sums")
        "/met_rank"(controller: "met_rank")
        "/metric_update"(controller: "metric_update")
        "/compute_derived"(controller: "ComputeDerived")

        
    }
}
