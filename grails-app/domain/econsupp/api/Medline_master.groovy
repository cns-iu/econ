package econsupp.api

import grails.rest.*

@Resource(uri='/api/medline_master', formats=['json', 'xml'])
class Medline_master {
	String journal_title
	String article_title
	Integer pub_year
	String pmid
	String journal_nlmuniqueid

	static mapping = {
		version false
		datasource 'admin'
		table name: 'medline_master', schema: 'public'

		pmid index: 'medline_master_pmid_idx'
		pub_year index: 'medline_master_pubyr_idx'
	}

  static constraints = {
  }
}
