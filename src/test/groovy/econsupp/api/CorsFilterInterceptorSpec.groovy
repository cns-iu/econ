package econsupp.api


import grails.test.mixin.TestFor
import spock.lang.Specification

/**
 * See the API for {@link grails.test.mixin.web.ControllerUnitTestMixin} for usage instructions
 */
@TestFor(CorsFilterInterceptor)
class CorsFilterInterceptorSpec extends Specification {

    def setup() {
    }

    def cleanup() {

    }

    void "Test corsFilter interceptor matching"() {
        when:"A request matches the interceptor"
            withRequest(controller:"corsFilter")

        then:"The interceptor does match"
            interceptor.doesMatch()
    }
}
