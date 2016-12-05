package econsupp.api

import grails.converters.*

class Med_authorController {

    def index() {
		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [ 
			["name": "id", "type": "numeric"],
			["name": "pmid", "type": "string"],
			["name": "author_valid", "type": "string"],
			["name": "last_name", "type": "string"],
			["name": "first_name", "type": "string"],
			["name": "suffix", "type": "string"],
			["name": "collective_name", "type": "string"],
			["name": "affiliation", "type": "string"],
			["name": "author_rank", "type": "numeric"],
			["name": "file_number", "type": "numeric"],
			["name": "authority_id", "type": "string"]
		]
		obj['records']['data'] = Medline_author.list(params);
		render obj as JSON

    }
}
