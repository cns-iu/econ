package econsupp

class Metric_sums implements Serializable {
	Integer subd_id
	Integer pub_year
	String metric_name
	Float metric_sum
	Float metric_count
	Boolean use_average

    static mapping = {
     version false
     id composite: ['subd_id', 'pub_year', 'metric_name'], insert: 'false', update: 'false'
    }

    static constraints = {
    }

    static namedQueries = {
    	filterMetricName { metricList ->
    		if (metricList) {
    			'in'("metric_name", metricList.tokenize(','))
    		}
    	}
    	filterYearGT { year ->
    		if (year) {
    			gt 'pub_year', year
    		}
    	}
    }
}
