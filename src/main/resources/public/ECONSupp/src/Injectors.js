app.controller('AboutCtrl', function($scope, $mdDialog) {
    $scope.customFullscreen = false;
    $scope.showScimapAbout = function(ev) {
        $mdDialog.show({
            templateUrl: 'partials/scimap-about.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };
    $scope.showHexscimapAbout = function(ev) {
        $mdDialog.show({
            templateUrl: 'partials/hexscimap-about.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };

});



app.controller('tableCtrl', ['$scope', function($scope) {
    $scope.tableData = [];
    $scope.addTableData = function(data) {
        $scope.tableData = $scope.tableData.concat(data);
    }

    $scope.sortTableData = function(sortFunc) {
        $scope.tableData = sortFunc($scope.tableData);
    }
    $scope.clearTableData = function() {
        $scope.tableData = [];
    }
}]).directive('stRatio', function() {
    return {
        link: function(scope, element, attr) {
            var ratio = +(attr.stRatio);

            element.css('width', ratio + '%');

        }
    };
})


app.config(function($mdIconProvider) {
        $mdIconProvider
            .iconSet('device', 'img/icons/sets/device-icons.svg', 24);
    })
    .controller('sliderCtrl', function($scope) {

        $scope.$watch('minYear', function() {
            if ($scope.minYear > $scope.maxYear) {
                $scope.minYear = $scope.maxYear;
            }
            $scope.updateScimap();
        });

        $scope.$watch('maxYear', function() {
            if ($scope.minYear > $scope.maxYear) {
                $scope.maxYear = $scope.maxYear;
            }
            $scope.updateScimap();
        });
        $scope.firstTime = true;
        //TODO: Extract this
        $scope.updateScimap = function() {
            if ($scope.firstTime) {
                $scope.firstTime = false;
            } else {
                try {
                    scimap01.switchDatasource("http://localhost:8080/met_sums?max=20&pub_year_min=" + $scope.minYear + "&pub_year_max=" + $scope.maxYear)
                } catch (e) {
                    console.log("Nah");
                }
            }
        }

        $scope.minYear = 1959;
        $scope.maxYear = 2016;

    });
