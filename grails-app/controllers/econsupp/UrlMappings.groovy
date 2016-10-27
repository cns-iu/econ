package econsupp

class UrlMappings {

    static mappings = {
        "/$controller/$action?/$id?(.$format)?"{
            constraints {
            }
        }

        "/"(controller:"home")
        "500"(view:'/error')
        "404"(view:'/notFound')
    }
}
