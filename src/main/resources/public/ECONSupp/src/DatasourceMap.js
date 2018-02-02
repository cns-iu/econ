/** @global
 * @description Maps pretty names for datasource URLs. Mapped from (ng-data-field)
 * @type {Object} */

// var econSuppServiceBase = 'http://prod.cns.iu.edu/tc/econsupp-site';
// var econSuppServiceBase = 'http://localhost:8080';
var econSuppServiceBase = 'api';

var globalDatasourceMap;
var local = false;

if (local) {
    globalDatasourceMap = {
        met_sums: {
            url: "data/met_sumsqpub_year_min=2007.json",
            params: {
                pub_year_min: 2007,
                pub_year_max: 2016
            }
        },
        met_sums_1959: {
            url: "data/met_sumsqpub_year_min=1959.json",
            params: {
                pub_year_min: 2007,
                pub_year_max: 2016
            }
        },
        met_list: {
            url: "data/metlist.json"
        }
    }
} else {
    globalDatasourceMap = {
        met_sums: {
            url: econSuppServiceBase + '/met_sums',
            params: {
                pub_year_min: 2007,
                pub_year_max: 2016
            }
        },
        met_list: {
            url: econSuppServiceBase + '/met_list'
        }
    }
}
