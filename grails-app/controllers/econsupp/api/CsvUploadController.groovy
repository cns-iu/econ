package econsupp.api

import grails.rest.*
import grails.converters.*
import org.grails.plugins.csv.*
import econsupp.api.Supp_metric_list
import org.hibernate.*

class CsvUploadController {
	def sessionFactory
    def index() {
		def file = request.getFile("file")
    	def inStream = file.inputStream

    	def errors = 0;
    	def firstError = -1;

		def obj = [:]
		obj['message'] = "Success"
    	//TODO: Validate CSV schema (Assume split,[0] == pmid on first line)
    	def skip = false;
    	def i = 0;
		inStream.splitEachLine(',') { line ->
			if (i == 0) {
				if (line[0] == "pmid") {
					//Do nothing?
				} else {
					obj['message'] = "Invalid schema"
					skip = true
				}
			}

			if (!skip) {
				def pmid = line[0]
				def metric = line[1]
				Supp_metric_data dom = new Supp_metric_data(["pmid": line[0], "metric": line[1], "metric_id": params.int("metric_id")])
				if (dom.hasErrors() || dom.save() == null) {
					errors++;
					if (firstError == -1) {
						firstError = i;
					}
				}
			}
			i += 1
		}

		sessionFactory.currentSession.flush()

		obj['totalrecords'] = i
		obj['numerrors'] = errors
		obj['firsterrorindex'] = firstError

		render obj as JSON
    }
}


// class CsvtestController {
// 	def sessionFactory
//     def index() {
// 		def reqPart = request.getFile("csv")
//     	def inStream = reqPart.inputStream
// 		// StatelessSession session = sessionFactory.openStatelessSession()
// 		// Transaction tx = session.beginTransaction()
// 		inStream.eachLine() {line ->
// 			def split = line.split(",")
// 			Supp_metric_data dom = new Supp_metric_data(["metric": line.split(",")[0], "pmid": line.split(",")[1], "metric_id": line.split(",")[2]])
// 			dom.save(flush: true)
// 		}
// 		// tx.commit()
// 		// session.close()
// 		render "Done"
//     }
// }
