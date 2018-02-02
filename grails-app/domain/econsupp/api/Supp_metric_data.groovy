package econsupp.api

import grails.rest.*

@Resource(uri='/api/supp_metric_data', formats=['json', 'xml'])
class Supp_metric_data implements Serializable {
	String pmid
	Integer metric_id
	Float metric

	static mapping = {
		datasource 'admin'
		version false
		table 'supp_metric_data'
    id composite: ['pmid', 'metric_id'], insert: 'false', update: 'false'


		pmid index: 'supp_metric_pmid_idx'
		metric_id index: 'supp_metric_data_metricid_idx'
		metric index: 'supp_metric_data_metric_idx'
	}

  static constraints = {
  }
}
