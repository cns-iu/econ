package econsupp.api

import grails.rest.*

@Resource(uri='/api/supp_metric_data', formats=['json', 'xml'])
class Supp_metric_data implements Serializable {
	String pmid
	Integer metric_id
	Float metric

	static mapping = {
		version false
		table 'supp_metric_data'
	    id composite: ['pmid', 'metric_id'], insert: 'false', update: 'false'
	}

    static constraints = {
    }
}
