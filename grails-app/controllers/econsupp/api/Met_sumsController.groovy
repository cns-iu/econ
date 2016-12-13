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

		println (new Date()[Calendar.YEAR])

		def minYear = 1900
		if (params.int("pub_year_min")) {
			minYear = params.int("pub_year_min")
		}

		def maxYear = new Date()[Calendar.YEAR]
		if (params.int("pub_year_max")) {
			maxYear = params.int("pub_year_max")
		}

		obj['records']['data'] = Metric_sums.createCriteria().list {
			between("pub_year", minYear, maxYear)
		};

		// obj['records']['data'] = Metric_sums.list(params);
		render obj as JSON

    }
}
