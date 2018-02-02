package econsupp.api

import groovy.sql.Sql
import grails.rest.*
import javax.annotation.Resource

class Metric_updateController {
	@Resource(name = "dataSource_admin")
	def adminDataSource
    def index() {
		def sql = new Sql(adminDataSource);

		// Use this code for generating the subset needed for computation below
		def sqlQueryForDataset = """
--BEGIN;
	SET search_path='__my_dataset__';
	GRANT USAGE ON SCHEMA __my_dataset__ TO econ_supp;
	GRANT USAGE ON SCHEMA __my_dataset__ TO econ_supp_admin;
	SELECT DISTINCT(pmid) AS pmid INTO medline_pmids FROM public.medline_master;
	CREATE UNIQUE INDEX medline_pmids_pmid_idx ON medline_pmids(pmid);

	SET search_path='__my_dataset__';
	DROP TABLE IF EXISTS medline_subset;
	CREATE TABLE medline_subset AS
		SELECT m.pmid, m.pub_year, j.journ_id
		FROM public.medline_master AS m, public.medline_journals j
		WHERE
			m.pmid IN (SELECT pmid FROM medline_pmids) AND
			m.journal_nlmuniqueid = j.journal_nlmuniqueid;

	GRANT SELECT ON medline_subset TO econ_supp;
	GRANT SELECT ON medline_subset TO econ_supp_admin;

	CREATE INDEX medline_subset_pmid_idx ON medline_subset(pmid);
	CREATE INDEX medline_subset_pubyr_idx ON medline_subset(pub_year);
	CREATE INDEX medline_subset_jrnid_idx ON medline_subset(journ_id);
--COMMIT;
""";

		def sqlQueries = ["""
--BEGIN;
	-- supp_metric_rank --
	DROP TABLE IF EXISTS supp_metric_rank;
	CREATE TABLE supp_metric_rank (
		pmid CHARACTER VARYING(255),
		adj_metric NUMERIC,
		metric_id INTEGER,
		subd_id INTEGER,
		pub_year INTEGER,
		computed_rank INTEGER
	);
	INSERT INTO supp_metric_rank
		SELECT *
		FROM (
			SELECT m.pmid,
				d.metric*jm.jfraction AS adj_metric,
				d.metric_id, jm.subd_id, m.pub_year,
				rank() OVER(PARTITION BY d.metric_id, jm.subd_id, m.pub_year ORDER BY d.metric*jm.jfraction DESC)
			FROM medline_subset m, supp_metric_data d, public.journ_mapping jm
			WHERE m.pmid = d.pmid AND m.journ_id = jm.journ_id
		) a
		WHERE rank < 20
		ORDER BY subd_id, metric_id, pub_year, adj_metric DESC;

	GRANT SELECT ON supp_metric_rank TO econ_supp;
	GRANT SELECT ON supp_metric_rank TO econ_supp_admin;
""","""
	CREATE INDEX supp_metric_rank_pmid_idx ON supp_metric_rank(pmid);
	CREATE INDEX supp_metric_rank_ranking_idx ON supp_metric_rank(subd_id, metric_id, pub_year);
	CREATE INDEX supp_metric_rank_ordering_idx ON supp_metric_rank(adj_metric DESC NULLS LAST);
--COMMIT;
""","""
--BEGIN;
	-- metric_sums --
	DROP TABLE IF EXISTS metric_sums;
	CREATE TABLE metric_sums AS
		SELECT jm.subd_id, m.pub_year, d.metric_id,
			SUM(d.metric*jm.jfraction) as metric_sum,
			SUM(jm.jfraction) as metric_count
		FROM medline_subset m, supp_metric_data d, public.journ_mapping jm
		WHERE m.pmid = d.pmid AND m.journ_id = jm.journ_id
		GROUP BY jm.subd_id, m.pub_year, d.metric_id;

	GRANT SELECT ON metric_sums TO econ_supp;
	GRANT SELECT ON metric_sums TO econ_supp_admin;
""","""
	CREATE INDEX metric_sums_subdid_idx ON metric_sums(subd_id);
	CREATE INDEX metric_sums_pubyr_idx ON metric_sums(pub_year);
	CREATE INDEX metric_sums_metricid_idx ON metric_sums(metric_id);
--COMMIT;

--BEGIN;
	-- metric_counts --
	-- NOT USED?? --
	--DROP TABLE IF EXISTS metric_counts;
	--CREATE TABLE metric_counts AS
		--SELECT c.metric_id, COUNT(c.metric) as total_values
	 	--FROM supp_metric_data c
	 	--WHERE c.metric IS NOT NULL
	 	--GROUP BY c.metric_id;

	--GRANT SELECT ON metric_counts TO econ_supp_admin;
--COMMIT;"""];

		for (def sqlQuery in sqlQueries) {
			println("Starting: "+sqlQuery);
			sql.executeUpdate(sqlQuery);
		}
		sql.close();
		render "Done"
	}
}
