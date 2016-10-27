package econsupp

import econsupp.Medline_master
import econsupp.Supp_metric_rank
import grails.converters.JSON
import groovy.json.*

class Medline_masterController {
    def index() {
		// String journal_titleParam = params.journal_title
		// Integer pub_yearParam = params.pub_year
		// String pmidParam = params.pmid


		render Medline_master.filterPMID(params.pmid).list(params) as JSON
    }
}
