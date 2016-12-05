package econsupp.api

import grails.converters.*

class Met_sumsController {
    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			["name": "subd_id", "type": "numeric"],
			["name": "pub_year", "type": "numeric"],
			["name": "metric_name", "type": "string"],
			["name": "metric_sum", "type": "numeric"],
			["name": "metric_count", "type": "numeric"],
			["name": "use_average", "type": "string"]
		]

		obj['records']['data'] = Metric_sums.list(params);
		render obj as JSON

    }
}
