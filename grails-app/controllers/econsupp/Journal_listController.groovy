package econsupp
import econsupp.Medline_master
import econsupp.Supp_metric_rank
import grails.converters.JSON
import groovy.json.*
import groovy.sql.Sql

class Journal_listController {
	def dataSource
    def index() { 
		Integer computed_rankParam = params.int("computed_rank")
		Integer subd_idParam = params.int("subd_id")
		String metric_idParam = params.metric_id
		Integer limitParam = params.int("limit")
		List<String> metric_idList = metric_idParam.split(",");
		

		String metricIDQueryString = "AND (";
		Integer validMetrics = 0;
		for (String metric_id : metric_idList) {
			try {
				Integer metric_int = metric_id.toInteger();
				metricIDQueryString += "a.metric_id = " + metric_int.toString() + " OR "
				validMetrics++;
			} catch (Exception ex) {
				continue;
			}	
		}
		metricIDQueryString = metricIDQueryString[0..-4] + ") "
		if (validMetrics == 0) {
			metricIDQueryString = "";
		}


		String sqlQuery = "SELECT a.pmid, a.adj_metric, a.subd_id, a.metric_id, b.article_title, b.journal_title, b.pub_year, c.last_name, c.first_name " +
			"FROM Supp_metric_rank a, Medline_master b, Medline_author c " +
			"WHERE a.computed_rank<:comprank " +
			"AND a.subd_id = :subdid " +
			metricIDQueryString + 
			"AND b.pmid = a.pmid " +
			"AND a.pmid = c.pmid " +
			"AND c.author_rank = 1 " + 
			"ORDER BY a.adj_metric " +
			"DESC LIMIT :limit"

		def sql = new Sql(dataSource)
		println(sqlQuery);
		def results = []
		sql.eachRow(sqlQuery, [comprank: computed_rankParam, subdid: subd_idParam, metricid: metric_idParam, limit: limitParam]) { row ->
			def intermediateResult = row.toRowResult()

			results.add(intermediateResult)
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

// 		// def obj = [:]
// 		// obj['records'] = [:]
// 		// obj['records']['schema'] = [ 
// 		// 	[ "name": "metric_id","type": "numeric"],  
// 		// 	[ "name": "metric_name","type": "string"],
// 		// 	[ "name": "metric_desc","type": "string"],
// 		// 	[ "name": "use_average","type": "string"]
// 		// ]
// 		// obj['records']['data'] = Supp_metric_list.list(params);
// 		// render obj as JSON


//SELECT a.pmid, a.adj_metric, a.subd_id, b.article_title, b.journal_title, b.pub_year FROM supp_metric_rank a, medline_master b WHERE a.computed_rank<20 AND a.subd_id = 372 AND a.metric_id = 1 AND b.pmid = a.pmid ORDER BY a.adj_metric DESC LIMIT 20;