package econsupp.api

import grails.rest.*

@Resource(uri='/api/metric_sums', formats=['json', 'xml'])
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
}
