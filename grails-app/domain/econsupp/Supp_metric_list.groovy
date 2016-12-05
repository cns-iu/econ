package econsupp

class Supp_metric_list {
	Integer metric_id
	String metric_name
	String metric_desc
	Boolean display

	static mapping = {
		version false
		id name: 'metric_id', column: 'metric_id', generator: 'assigned', type: 'Integer', insert: 'false', update: 'false'
	}

    static constraints = {
    }

//     static namedQueries = {
//     	empNoGT { empno ->
// //    		if (empno && empno?.size()) {
//     			gt 'emp_no', empno
// //    		}
//     	}
//     	empNo { Integer empno ->
//     		if (empno) {
//     			eq('emp_no', empno)
//     		}
//     	}
//     	firstName { firstname ->
//     		if (firstname) {
//     			ilike "first_name", "%${firstname}%"
//     		}
//     	}
//     	lastName { lastname ->
//     		if (lastname) {
//     			ilike "last_name", "%${lastname}%"
//     		}
//     	} 
//     	genderIs { gender ->
//     		if (gender) {
//     			eq('gender', gender)
//     		}
//     	}
//     }

}
