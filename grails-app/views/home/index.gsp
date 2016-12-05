<DOCTYPE! html>

    <head>
        <link rel='shortcut icon' type='image/x-icon' href='images/favicon.ico' />
        <title>CNS Visualization</title>
        <script src="lib/angular/angular.js"></script>
        <script src="lib/head.js"></script>
        <script src="src/Init.js"></script>
        <style type="text/css">
        .contentdemoBasicUsage div.demo-content {
            height: 600px;
        }
        
        .contentdemoBasicUsage div[ng-controller] {
            height: 100%;
            padding-bottom: 15px;
        }
        
        svg {
            border: 2px solid #eaeaea;
        }
        
        #scimap01 {
            width: 100%;
            height: 800px;
        }
        
        #scimap02 {
            width: 100%;
            height: 800px;
        }
        
        #pie-legend01 {
            width: 100%;
            height: 100%;
        }
        </style>
    </head>
    <!-- ng-data-field="http://localhost:9001/metric_sums?offset=10000" -->

    <body>
        <div class="leftsidenav" data-ng-controller="SideNavCtrl" layout="column" style="height:100%;" ng-cloak="">
            <section ng-controller="ToastCtrl" layout="row" flex="" class="section-controller">
                <md-sidenav class="md-sidenav-left md-primary" md-component-id="left" md-is-locked-open="$mdMedia('gt-md')" md-disable-backdrop="" md-whiteframe="4">
                    <md-toolbar md-scroll-shrink>
                        <h1 class="md-toolbar-tools">HITS Metrics Visualization</h1>
                    </md-toolbar>
                    <div ng-controller="CheckboxCtrl" id="metricForm0" ng-title="Metrics" ng-include="template.url"></div>
                    <div ng-controller="CheckboxCtrl" id="toggleLabels" ng-title="Discipline Labels" ng-values="On" ng-include="template.url"></div>
                    <div ng-controller="CheckboxCtrl" id="toggleMetricDisplay" ng-radio="true" ng-title="DEV ONLY - Size Coding Display" ng-values='Bar, Arc, Concentric, Radius' ng-include="template.url"></div>
                    <div class="md-padding" style="height: 400px" ng-cloak>
                        <div>
                            <legend class="demo-legend">Legend</legend>
                            <div layout="row" layout-wrap flex>
                                <div flex-xs flex="100">
                                    <div layout="column" layout-fill="" layout-align="top center" ng-cns-visual ng-data-attr="ng-cns-visual" ng-vis-type="PieLegend" id="pie-legend01" ng-component-for="scimap01" ng-identifier="pieLegend01">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
<!--                     <div style="width: 100%; left: 5%; align-items: center;">
                        <md-toolbar class="md-accent">
                            <div class="md-toolbar-tools">
                                <h2 class="md-flex">Legend</h2>
                            </div>
                        </md-toolbar>
                        <md-content flex>
                            <div layout="column" layout-fill="" layout-align="top center" ng-cns-visual ng-data-attr="ng-cns-visual" ng-vis-type="PieLegend" id="pie-legend01" ng-component-for="scimap01" ng-identifier="pieLegend01">
                            </div>
                        </md-content>
                    </div>
 -->                    <!--                     <div ng-controller="CheckboxCtrl" id="metricForm1" ng-include="template.url"></div>
                    <div ng-controller="CheckboxCtrl" id="metricForm2" ng-include="template.url"></div>
 -->
                </md-sidenav>
                <md-content flex="" layout-padding="">
                    <div layout="column" layout-fill="" layout-align="top center" ng-cns-visual ng-data-attr="ng-cns-visual" ng-vis-type="MapOfScience" id="scimap01" ng-data-field="data/metric_sums.json" ng-identifier="scimap01">
                        <div>
                            <md-button ng-click="toggleLeft()" class="md-primary" hide-gt-md="">
                                Toggle left
                            </md-button>
                        </div>
                    </div>
                </md-content>
            </section>
        </div>
    </body>

    </html>
