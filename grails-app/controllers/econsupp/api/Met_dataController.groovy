package econsupp.api

import grails.converters.*

class Met_dataController {
    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			[ "name": "pmid","type": "string"],  
			[ "name": "metric_id","type": "numeric"],
			[ "name": "metric","type": "numeric"]
		]
		obj['records']['data'] = Supp_metric_data.list(params);
		render obj as JSON
    }
}
