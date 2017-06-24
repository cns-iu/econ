configs.hexscimap01 = {
    metrics: ["metric_sum", "metric_count", "metric_avg"],
    metricsFilter: "metric_name",
    metricsFilterList: [],
    metricsDescList: [],
    prettyMap: {
        metric_sum: "Sum",
        metric_count: "Count",
        metric_avg: "Average"
    }
};

var p;
var sliderRange = [2006, 2016];
var firstRun = true;
var selectedMetrics = [];

events.hexscimap01 = function(scope) {
    console.log("eventsout");
    p.then(function() {
        console.log("eventsin");
        var disc_list = [];
        var subd_list = [];

        var hexLegendRects;
        var hexLegendSVG = d3.select($("#heg-legend-hex")[0]);

        var discinput;
        var subdiscinput;
        var pingInterval = null;
        var parsedHexStroke = 0;
        var hexViewboxWidth = parseInt(hexLegendSVG.attr("viewBox").split(" ")[2]);
        var hexHeight = parseInt(hexLegendSVG.attr("viewBox").split(" ")[3]) / 3 * 2.25;
        var metricMeasureVal = "metric_avg";
        var $range = $("#range");
        var slider = $("#range").data("ionRangeSlider");
        var sliderFormElem = $("#sliderForm");
        var metricFormElem = $("#metricForm0");
        var hexLegend = $(".hex-legend");
        var toggleLabelsFormElem = $("#toggleLabels");
        var toggleMetricDisplayElem = $("#toggleMetricDisplay");
        var metricFormScope = angular.element(metricFormElem).scope();
        var sliderFormScope = angular.element(sliderFormElem).scope();
        var toggleLabelsFormScope = angular.element(toggleLabelsFormElem).scope();
        var toggleMetricDisplayScope = angular.element(toggleMetricDisplayElem).scope();
        var possibleMetrics = configs.hexscimap01.metricsFilterList;

        underlyingScimapData.disciplines.data.forEach(function(d, i) {
            disc_list.push(d.disc_name);
        })
        underlyingScimapData.nodes.data.forEach(function(d, i) {
            subd_list.push(d.subd_name);
        })

        disableInactiveNodes();
        bindDOM();
        nestMetricData();

        updateFilter(metricFormScope.selected);
        applySVGEvents();

        function nestMetricData() {
            hexscimap01.nestedData.sub_disc.forEach(function(d, i) {
                d.values.metrics = d3.nest().key(function(d1, i1) {
                        return d1.metric_name;
                    }).rollup(function(leaves) {
                        var obj = {
                            children: leaves
                        };
                        obj.measureVal = d3.sum(leaves, function(d2, i2) {
                            return d2.metric_sum;
                        }) / d3.sum(leaves, function(d2, i2) {
                            return d2.metric_count;
                        })

                        return obj;
                    })
                    .entries(d.values.children);
            });
        }

        var loopSelection;

        function loopPing(selection) {
            clearInterval(pingInterval);
            pingTransition(selection);
            pingInterval = setInterval(function() {
                pingTransition(selection)
            }, 2500);
        }

        function cancelPing() {
            clearInterval(pingInterval);
            setTimeout(function() {
                loopSelection.style("stroke-width", 0)
            }, 1)
        }


        function pingTransition(selection) {
            selection.transition().duration(500)
                .ease("bounce").style("stroke", "white").attr("stroke-width", 5)
                .transition().duration(750).ease("bounce")
                .style("fill", function(d, i) {
                    return d.subd_data.disc_data.color
                }).attr("stroke-width", 0)
                .transition().duration(500).ease("bounce").style("stroke", "white").attr("stroke-width", 5)
                .transition().duration(750).ease("bounce")
                .style("fill", function(d, i) {
                    return d.subd_data.disc_data.color
                }).attr("stroke-width", 0)
        }

        function generateScales(attr, range) {
            var metricScales = {};

            //Returns object with sub-objects of each possible metric. 
            hexscimap01.configs.metricsFilterList.forEach(function(d, i) {
                metricScales[d] = {
                    min: Number.POSITIVE_INFINITY,
                    max: Number.NEGATIVE_INFINITY,
                    scale: d3.scale.linear(),
                    setScale: function(range) {
                        this.scale = d3.scale.linear()
                            .domain([this.min, this.max])
                            .range(range);
                    }
                }
            })

            //For each subdiscipline, aggregate the entries by each metric. 
            hexscimap01.nestedData.sub_disc.forEach(function(d, i) {
                d.nestedMetrics = d3.nest()
                    .key(function(d1) {
                        return d1[hexscimap01.configs.metricsFilter]
                    })
                    .entries(d.values.children);
                //For each aggregated metric of a subdiscipline, compare the average of all values to the global min/max values for the metric aggregates. 

                d.values.metrics.forEach(function(d1, i1) {
                    var currScaleObj = metricScales[d1.key];
                    currScaleObj.min = d3.min([currScaleObj.min, d1.values.measureVal])
                    currScaleObj.max = d3.max([currScaleObj.max, d1.values.measureVal])
                })
            });

            //For each possible metric, create a scale using the minimum and maximum. 
            Object.keys(metricScales).forEach(function(d, i) {
                metricScales[d].setScale(range);
            })
            return metricScales;
        }

        function updateFilter(selected) {
            var metricScales = generateScales("metric_sum", [1, hexscimap01.config.hexLayout.hexRadius]);
            hexscimap01.nestedData.sub_disc.forEach(function(d, i) {
                var currHexG = hexscimap01.SVG.hexagonG.filter(function(d1, i1) {
                    return d.key == d1.subd_data.subd_id;
                })
                currHexG.selectAll(".rectG").remove()
                currHexG.selectAll(".rectG")
                    .data(selected)
                    .enter()
                    .append("g")
                    .classed("rectG", true)
                    .each(function(d1, i1) {
                        var metricMatch = d.values.metrics.filter(function(d2, i2) {
                            return d2.key == d1;
                        });
                        if (metricMatch.length > 0) {
                            metricScales[d1].setScale([1, hexscimap01.config.hexLayout.hexRadius]);
                            var scaleVal = metricScales[d1].scale(metricMatch[0].values.measureVal);
                            d3.select(this).append("rect")
                                .classed("metric-rect metric-rect-" + i1, true)
                                .attr("width", (hexscimap01.config.hexLayout.hexRadius * 1.75 - (parsedHexStroke * 2)) / selected.length)
                                .attr("x", (hexscimap01.config.hexLayout.hexRadius * 1.75 / selected.length + (parsedHexStroke)) * i1 - (hexscimap01.config.hexLayout.hexRadius * .875))
                                .attr("y", hexscimap01.config.hexLayout.hexRadius / 2 - scaleVal)
                                .attr("height", scaleVal)
                                .attr("fill", "white")
                        }
                    })
                currHexG.on("click.hex-display", function(d1, i1) {
                    if (!d1.disabled) {
                        var legendHexG = d3.select("#hex-legend-bar-group");
                        legendHexG.selectAll(".rectG").remove()
                        legendHexG.selectAll(".rectG")
                            .data(selected)
                            .enter()
                            .append("g")
                            .classed("rectG", true)
                            .each(function(d1, i1) {
                                var metricMatch = d.values.metrics.filter(function(d2, i2) {
                                    return d2.key == d1;
                                })
                                if (metricMatch.length > 0) {
                                    //Values are based on viewbox for hex-legend in partials/hex-legend.html (173.20508075688772 200)
                                    metricScales[d1].setScale([1, 100]);
                                    var scaleVal = metricScales[d1].scale(metricMatch[0].values.measureVal)
                                    d3.select(this).append("rect")
                                        .classed("metric-rect metric-rect-legend metric-rect-legend-" + i1, true)
                                        .attr("width", (173.20508075688772) / selected.length)
                                        .attr("x", (173.20508075688772 / selected.length) * i1 - (173.20508075688772 / 2))
                                        .attr("y", -scaleVal + 2)
                                        .attr("height", scaleVal)
                                        .attr("fill", "white")
                                    d3.select(this).append("rect")
                                        .classed("metric-rect metric-rect-" + i1, true)
                                        .attr("width", (173.20508075688772) / selected.length)
                                        .attr("x", (173.20508075688772 / selected.length) * i1 - (173.20508075688772 / 2))
                                        .attr("y", -100 + 2)
                                        .attr("height", 100)
                                        .attr("fill", "#CCC")
                                        .attr("opacity", .000001)
                                        .on("mouseover", function() {
                                            if (!d1.disabled) {
                                                scope.SVG.selectAll(".metric-rect").classed("deselected", true);
                                                scope.SVG.selectAll(".metric-rect-" + i1).classed("deselected", false).classed("selected", true);
                                                $("#hex-legend-metric-name").html(d1);
                                                $("#hex-legend-metric-value").html(Utilities.formatValue.number(Utilities.round(metricMatch[0].values.measureVal, 2)));
                                            }
                                        })
                                        .on("mouseout", function() {
                                            if (!d1.disabled) {
                                                scope.SVG.selectAll(".metric-rect").classed("deselected", false).classed("selected", false);
                                                $("#hex-legend-metric-name").html("");
                                                $("#hex-legend-metric-value").html("");

                                            }
                                        })
                                }
                            })
                    }
                });
            })
            $("#scimap-loading").css({ display: "none" })
        }

        function applySVGEvents() {
            scope.background.on("click.legend", function() {
                hexLegend.addClass("legend-hide");
                hexLegend.addClass("shown");
            });
            scope.SVG.hexagonG.on("click.legend-display", function(d, i) {
                if (!d.disabled) {
                    hexLegend.removeClass("default");
                    hexLegend.removeClass("legend-hide");
                    hexLegend.removeClass("shown");
                }
            });
            scope.SVG.hexagonG.on("click.legend-table", function(d, i) {
                if (!d.disabled) {
                    angular.element($("#hex-legend-table-container")).scope().clearTableData();
                    angular.element($("#hex-legend-table-container")).scope().$apply();
                    $("#hex-legend-table-progress").css("display", "block");
                    $("#hex-legend-table").css("display", "none");
                    $("#hex-legend-table-no-records").css("display", "none");
                    $("#hex-legend-disc-name").text(d.subd_data.disc_data.disc_name);
                    $("#hex-legend-subd-name").text(d.subd_data.subd_name);
                    $("#hex-legend-path").css({ "fill": d.subd_data.disc_data.color })
                    var metric_idList = [];
                    metricFormScope.selected.forEach(function(d1, i1) {
                        metric_idList.push(configs.hexscimap01.metricsDescList.filter(function(d2, i2) {
                            return d1 == d2.metric_name;
                        })[0])
                    })

                    metric_idList.forEach(function(d1, i1) {
                        $.ajax({
                            type: 'GET',
                            url: econSuppServiceBase + '/journal_list?computed_rank=20&subd_id=' + d.subd_data.subd_id + '&metric_id=' + d1.metric_id + '&limit=20' + '&pub_year_min=' + sliderRange[0] + '&pub_year_max=' + sliderRange[1],
                            success: function(res) {
                                if (res.records.data.length > 0) {
                                    $("#hex-legend-table-progress").css("display", "none");
                                    $("#hex-legend-table").css("display", "block");

                                    angular.element($("#hex-legend-table-container")).scope().addTableData(res.records.data);
                                    $("#hex-legend-table-progress").css("display", "none");
                                    $("#hex-legend-table").css("display", "block");

                                    if (i1 == metric_idList.length - 1) {
                                        angular.element($("#hex-legend-table-container")).scope().sortTableData(function(data) {
                                            return data.sort(
                                                firstBy(function(v1, v2) {
                                                    return v1.pub_year - v2.pub_year
                                                })
                                                .thenBy(function(v1, v2) {
                                                    return v1.first_name - v2.first_name
                                                })
                                                .thenBy(function(v1, v2) {
                                                    return v1.article_title - v2.article_title
                                                })
                                                .thenBy(function(v1, v2) {
                                                    return v1.pmid - v2.pmid
                                                })
                                            )

                                        });

                                        angular.element($("#hex-legend-table-container")).scope().$apply();
                                    }
                                } else {
                                    // $("#hex-legend-table-no-records").css("display", "block");
                                    $("#hex-legend-table-progress").css("display", "none");
                                    $("#hex-legend-table").css("display", "none");
                                }
                            },
                            error: function(err) {
                                console.log(err);
                            }
                        });
                    });
                }
            });
            scope.SVG.hexagonG.on("click.sublist", function(d, i) {
                if (!d.disabled) {


                    $("#selected-subd").text(d.subd_data.subd_name)
                    $("#selected-subd") //.css({color: d.subd_data.disc_data.color})
                    $("#selected-subd-list").empty();
                    var uniqueRelList = [];
                    underlyingScimapData.edges.data.filter(function(d1, i1) {
                        return d1.source == d.subd_data.subd_id
                    }).forEach(function(d2, i2) {
                        console.log(d2);
                        if (uniqueRelList.indexOf(d2.target)) {
                            uniqueRelList.push(d2.target);
                        }
                    })
                    underlyingScimapData.edges.data.filter(function(d1, i1) {
                        return d1.target == d.subd_data.subd_id
                    }).forEach(function(d2, i2) {
                        if (uniqueRelList.indexOf(d2.source)) {
                            uniqueRelList.push(d2.source);
                        }
                    })

                    var nodeList = [];
                    uniqueRelList.forEach(function(d1, i1) {
                        nodeList.push(underlyingScimapData.nodes.data.filter(function(d2, i2) {
                            return d1 == d2.subd_id;
                        })[0])
                    })
                    nodeList = nodeList.sort(function(a, b) {
                        return a.disc_data.disc_id > b.disc_data.disc_id
                    })

                    nodeList.forEach(function(d1, i1) {
                        console.log(d1)
                        var li = $("<li class='sel_subd_list did" + d1.disc_data.disc_id + "'></li>").text(d1.subd_name) //.css({color: d1.disc_data.color})
                        $("#selected-subd-list").append(li);
                    })
                }
            });
            scope.background.on("click.removesublist", function(d, i) {
                $("#selected-subd").text("");
                $("#selected-subd-list").empty();
            });
        }

        function bindDOM() {
            $("#filter-btn").on("click", function() {
                $("#scimap-loading").css({ display: "block" });
                hexLegend.addClass("legend-hide");
                hexLegend.removeClass("shown");
                console.log("switching data source")
                hexscimap01.switchDatasource(econSuppServiceBase + "/met_sums?pub_year_min=" + sliderRange[0] + "&pub_year_max=" + sliderRange[1], { update: false })
            });
            $range.ionRangeSlider({
                min: 1959,
                max: 2016,
                type: 'double',
                from: sliderRange[0],
                step: 1,
                grid: true,
                onChange: function(newVal) {
                    sliderRange = [newVal.from, newVal.to]
                }
            });
            discinput = new Awesomplete('input.disc-input[data-multiple]', {
                minChars: 0,
                maxItems: 13,
                list: disc_list,
                filter: function(text, input) {
                    return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
                },
                replace: function(text) {
                    var before = this.input.value.match(/^.+,\s*|/)[0];
                    this.input.value = before + text + ", ";
                }
            });
            subdiscinput = new Awesomplete('input.subd-input[data-multiple]', {
                minChars: 0,
                maxItems: 554,
                list: subd_list,
                filter: function(text, input) {
                    return Awesomplete.FILTER_CONTAINS(text, input.match(/[^,]*$/)[0]);
                },

                replace: function(text) {
                    var before = this.input.value.match(/^.+,\s*|/)[0];
                    this.input.value = before + text + ", ";
                }
            });

            $("#awesomeplete-clear-btn").on("click", cancelPing);


            metricFormScope.toggle = function(item, list) {
                if (metricFormScope.radio) {
                    metricFormScope.selected = [item];
                }

                if (list.length >= 4) {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    }
                } else {
                    var idx = list.indexOf(item);
                    if (idx > -1) {
                        list.splice(idx, 1);
                    } else {
                        list.push(item);
                    }
                }
            };
            metricFormScope.allowSelectAll = false;
            metricFormScope.populateList(configs.hexscimap01.metricsFilterList)
            metricFormScope.deselectAll();
            if (firstRun) {
                configs.hexscimap01.metricsFilterList.slice(0, 4).forEach(function(d, i) {
                    metricFormScope.toggle(d, metricFormScope.selected);
                });
                firstRun = false;
            } else {
                selectedMetrics.forEach(function(d, i) {
                    metricFormScope.toggle(d, metricFormScope.selected);
                })
            }
            metricFormScope.$apply();
            metricFormElem.find(".submit-btn").on("click", function() {
                hexLegend.addClass("legend-hide");
                updateFilter(metricFormScope.selected);
            });

            $("#metric_desc_div").remove()
            $("#metricForm0").find("fieldset").append("<div id='metric_desc_div'></br><b style='font-size:14px;'>Metric Description:</b></br><span id='metric_description_text' style='font-size:12px'></span></div>")

            $("#metricForm0").find("._md-label").on("mouseover", function() {
                var selectedMetric = $(this).find("span")[0].innerText;
                var metricMatch = configs.hexscimap01.metricsDescList.filter(function(d, i) {
                    return d.metric_name == selectedMetric
                })

                if (metricMatch.length > 0) {
                    $("#metric_description_text").text(metricMatch[0].metric_desc)
                }
            })
            $("#metricForm0").find("._md-label").on("mouseout", function() {
                $("#metric_description_text").text("");

            });


            $("#awesomplete-search-btn").on("click", function() {
                var discString = $("input.disc-input")[0].value;
                var subdString = $("input.subd-input")[0].value;
                var discArr = discString.split(", ");
                var subdArr = subdString.split(", ");
                discArr.forEach(function(d, i) {
                    var discMatch = underlyingScimapData.disciplines.data.filter(function(d1, i1) {
                        return d1.disc_name == d;
                    });
                    if (discMatch.length > 0) {
                        var filtered = scope.SVG.hexagonG.filter(function(d1, i1) {
                            return d1.subd_data.disc_data.disc_id == discMatch[0].disc_id && !d1.disabled;
                        })
                        filtered.moveToFront();
                        loopPing(filtered.selectAll("path"))
                    }
                })
                subdArr.forEach(function(d, i) {
                    var subdMatch = underlyingScimapData.nodes.data.filter(function(d1, i1) {
                        return d1.subd_name == d;
                    });
                    if (subdMatch.length > 0) {
                        var filtered = scope.SVG.hexagonG.filter(function(d1, i1) {
                            return d1.subd_data.subd_id == subdMatch[0].subd_id && !d1.disabled;
                        })
                        filtered.moveToFront();
                        loopPing(filtered.selectAll("path"))
                    }
                })
            })
        }

        function disableInactiveNodes() {
            for (var i = 0; i < 555; i++) {
                var pairedData = scope.filteredData.records.data.filter(function(d1, i1) {
                    return d1.subd_id == i;
                })
                if (pairedData.length == 0) {
                    d3.select(".subd_" + i).classed("disabled", true).each(function(d1, i1) {
                        d1.disabled = true;
                    })
                }
            }
        }
    });
};

hexscimap01.Update = function() {
    hexscimap01.ResetVis({ empty: true })
}
dataprep.hexscimap01 = function(scope) {
    console.log("dataprep");
    scope.filteredData.records.data.forEach(function(d, i) {
        if (d.metric_name == "Diversity of Concept") {
            d.metric_name += "s";
        }
    });


    p = new Promise(function(resolve, reject) {
        var metric_descriptions;
        $.ajax({
            type: 'GET',
            // url: 'http://localhost:8080/supp_metric_list',
            url: scope.DataService.mapDatasource.met_list.url,
            success: function(res) {
                configs.hexscimap01.metricsFilterList = [];
                res.records.data.forEach(function(d, i) {
                    if (d.display) {
                        configs.hexscimap01.metricsFilterList.push(d.metric_name);
                        configs.hexscimap01.metricsDescList.push(d);
                    }
                })

                scope.filteredData.records.data.forEach(function(d, i) {
                    var metricMatch = configs.hexscimap01.metricsDescList.filter(function(d1, i1) {
                        return d.metric_id == d1.metric_id;
                    })
                    if (metricMatch.length > 0) {
                        d.metric_name = metricMatch[0].metric_name;
                        d.display = metricMatch[0].display;
                    }
                })
                resolve();
            }
        });
    });


};
