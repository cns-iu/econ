package econsupp.api

import grails.rest.*

@Resource(uri='/api/medline_master', formats=['json', 'xml'])
class Medline_master {
	String journal_title
	String article_title
	Integer pub_year
	String pmid

	static mapping = {
		version false
		datasource 'dataSource_adminds'
	}

    static constraints = {
    }
}
