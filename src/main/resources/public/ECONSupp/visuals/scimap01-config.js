configs.scimap01 = {
    visualization: {
        disc_id: "disc_id",
        subd_id: "subd_id",
        bundleOpts: {
            bundling_stiffness: 0,
            cycles: 0,
            subdivision_points_seed: 0,
            subdivision_rate: 0,
            iterations: 0,
            iterations_rate: 0,
            bundling_stiffness: 0,
            step_size: 0
        }
    },
    records: {
        styleEncoding: {
            size: {
                attr: "metric_avg",
                range: [1, 12, 24],
                scaleType: "linear"
            }
        }
    },
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

var uniqueMetricList = [];
var sliderRange = [2006, 2016];
var firstRun = true;
var selectedMetrics = [];

events.scimap01 = function(scope) {
    scimap01.p.then(function() {



        var disc_list = [];
        var subd_list = [];

        var discinput;
        var subdiscinput;
        var pingInterval = null;
        var $range = $("#range");
        var slider = $("#range").data("ionRangeSlider");
        var sliderFormElem = $("#sliderForm");
        var metricFormElem = $("#metricForm0");
        var legend = $(".legend");
        var toggleMetricDisplayElem = $("#toggleMetricDisplay")
        var metricFormScope = angular.element(metricFormElem).scope();
        var sliderFormScope = angular.element(sliderFormElem).scope();
        var toggleMetricDisplayScope = angular.element(toggleMetricDisplayElem).scope()
        var updateFilter = updateFilter;

        underlyingScimapData.disciplines.forEach(function(d, i) {
            disc_list.push(d.disc_name);
        })
        underlyingScimapData.nodes.forEach(function(d, i) {
            subd_list.push(d.subd_name);
        })


        disableInactiveNodes();
        nestMetricData();
        bindDOM();
        updateFilter(metricFormScope.selected);
        applySVGEvents();

        function nestMetricData() {
            scimap01.nestedData.sub_disc.forEach(function(d, i) {
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
        function loopPing(selection) {
            clearInterval(pingInterval);
            pingInterval = null;
            pingTransition(selection);
            pingInterval = setInterval(function() {
                pingTransition(selection)
            }, 2500);
        }
        function pingTransition(selection) {
            selection
                .transition().duration(500).ease("bounce")
                    .style("stroke", "white").style("stroke-width", 10)
                .transition().duration(750).ease("bounce")
                    .style("stroke-width", 0)
                .transition().duration(500).ease("bounce")
                    .style("stroke", "white").style("stroke-width", 10)
                .transition().duration(750).ease("bounce")
                    .attr("stroke-width", 0)
        }
        function generateScales(attr, range) {
            var metricScales = {};

            //Returns object with sub-objects of each possible metric. 
            scimap01.configs.metricsFilterList.forEach(function(d, i) {
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
            scimap01.nestedData.sub_disc.forEach(function(d, i) {
                d.nestedMetrics = d3.nest()
                    .key(function(d1) {
                        return d1[scimap01.configs.metricsFilter]
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

            legend.addClass("default");
            var type = toggleMetricDisplayScope.selected;

            var arcInnerRadius = 1;
            var arcOuterRadius = 5;
            var range = [arcInnerRadius, arcOuterRadius];

            var metricScales = generateScales("metric_sum", range);



            var attr = attr || "metric_sum";
            scimap01.SVG.underlyingNodeG.selectAll(".metric").remove();
            var metricSumRange = {
                min: Number.POSITIVE_INFINITY,
                max: Number.NEGATIVE_INFINITY,
            }
            scimap01.nestedData.sub_disc.forEach(function(d, i) {
                d.metricVals = {};
                d.metricSum = 0;
                selected.forEach(function(d1, i1) {

                    var match = d.values.metrics.filter(function(d2, i2) {
                        return d1 == d2.key
                    })
                    if (match.length > 0) {
                        var m = match[0].values.measureVal;
                        d.metricVals[d1] = m;
                        d.metricSum += m;
                    }
                })
                if (d.metricSum < metricSumRange.min) metricSumRange.min = d.metricSum;
                if (d.metricSum > metricSumRange.max) metricSumRange.max = d.metricSum;
            })



            scimap01.SVG.underlyingNodeG.on("click.display", function(d, i) {
                if (!d.disabled) {
                    var legendHexG = d3.select("#rect-legend-bar-group");
                    var data = scimap01.nestedData.sub_disc.filter(function(d1, i1) {
                        return d.subd_id == d1.key
                    })[0];
                    legendHexG.selectAll(".rectG").remove()
                    legendHexG.selectAll(".rectG")
                        .data(selected)
                        .enter()
                        .append("g")
                        .classed("rectG", true)
                        .each(function(d1, i1) {
                            var metricMatch = data.values.metrics.filter(function(d2, i2) {
                                return d2.key == d1;
                            })
                            if (metricMatch.length > 0) {
                                metricScales[d1].setScale([1, 100]);
                                var scaleVal = metricScales[d1].scale(metricMatch[0].values.measureVal)
                                d3.select(this).append("rect")
                                    .classed("metric-rect metric-rect-legend metric-rect-legend-" + i1, true)
                                    .attr("width", (173.20508075688772) / selected.length)
                                    .attr("x", (173.20508075688772 / selected.length) * i1 - (173.20508075688772 / 2))
                                    .attr("y", -scaleVal + 50)
                                    .attr("height", scaleVal)
                                    .attr("fill", "white")
                                d3.select(this).append("rect")
                                    .classed("metric-rect metric-rect-" + i1, true)
                                    .attr("width", (173.20508075688772) / selected.length)
                                    .attr("x", (173.20508075688772 / selected.length) * i1 - (173.20508075688772 / 2))
                                    .attr("y", -200)
                                    .attr("height", 200 + 50)
                                    .attr("fill", "white")
                                    .attr("opacity", .000001)
                                    .on("mouseover", function() {

                                        //TODO
                                        scope.SVG.selectAll(".metric-rect").classed("deselected", true);
                                        scope.SVG.selectAll(".metric-rect-" + i1).classed("deselected", false).classed("selected", true);
                                        $("#rect-legend-metric-name").html(d1);
                                        $("#rect-legend-metric-value").html(Utilities.formatValue.number(Utilities.round(metricMatch[0].values.measureVal, 2)));
                                    })
                                    .on("mouseout", function() {
                                        scope.SVG.selectAll(".metric-rect").classed("deselected", false).classed("selected", false);
                                        $("#rect-legend-metric-name").html("");
                                        $("#rect-legend-metric-value").html("");
                                    })
                            }
                        })
                }
            });



            scimap01.nestedData.sub_disc.forEach(function(d, i) {
                var currNode = scimap01.SVG.underlyingNodeG.filter(function(d1, i1) {
                    return d1.subd_id == d.key;
                });
                currNode.selectAll("circle").attr("r", arcOuterRadius).attr("opacity", 1)
                currNode.selectAll("text").attr("y", -arcOuterRadius - 2)
                if (metricFormScope.selected.length == 1) {                    
                    increaseRadius(d, selected, currNode, metricSumRange, [2, 24])
                    $("#legendNodeSizeContainer").css("display", "block")
                    $("#legendNodeBarContainer").css("display", "none")
                } else {
                    $("#legendNodeSizeContainer").css("display", "none")
                    $("#legendNodeBarContainer").css("display", "block")                    
                    switch (type[0]) {
                        case "Bar":
                            appendRects(d, selected, currNode.append("g").classed("metric", true), range, metricScales)
                            break;
                        case "Arc":
                            appendArcs(d, selected, currNode.append("g").classed("metric", true), range, metricScales)
                            break;
                        case "Clover":
                            appendClovers(d, selected, currNode.append("g").classed("metric", true), range, metricScales, currNode.selectAll("circle").attr("opacity", 0).attr("fill"))
                            break;
                    }
                }
            })
            $("#scimap-loading").css("display", "none")
        }        
        function getMetricSize(d, d1, metricScales) {
            var metric = d.nestedMetrics.filter(function(d2, i2) {
                return d2.key == d1;
            })[0]

            if (metric) {
                return metricScales[d1].scale(d.metricVals[d1])
            }
            return 0;
        }
        function appendRects(d, selected, currNode, range, metricScales) {
            var rectOffset = range[1] * Math.cos(Math.pow(Math.PI, 2) * 2);
            var barWidth = rectOffset / selected.length * 2;
            var rectGroup = currNode.attr("transform", function(d1, i1) {
                    var x = -rectOffset;
                    var y = rectOffset;
                    return "translate(" + [x, y] + ")";
                })
                .selectAll("barG")
                .data(selected)
                .enter()
            rectGroup.append("rect")
                .attr("class", function(d1, i1) {
                    return "metric-rect metric-rect-" + i1;
                })
                .attr("x", function(d1, i1) {
                    return barWidth * i1
                })
                .attr("width", barWidth)
                .attr("height", function(d1, i1) {
                    return getMetricSize(d, d1, metricScales);
                })
                .attr("y", function(d1, i1) {
                    return -getMetricSize(d, d1, metricScales);
                })
                .attr("stroke", "black")
                .attr("stroke-width", .25)
                .attr("fill", "white")
        }
        function increaseRadius(d, selected, currNode, metricSumRange, range) {
            var sum = 0;
            selected.forEach(function(d1, i1) {
                if (d.metricVals[d1]) {
                    sum += d.metricVals[d1];
                }
            })
            var scale = d3.scale.linear()
                .domain([metricSumRange.min, metricSumRange.max])
                .range(range)

                updateNodeSizeLegend(scale);



            currNode.selectAll("circle").attr("r", scale(sum))
        }
        function updateNodeSizeLegend(scale) {
            nodeSize.SVG.selectAll("circle").attr("stroke", "white");
            nodeSize.SVG.selectAll("line").attr("stroke", "white");
            nodeSize.SVG.selectAll("text").attr("fill", "white");

            nodeSize.setTitle("")
            nodeSize.updateNodeSize(range);
            nodeSize.updateTextFromFunc(function(d) {
                return scale.invert(d / 2) / scope.zoom.scale();
            });

            scope.SVG.on("mousewheel", function() {
                setTimeout(function() {
                    nodeSize.updateTextFromFunc(function(d) {
                        return scale.invert(d / 2) / scope.zoom.scale();
                    });
                }, 10);
            });
        }
        function bindDOM() {
            sliderFormElem.find(".submit-btn").on("click", function() {
                legend.addClass("default");
                legend.removeClass("shown");
                $("#scimap-loading").css("display", "block");
                //TODO: Switch this back
                scimap01.switchDatasource(econSuppServiceBase + "/met_sums?pub_year_min=" + sliderRange[0] + "&pub_year_max=" + sliderRange[1], { update: true })
            });

            $range.ionRangeSlider({
                min: 1959,
                max: 2016,
                from: sliderRange[0],
                type: 'double',
                step: 1,
                grid: true,
                onChange: function(newVal) {
                    console.log(newVal);
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

            $("#awesomplete-search-btn").on("click", function() {
                var discString = $("input.disc-input")[0].value;
                var subdString = $("input.subd-input")[0].value;
                var discArr = discString.split(", ");
                var subdArr = subdString.split(", ");
                discArr.forEach(function(d, i) {
                    var discMatch = underlyingScimapData.disciplines.filter(function(d1, i1) {
                        return d1.disc_name == d;
                    });
                    if (discMatch.length > 0) {
                        var filtered = scope.SVG.underlyingNodeG.filter(function(d1, i1) {
                            return d1.disc_id == discMatch[0].disc_id && !d1.disabled;
                        })
                        filtered.moveToFront();
                        loopPing(filtered.selectAll("circle"))
                    }
                })
                subdArr.forEach(function(d, i) {
                    var subdMatch = underlyingScimapData.nodes.filter(function(d1, i1) {
                        return d1.subd_name == d;
                    });
                    if (subdMatch.length > 0) {
                        var filtered = scope.SVG.underlyingNodeG.filter(function(d1, i1) {
                            return d1.subd_id == subdMatch[0].subd_id && !d1.disabled;
                        })
                        filtered.moveToFront();
                        loopPing(filtered.selectAll("circle"))
                    }
                })
            })


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

            metricFormScope.allowSelectAll = false
            metricFormScope.populateList(configs.scimap01.metricsFilterList);
            metricFormScope.deselectAll();
            if (firstRun) {
                configs.scimap01.metricsFilterList.slice(0, 4).forEach(function(d, i) {
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
                legend.addClass("legend-hide");
                updateFilter(metricFormScope.selected);
            });
            toggleMetricDisplayElem.find(".submit-btn").on("click", function() {
                legend.addClass("default");
                updateFilter();
            });

            $("#metric_desc_div").remove()
            $("#metricForm0").find("fieldset").append("<div id='metric_desc_div'></br><b style='font-size:14px;'>Metric Description:</b></br><span id='metric_description_text' style='font-size:12px'></span></div>")

            $("#metricForm0").find("._md-label").on("mouseover", function() {
                var selectedMetric = $(this).find("span")[0].innerText;
                var metricMatch = configs.scimap01.metricsDescList.filter(function(d, i) {
                    return d.metric_name == selectedMetric
                })

                if (metricMatch.length > 0) {
                    $("#metric_description_text").text(metricMatch[0].metric_desc)
                }
            })
        }
        function applySVGEvents() {
            scope.SVG.background.on("click.removesublist", function(d, i) {
                $("#selected-subd").text("");
                $("#selected-subd-list").empty();
            })
            scimap01.SVG.underlyingNodeG.on("click.legend", function(d, i) {
                if (!d.disabled) {
                    angular.element($("#legend-table-container")).scope().clearTableData();
                    angular.element($("#legend-table-container")).scope().$apply();
                    $("#legend-table-progress").css("display", "block");
                    $("#legend-table").css("display", "none");

                    $("#legend-disc-name").text(d.disc_name)
                    $("#legend-subd-name").text(d.subd_name)

                    var metric_idList = [];
                    metricFormScope.selected.forEach(function(d1, i1) {
                        metric_idList.push(configs.scimap01.metricsDescList.filter(function(d2, i2) {
                            return d1 == d2.metric_name;
                        })[0])
                    })

                    metric_idList.forEach(function(d1, i1) {
                        $.ajax({
                            type: 'GET',
                            url: econSuppServiceBase + '/journal_list?computed_rank=20&subd_id=' + d.subd_id + '&metric_id=' + d1.metric_id + '&limit=20' + '&pub_year_min=' + sliderRange[0] + '&pub_year_max=' + sliderRange[1],
                            success: function(res) {
                                if (res.records.data.length > 0) {
                                    $("#legend-table-progress").css("display", "none");
                                    $("#legend-table").css("display", "block");

                                    angular.element($("#legend-table-container")).scope().addTableData(res.records.data);
                                    $("#legend-table-progress").css("display", "none");
                                    $("#legend-table").css("display", "block");
                                    if (i1 == metric_idList.length - 1) {
                                        angular.element($("#legend-table-container")).scope().sortTableData(function(data) {
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
                                        angular.element($("#legend-table-container")).scope().$apply();
                                    }
                                } else {
                                    $("#legend-table-no-records").css("display", "block");
                                    $("#legend-table-progress").css("display", "none");
                                    $("#legend-table").css("display", "none");
                                }
                            }
                        });
                    });
                }
            });
            scope.SVG.underlyingNodeG.on("click.sublist", function(d, i) {
                if (!d.disabled) {
                    $("#selected-subd").text(d.subd_name)
                    $("#selected-subd") //.css({color: d.color})
                    $("#selected-subd-list").empty();
                    var uniqueRelList = [];
                    underlyingScimapData.edges.filter(function(d1, i1) {
                        return d1.subd_id1 == d.subd_id
                    }).forEach(function(d2, i2) {
                        if (uniqueRelList.indexOf(d2.subd_id2)) {
                            uniqueRelList.push(d2.subd_id2);
                        }
                    })
                    underlyingScimapData.edges.filter(function(d1, i1) {
                        return d1.subd_id2 == d.subd_id
                    }).forEach(function(d2, i2) {
                        if (uniqueRelList.indexOf(d2.subd_id1)) {
                            uniqueRelList.push(d2.subd_id1);
                        }
                    })
                    var nodeList = [];
                    uniqueRelList.forEach(function(d1, i1) {
                        nodeList.push(underlyingScimapData.nodes.filter(function(d2, i2) {
                            return d1 == d2.subd_id;
                        })[0])
                    })
                    nodeList = nodeList.sort(function(a, b) {
                        return a.disc_id > b.disc_id
                    })

                    nodeList.forEach(function(d1, i1) {
                        var li = $("<li class='sel_subd_list did" + d1.disc_id + "'></li>").text(d1.subd_name) //.css({color: d1.color})
                        $("#selected-subd-list").append(li);
                    })
                }
            });

            scimap01.SVG.underlyingNodeG.on("click.legend-display", function(d, i) {
                if (!d.disabled) {
                    legend.removeClass("legend-hide");
                    legend.removeClass("default");
                    legend.addClass("shown");
                }
            });
            scimap01.SVG.background.on("click.legend", function() {
                legend.addClass("default");
                legend.removeClass("shown");
            });
        }

        function disableInactiveNodes() {
            for (var i = 0; i < 555; i++) {
                var pairedData = scope.filteredData.records.data.filter(function(d1, i1) {
                    return d1.subd_id == i;
                })
                if (pairedData.length == 0) {
                    scope.SVG.underlyingNodeG.filter(function(d1, i1) {
                        return d1.subd_id == i;
                    }).classed("disabled", true).each(function(d1, i1) {
                        d1.disabled = true;
                    })
                }
            }
        }
    });
};

scimap01.Update = function() {
    scimap01.ResetVis({ empty: true })
}

dataprep.scimap01 = function(scope) {
    scope.filteredData.records.data.forEach(function(d, i) {
        if (d.metric_name == "Diversity of Concept") {
            d.metric_name += "s";
        }
    });
    var metric_descriptions;
    scimap01.p = new Promise(function(resolve, reject) {
        $.ajax({
            type: 'GET',
            url: scope.DataService.mapDatasource.met_list.url,
            success: function(res) {
                configs.scimap01.metricsFilterList = [];
                res.records.data.forEach(function(d, i) {
                    if (d.display) {
                        configs.scimap01.metricsFilterList.push(d.metric_name);
                        configs.scimap01.metricsDescList.push(d);
                    }
                })
                scope.filteredData.records.data.forEach(function(d, i) {
                    var metricMatch = configs.scimap01.metricsDescList.filter(function(d1, i1) {
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
    })
};
