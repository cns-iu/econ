package econsupp

import econsupp.Supp_metric_rank
import grails.converters.JSON
import groovy.json.*

class Supp_metric_rankController {
    def index() {
		String pmidParam = params.pmid
		Float adj_metricParam = params.adj_metric
		Integer metric_idParam = params.int("metric_id")
		Integer subd_idParam = params.int("subd_id")
		Integer computed_rankLTParam = params.int("computed_rank_lt")
		Integer computed_rankGTParam = params.int("computed_rank_gt")


		render Supp_metric_rank
			.computedRankLT(computed_rankLTParam)
			.computedRankGT(computed_rankGTParam)
			.filterSubdId(subd_idParam)
			.filterMetricIDList(metric_idParam)
			.list(params) as JSON
    }
}

