package econsupp.api

import grails.converters.*

class Met_listController {

    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			[ "name": "metric_id","type": "numeric"],  
			[ "name": "metric_name","type": "string"],
			[ "name": "metric_desc","type": "string"],
			[ "name": "display","type": "string"]
		]
		obj['records']['data'] = Supp_metric_list.list(params);
		render obj as JSON

    }
}
