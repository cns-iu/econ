package econsupp.api

import grails.rest.*

@Resource(uri='/api/metric_sums', formats=['json', 'xml'])
class Metric_sums implements Serializable {
	Integer subd_id
	Integer pub_year
	Integer metric_id
//	String metric_name
	Float metric_sum
	Float metric_count
//	Boolean use_average
    static mapping = {
		datasource 'dataSource_adminds'
		version false
		id composite: ['subd_id', 'pub_year', 'metric_id'], insert: 'false', update: 'false'
    }
    static constraints = {
    }
}