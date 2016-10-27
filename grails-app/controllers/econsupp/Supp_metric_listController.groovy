package econsupp

import econsupp.Supp_metric_list
import grails.converters.JSON
import groovy.json.*

class Supp_metric_listController {
    def index() { 
		Integer metric_idParam = params.int("metric_id")
		String metric_nameParam = params.metric_name
		String metric_descParam = params.metric_desc
		Boolean use_averageParam = params.use_average

		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			[ "name": "metric_id","type": "numeric"],  
			[ "name": "metric_name","type": "string"],
			[ "name": "metric_desc","type": "string"],
			[ "name": "use_average","type": "string"]
		]
		obj['records']['data'] = Supp_metric_list.list(params);
		println Supp_metric_list.list(params);
		render obj as JSON

    }
}






