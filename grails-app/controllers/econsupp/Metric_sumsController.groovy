package econsupp

import econsupp.Metric_sums
import grails.converters.JSON
import groovy.json.*

class Metric_sumsController {
	def index() {
		Integer subd_idParam = params.int("subd_id")
		Integer pub_yearParam = params.int("pub_year")
		String metric_nameParam = params.metric_name
		Float metric_sumParam = params.metric_sum
		Float metric_countParam = params.metric_count
		Boolean use_averageParam = params.use_average

		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			[ "name": "subd_id","type": "numeric"],  
			[ "name": "pub_year","type": "numeric"],
			[ "name": "metric_name","type": "string"],
			[ "name": "metric_sum","type": "numeric"],
			[ "name": "metric_count","type": "numeric"],
			[ "name": "use_average","type": "string"]
		]
		obj['topology'] = "table";

		obj['records']['data'] = Metric_sums.list(params);
		render obj as JSON
	}
}


