package econsupp.api


import groovy.sql.Sql
import grails.rest.*
import javax.annotation.Resource




class Metric_updateController {
	@Resource(name = "dataSource_admin")
	def adminDataSource
    def index() { 
		def sql = new Sql(adminDataSource)
		def sqlQuery = 'DROP TABLE IF EXISTS supp_metric_rank;' +
			'CREATE TABLE supp_metric_rank(pmid CHARACTER VARYING, adj_metric NUMERIC, metric_id INTEGER, subd_id INTEGER, pub_year INTEGER, computed_rank INTEGER);' +
			'INSERT INTO supp_metric_rank SELECT a.pmid, a.metric*b.jfraction AS adj_metric, a.metric_id, b.subd_id, c.pub_year, rank() OVER(PARTITION BY a.metric_id, b.subd_id, c.pub_year ORDER BY a.metric*b.jfraction DESC) FROM supp_metric_data a, journ_mapping b, medline_master c, medline_journals d WHERE a.pmid= c.pmid AND c.journal_nlmuniqueid = d.journal_nlmuniqueid AND d.journ_id = b.journ_id;' +
			'GRANT SELECT ON supp_metric_rank TO econ_supp;' +
			'GRANT SELECT ON supp_metric_rank TO econ_supp_admin;' +
			'DROP TABLE IF EXISTS metric_sums;' +
			'SELECT a.subd_id, b.pub_year, c.metric_id, SUM(c.metric*a.jfraction) as metric_sum, SUM(a.jfraction) as metric_count INTO metric_sums FROM journ_mapping a, medline_master b, supp_metric_data c, medline_journals e WHERE a.journ_id = e.journ_id AND e.journal_nlmuniqueid = b.journal_nlmuniqueid AND b.pmid = c.pmid AND b.pub_year IS NOT NULL GROUP BY a.subd_id, b.pub_year, c.metric_id, c.metric_id;' +
			'GRANT SELECT ON metric_sums TO econ_supp;' +
			'GRANT SELECT ON metric_sums TO econ_supp_admin;' +
			'DROP TABLE IF EXISTS metric_counts;' +
			'SELECT c.metric_id, COUNT(c.metric) as total_values INTO metric_counts FROM supp_metric_data c WHERE c.metric IS NOT NULL GROUP BY c.metric_id;' +
			'GRANT SELECT ON metric_counts TO econ_supp_admin;'

		sql.executeUpdate(sqlQuery);
		sql.close();
		render "Done"
	}
}