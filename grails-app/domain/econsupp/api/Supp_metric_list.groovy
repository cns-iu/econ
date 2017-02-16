package econsupp.api

import grails.rest.*
//Upon deletion of a metric, database will cascade delete from supp_metric_data
@Resource(uri='/api/supp_metric_list', formats=['json', 'xml'])
class Supp_metric_list {
	Integer metric_id
	String metric_name
	String metric_desc
	Boolean display

	static mapping = {
		datasource 'admin'		
		version false
		table 'supp_metric_list'
		id name: 'metric_id', column: 'metric_id', generator: 'assigned', type: 'Integer', insert: 'false', update: 'false'
	}

    static constraints = {
    }
}
