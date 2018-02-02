package econsupp.api

import grails.rest.*

@Resource(uri='/api/supp_metric_rank', formats=['json', 'xml'])
class Supp_metric_rank implements Serializable{
	Float adj_metric
	Integer metric_id
	Integer subd_id
	Integer computed_rank
	String pmid
	Integer pub_year

	static mapping = {
		datasource 'admin'
		version false
		id composite: ['subd_id', 'pub_year', 'metric_id'], insert: 'false', update: 'false'

		metric_id index: 'supp_metric_rank_metricid_idx'
		subd_id index: 'supp_metric_rank_subdid_idx'
		computed_rank index: 'supp_metric_rank_rank_idx'
		pmid index: 'supp_metric_rank_pmid_idx'
		pub_year index: 'supp_metric_sums_pubyr_idx'
	}

	static constraints = {
	}
}
