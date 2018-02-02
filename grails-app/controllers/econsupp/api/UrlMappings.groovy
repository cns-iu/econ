package econsupp.api

class UrlMappings {

    static mappings = {
        "/ECONSupp/api/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }
        "/ECONSupp-admin/api/$controller/$action?/$id?(.$format)?"{
            constraints {
                // apply constraints here
            }
        }

        "/ECONSupp/ucsdmap"(redirect:[url:'http://cns.iu.edu/econ-p/ucsdmap.html'])
        "/ECONSupp/hexmap"(redirect:[url:'http://cns.iu.edu/econ-p/hexmap.html'])

        "/econ-ucsdmap"(redirect:'/ECONSupp/ucsdmap.html')
        "/econ-hexmap"(redirect:'/ECONSupp/hexmap.html')
        "/econ-admin"(redirect:'/ECONSupp-admin/index.html')
        "500"(view: '/error')
        "404"(view: '/notFound')

        "/ECONSupp/api/met_list"(controller: "met_list")
        "/ECONSupp/api/med_author"(controller: "med_author")
        "/ECONSupp/api/med_master"(controller: "med_master")
        "/ECONSupp/api/met_sums"(controller: "met_sums")
        "/ECONSupp/api/met_rank"(controller: "met_rank")
        "/ECONSupp/api/metric_update"(controller: "metric_update")
        "/ECONSupp/api/compute_derived"(controller: "ComputeDerived")

        "/ECONSupp-admin/api/met_list"(controller: "met_list")
        "/ECONSupp-admin/api/med_author"(controller: "med_author")
        "/ECONSupp-admin/api/med_master"(controller: "med_master")
        "/ECONSupp-admin/api/met_sums"(controller: "met_sums")
        "/ECONSupp-admin/api/met_rank"(controller: "met_rank")
        "/ECONSupp-admin/api/metric_update"(controller: "metric_update")
        "/ECONSupp-admin/api/compute_derived"(controller: "ComputeDerived")
    }
}
