package econsupp

class Medline_master {
	String journal_title
	String article_title
	Integer pub_year
	String pmid

	static mapping = {
		version false
		id name: 'pmid', column: 'pmid', generator: 'assigned', type: 'String', insert: 'false', update: 'false'		
	}

    static constraints = {
    }

    static namedQueries = {
    	filterPMID { pmidList ->
    		if (pmidList) {
    			'in'("pmid", pmidList.tokenize(','))
    			// metricList.tokenize(',').each {
    			// 	eq('metric_name', it)
    			// }
    		}
    	}

    }


}
