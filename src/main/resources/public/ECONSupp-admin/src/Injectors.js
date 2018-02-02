angular.module('app').requires.push('smart-table');

app.config(function($httpProvider) {
    $httpProvider.defaults.headers.common = {};
    $httpProvider.defaults.headers.post = {};
    $httpProvider.defaults.headers.put = {};
    $httpProvider.defaults.headers.patch = {};
});


var s
var selectedFile;
app.controller('tableCtrl', ['$scope', '$mdDialog', '$http', function(scope, $mdDialog, $http) {
    s = scope;

    scope.metric_data;


    scope.uploadMetricFile = function($event, metric_id) {
        if (!window.FileReader) {
            return alert('FileReader API is not supported by your browser.');
        }
        var fileItem = $("#metric_data_upload-" + metric_id);
        console.log(fileItem);
        var files = fileItem[0].files;
        if (files.length == 0) {

        } else {
            var file = files[0];

            if (file.size >= 50000000) {
                $mdDialog.show(
                    $mdDialog.confirm()
                    .parent(angular.element(document.querySelector('#main-section')))
                    .clickOutsideToClose(true)
                    .title("File size is too large.")
                    .textContent("Please upload a file smaller than 50MB.")
                    .ariaLabel("Do I need this?")
                    .ok("Continue")
                    .targetEvent($event)
                );
            } else {
                var fd = new FormData();
                fd.append('file', file);
                $mdDialog.show(
                    $mdDialog.confirm()
                    .parent(angular.element(document.querySelector('#main-section')))
                    .clickOutsideToClose(true)
                    .title("Please wait.")
                    .textContent("A window will appear shortly confirming the file upload.")
                    .ariaLabel("Do I need this?")
                    .ok("Continue")
                    .targetEvent($event)
                );

                $http.post(econSuppServiceBase + "/csvUpload/", fd, {
                    transformRequest: angular.identity,
                    headers: { 'Content-Type': undefined },
                    params: {
                        file: file,
                        metric_id: metric_id
                    }
                }).success(function(res) {
                    $mdDialog.show(
                        $mdDialog.confirm()
                        .parent(angular.element(document.querySelector('#main-section')))
                        .clickOutsideToClose(true)
                        .title("Finished upload")
                        // .textContent("The Metric ID, Metric Name, and Metric Description fields need to be filled out before submitting.")
                        .ariaLabel("Do I need this?")
                        .ok("Continue")
                        .targetEvent($event)
                    );

                    scope.getData();
                    scope.isSelected = false;
                })

            }


        }
    }
    scope.uploadData = function(metric_id) {

    }

    // (function($) {
    //     // Add click event handler to button
    //     $('#load-file').click(function() {
    //         if (!window.FileReader) {
    //             return alert('FileReader API is not supported by your browser.');
    //         }
    //         var $i = $('#file'), // Put file input ID here
    //             input = $i[0]; // Getting the element from jQuery
    //         if (input.files && input.files[0]) {
    //             file = input.files[0]; // The file
    //             fr = new FileReader(); // FileReader instance
    //             fr.onload = function() {
    //                 // Do stuff on onload, use fr.result for contents of file
    //                 $('#file-content').append($('<div/>').html(fr.result))
    //             };
    //             //fr.readAsText( file );
    //             fr.readAsDataURL(file);
    //         } else {
    //             // Handle errors here
    //             alert("File not selected or browser incompatible.")
    //         }
    //     });
    // })(jQuery);




    scope.showFileSample = function($event) {
        $mdDialog.show({
            template: "<div class='custom-dialog'>pmid,metric<br>xxxxxxxx, y.yy<br>xxxxxxxx, y.yy</div>",
            clickOutsideToClose: true
        }).then(function() {});
    }

    //============================ADD NEW METRIC============================
    //======================================================================
    scope.postEvent = function($event) {
        if (scope.created.metric_id != "" && scope.created.metric_name != "" && scope.created.metric_desc != "") {
            $mdDialog.show(
                $mdDialog.confirm()
                .parent(angular.element(document.querySelector('#main-section')))
                .clickOutsideToClose(true)
                .title("Warning")
                .textContent("You are about to create a metric. Upon completion, this metric should appear in the table below. You may modify/remove your new metric from there.")
                .ariaLabel("Do I need this?")
                .ok("Continue")
                .cancel("Cancel")
                .targetEvent($event)
            ).then(function() {
                scope.postData(scope.created)
            });
        } else {
            $mdDialog.show(
                $mdDialog.confirm()
                .parent(angular.element(document.querySelector('#main-section')))
                .clickOutsideToClose(true)
                .title("Incomplete")
                .textContent("The Metric ID, Metric Name, and Metric Description fields need to be filled out before submitting.")
                .ariaLabel("Do I need this?")
                .ok("Continue")
                .targetEvent($event)
            );
        }
    }

    scope.postData = function(created) {
        var metricIdFilter = scope.rowCollection.filter(function(d, i) {
            return created.metric_id == d.metric_id
        })

        if (metricIdFilter.length > 0) {
            $mdDialog.show(
                $mdDialog.confirm()
                .parent(angular.element(document.querySelector('#main-section')))
                .clickOutsideToClose(true)
                .title("Incomplete")
                .textContent("Duplicate Metric ID. Please choose a unique value.")
                .ariaLabel("Do I need this?")
                .ok("Continue")
            );

        } else {
            $http({
                url: econSuppServiceBase + "/api/supp_metric_list",
                method: "POST",
                params: {
                    metric_id: created.metric_id,
                    metric_name: created.metric_name,
                    metric_desc: created.metric_desc,
                    display: created.display
                }
            }).then(function(res) {
                scope.getData();
            })
        }
    }
    scope.created = {
        metric_id: "",
        metric_name: "",
        metric_desc: "",
        display: false,
    }

    //============================REMOVE METRIC=============================
    //======================================================================

    scope.deleteEvent = function($event, row) {
        $mdDialog.show(
            $mdDialog.confirm()
            .parent(angular.element(document.querySelector('#main-section')))
            .clickOutsideToClose(true)
            .title("Warning")
            .textContent("You are about to delete an entire metric. This will also delete all data for the associated metric. This operation is permanent and irreversible.")
            .ariaLabel("Do I need this?")
            .ok("Continue")
            .cancel("Cancel")
            .targetEvent($event)
        ).then(function() {
            scope.deleteData(row.metric_id);
        });
    }

    scope.deleteData = function(metric_id) {
        $http({
            //TODO: Fix?
            url: econSuppServiceBase + "/api/supp_metric_list/" + metric_id,
            method: "DELETE"
        }).success(function(res) {
            scope.getData();
        })
    }

    //============================UPDATE METRIC=============================
    //======================================================================


    scope.cancelUpdateEvent = function($event) {
        scope.isSelected = false;
    }

    scope.updateEvent = function($event, row) {
        $mdDialog.show(
            $mdDialog.confirm()
            .parent(angular.element(document.querySelector('#main-section')))
            .clickOutsideToClose(true)
            .title("Warning")
            .textContent("You are about to update a metric. This operation is permanent and irreversible.")
            .ariaLabel("Do I need this?")
            .ok("Continue")
            .cancel("Cancel")
            .targetEvent($event)
        ).then(function() {
            scope.putData(scope.selected);
        });
    }

    scope.computeEvent = function($event) {
        $("#admin-compute-progress").css({"display": "block"});
        $http({
            //TODO: Fix?
            url: econSuppServiceBase + "/metric_update/",
            method: "GET"
        }).success(function(res) {
            $("#admin-compute-progress").css({"display": "none"});
            $mdDialog.show(
                $mdDialog.confirm()
                .parent(angular.element(document.querySelector('#main-section')))
                .title("Complete")
                .textContent("The operation has finished. You may now continue modifying the metrics or view the updated visualization.")
                .ariaLabel("Do I need this?")
                .ok("Continue")
                .targetEvent($event)
            ).then(function() {});

        })
    }


    scope.putData = function(selected) {
        $http({
            //TODO: Fix
            url: econSuppServiceBase + "/supp_metric_list/" + selected.metric_id,
            method: "PUT",
            params: {
                metric_name: selected.metric_name,
                metric_desc: selected.metric_desc,
                display: selected.display
            }
        }).then(function(res) {
            scope.getData();
            scope.isSelected = false;
            // $http({
            //     //TODO: Add metric_id
            //     url: "http://localhost:8080/csvUpload/",
            //     method: "POST",
            //     headers: {
            //         // "Accept": "text/csv",
            //         "Content-Type": "multipart/form-data"
            //     },
            //     processData: false,
            //     data: '',
            //     csv: scope.metric_data,
            //     // mimeType: "multipart/form-data",
            //     params: {
            //         metric_id: selected.metric_id
            //     }
            // })
        })
    }


    scope.selected = {
        metric_id: "",
        metric_name: "",
        metric_desc: "",
        display: false,
        file: null
    };

    scope.isSelected = false;

    scope.editSelect = function(row) {
        scope.selected.metric_id = row.metric_id;
        scope.selected.metric_name = row.metric_name;
        scope.selected.metric_desc = row.metric_desc;
        scope.selected.display = row.display;
        scope.isSelected = true;
    }



    scope.getData = function() {
        $http({
            url: econSuppServiceBase + "/supp_metric_list",
            method: "GET",
            // params: {}
        }).then(function(res) {
            scope.rowCollection = res.data.sort(function(a, b) {
                return a.metric_id > b.metric_id;
            });
            scope.rowCollection.forEach(function(d, i) {
                d.generatedRandom = Math.floor(Math.random() * 2000000)
            })
        })
    }
    scope.getData();


}]).directive('stRatio', function() {
    return {
        link: function(scope, element, attr) {
            var ratio = +(attr.stRatio);

            element.css('width', ratio + '%');

        }
    };
}).directive('fileModel', ['$parse', function($parse) {
    return {
        restrict: 'A',
        link: function(scope, element, attrs) {
            var model = $parse(attrs.fileModel);
            var modelSetter = model.assign;
            element.bind('change', function() {
                scope.$apply(function() {

                    modelSetter(scope, element[0].files[0]);
                });
            });
        }
    };
}]);


app.controller('AboutCtrl', function($scope, $mdDialog) {
    $scope.customFullscreen = false;
    $scope.showAdminAbout = function(ev) {
        $mdDialog.show({
            templateUrl: 'partials/admin-about.html',
            parent: angular.element(document.body),
            targetEvent: ev,
            clickOutsideToClose: true,
            fullscreen: $scope.customFullscreen // Only for -xs, -sm breakpoints.
        })
    };
}).filter('YesNo', function() {
    return function(text) {
        return text ? "Yes" : "No";
    }
})
