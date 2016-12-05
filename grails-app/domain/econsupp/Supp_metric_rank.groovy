package econsupp

class Supp_metric_rank implements Serializable {
	Float adj_metric
	Integer metric_id
	Integer subd_id
	Integer computed_rank
	String pmid
	Integer pub_year

	static mapping = {
		version false
		id composite: ['subd_id', 'pub_year', 'metric_id'], insert: 'false', update: 'false'
	}
	static constraints = {
	}
	static namedQueries = {
		computedRankGT { comprank ->
			if (comprank) {
				gt 'computed_rank', comprank
			}
		}
		computedRankLT { comprank ->
			if (comprank) {
				lt 'computed_rank', comprank
			}
		}
		filterSubdId { subdid ->
			if (subdid) {
				eq('subd_id', subdid)
			}
		}
		filterMetricIDList { metricList ->
			if (metricList) {
				'in'("metric_id", metricList.tokenize(','))
				// metricList.tokenize(',').each {
				// 	eq('metric_name', it)
				// }
			}
		}
	}
}
