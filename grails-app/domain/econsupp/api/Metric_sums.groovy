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
		datasource 'admin'
		version false
		id composite: ['subd_id', 'pub_year', 'metric_id'], insert: 'false', update: 'false'

		subd_id index: 'metric_sums_subdid_idx'
		pub_year index: 'metric_sums_pubyr_idx'
		metric_id index: 'metric_sums_metricid_idx'
		metric_sum index: 'metric_sums_metricsum_idx'
		metric_count index: 'metric_sums_metriccnt_idx'
  }

  static constraints = {
  }
}
