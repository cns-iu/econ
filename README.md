# Deploying Project

#### Repositories
* (1) Front-end visualizations: https://github.iu.edu/CNS/cns-wvfp-econsupp
* (2) Admin interface: https://github.iu.edu/CNS/cns-wvfp-econsupp-admin
* (3) API: https://github.iu.edu/CNS/econsupp-grails

#### Structure
The Grails API (1) project will be the central point for deployment. The domains/controllers interact with the datasource to provide the visualizations with the required data. The two front-end interfaces, (1) & (2), will live inside of the API as static resource directories. This allows us to switch the datasources for dev, stage, and prod without updating the data endpoints on the front-end. The three data sources are defined in Grails under the **/grails-app/conf/application.yml** configuration. Switching between environments will select the appropriate datasource. A build definition for each environment should be created to deploy the code with different environments. Grails documentation for selecting environments can be found here: http://docs.grails.org/2.2.0/ref/Command%20Line/run-app.html.

This solution uses three repositories to create one final application. The reasons for this separation are as follows:
* The front-end visualizations and admin interface are separated so that access restrictions may be placed on the admin interface without explicitly restricting access to each view. The entire admin directory can be restricted instead for easier use.
* The front-end visualizations and admin interface may be deployed in separate locations with little configuration.
* The final structure for the compiled application does not follow the expected WVF structure.
    * We obviously don't want to modify the WVF structure just for this use case.
    * We can't add the Grails API as a dependency in one of the WVF projects (too complicated).
* These projects may be utilized independently and recycled for other projects without overlap.

#### Making Changes to the Front-end Visualization (1) or the Admin Interface (2)
Some changes may need to be made to the layout, the visualization, or the functionality of the visualizations. Clone and modify the projects as normal. When it comes time to deploy, do the following:

* Clone the Grails API (3) project. 
* Copy the deployed version of the front-end projects.
* Paste the entire directory to  /src/main/resources/public.
    * The file structure should resemble:
        * /build
        * /gradle
        * /grails-app
        * /src
            * /main
                * /groovy
                * /resources
                    * /public
                        * /ECONSupp *(1)*
                        * /ECONSupp-admin *(2)*
* Push the changes to the Grails API project.
* Build the project


