package econsupp.api

import grails.rest.*

@Resource(uri='/api/supp_metric_list', formats=['json', 'xml'])
class Supp_metric_list {
	Integer metric_id
	String metric_name
	String metric_desc
	Boolean display

	static mapping = {
		version false
		table 'supp_metric_list'
		id name: 'metric_id', column: 'metric_id', generator: 'assigned', type: 'Integer', insert: 'false', update: 'false'
	}

    static constraints = {
    }
}
