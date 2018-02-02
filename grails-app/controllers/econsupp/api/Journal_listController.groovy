package econsupp.api
import econsupp.api.Medline_master
import econsupp.api.Supp_metric_rank
import grails.converters.JSON
import groovy.json.*
import groovy.sql.Sql

class Journal_listController {
	def dataSource
    def index() {
		Integer computed_rankParam = params.int("computed_rank")
		Integer subd_idParam = params.int("subd_id")
		Integer minPubYearParam = params.int("pub_year_min")
		Integer maxPubYearParam = params.int("pub_year_max")
		String metric_idParam = params.metric_id
		Integer limitParam = params.int("limit")
		List<String> metric_idList = metric_idParam.split(",");
		List<Integer> metric_ids = [];

		for (String metric_id : metric_idList) {
			try {
				Integer metric_int = metric_id.toInteger();
				metric_ids.add(metric_int);
			} catch (Exception ex) {
				continue;
			}
		}

		String pubYearMinQueryString = "";
		if (minPubYearParam) {
			pubYearMinQueryString = "AND pub_year >= :minyr ";
		}
		String pubYearMaxQueryString = "";
		if (maxPubYearParam) {
			pubYearMaxQueryString = "AND pub_year <= :maxyr ";
		}
		String computedRankQueryString = "";
		if (computed_rankParam != 20) {
			computedRankQueryString = "AND computed_rank<:comprank ";
		}

		String sqlQuery =
			"SELECT a.pmid, a.adj_metric, a.subd_id, a.metric_id, b.article_title, b.journal_title, b.pub_year, c.last_name, c.first_name " +
			"FROM (" +
				"SELECT * FROM Supp_metric_rank " +
				"WHERE subd_id = :subdid " +
					"AND metric_id = :metricid " +
					computedRankQueryString +
					pubYearMinQueryString +
					pubYearMaxQueryString +
					"ORDER BY adj_metric DESC " +
					"LIMIT :limit) a, " +
				"public.Medline_master b, public.Medline_author c " +
			"WHERE b.pmid = a.pmid AND a.pmid = c.pmid " +
				"AND c.author_rank = 1 ";

		def sql = new Sql(dataSource)
		println(sqlQuery);

		def results = [];
		for (def metric_id in metric_ids) {
			sql.eachRow(sqlQuery, [comprank: computed_rankParam, subdid: subd_idParam, metricid: metric_id, minyr: minPubYearParam, maxyr: maxPubYearParam, limit: limitParam]) { row ->
				def intermediateResult = row.toRowResult()
				results.add(intermediateResult)
			}
		}

		def obj = [:]
		obj['records'] = [:]
		obj['records']['schema'] = [
			[ "name": "pmid","type": "string"],
			[ "name": "adj_metric","type": "numeric"],
			[ "name": "article_title","type": "string"],
			[ "name": "journal_title","type": "string"],
			[ "name": "pub_year","type": "numeric"],
			[ "name": "last_name","type": "string"],
			[ "name": "first_name","type": "string"],
		]
		obj['records']['data'] = results
		render obj as JSON
    }
}
