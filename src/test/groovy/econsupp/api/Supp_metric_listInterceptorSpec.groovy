package econsupp.api


import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(Supp_metric_listInterceptor)
class Supp_metric_listInterceptorSpec extends Specification {

    def setup() {
    }

    def cleanup() {

    }

    void "Test supp_metric_list interceptor matching"() {
        when:"A request matches the interceptor"
            withRequest(controller:"supp_metric_list")

        then:"The interceptor does match"
            interceptor.doesMatch()
    }
}
