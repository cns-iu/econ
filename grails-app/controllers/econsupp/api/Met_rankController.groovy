package econsupp.api

import grails.converters.*

class Met_rankController {
    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			["name": "adj_metric", "type": "numeric"],
			["name": "metric_id", "type": "numeric"],
			["name": "subd_id", "type": "numeric"],
			["name": "computed_rank", "type": "numeric"],
			["name": "pmid", "type": "string"],
			["name": "pub_year", "type": "numeric"]
		]
		obj['records']['data'] = Supp_metric_rank.list(params);
		render obj as JSON

    }
}
