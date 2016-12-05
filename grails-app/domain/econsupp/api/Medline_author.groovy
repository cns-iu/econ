package econsupp.api

import grails.rest.*

@Resource(uri='/api/medline_author', formats=['json', 'xml'])
class Medline_author {
	Integer id
	String pmid
	String author_valid
	String last_name
	String first_name
	String suffix
	String collective_name
	String affiliation
	Integer author_rank
	Integer file_number
	String authority_id

    static constraints = {
    	version false
		id insert: 'false', update: 'false'
    }
}
