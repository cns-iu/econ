package econsupp.api

import grails.converters.*

class Med_masterController {
    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			["name": "journal_title", "type": "string"],
			["name": "article_title", "type": "string"],
			["name": "pub_year", "type": "numeric"],
			["name": "pmid", "type": "string"]
		]
		obj['records']['data'] = Medline_master.list(params);
		render obj as JSON

    }
}
