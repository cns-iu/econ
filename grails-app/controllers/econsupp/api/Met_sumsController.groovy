package econsupp.api

import grails.converters.*
import java.sql.Timestamp

class Met_sumsController {
    def sessionFactory
    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			["name": "subd_id", "type": "numeric"],
			["name": "pub_year", "type": "numeric"],
			// ["name": "metric_name", "type": "string"],
			["name": "metric_sum", "type": "numeric"],
			["name": "metric_count", "type": "numeric"],
			// ["name": "use_average", "type": "string"]
		]
		def minYear = 1959
		if (params.int("pub_year_min")) {
			minYear = params.int("pub_year_min")
		}

		def maxYear = new Date()[Calendar.YEAR]
		if (params.int("pub_year_max")) {
			maxYear = params.int("pub_year_max")
		}
		def data = Metric_sums.createCriteria().list {
			between("pub_year", minYear, maxYear)
			'in'('metric_id', (Supp_metric_list.createCriteria().list {
				eq("display", true)
			}).metric_id)
		}
		obj['records']['data'] = data
		// obj['records']['data'] = Metric_sums.list(params);
		render obj as JSON

        // def session = sessionFactory.currentSession 
        // session.flush() 
        // session.clear() 
    }
}
