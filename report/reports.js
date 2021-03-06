import "../vendors/@progress/kendo-ui/2020.3.1118/js/kendo.all.min.js"

async function init(){
    await initLanguage();
    initKendoUI();
}

async function initLanguage() {
    await i18nLoader(i18nUrl, ["en", "th"]);
    bindDropdownLanguage(currentLang);
    bindI18n(currentLang);
}
function init_grd_company(){
    $('#grd_company').kendoGrid({
        height: 650,
        scrollable: true,
        sortable: {mode: 'single'},
        filterable: false,
        pageable: {
            refresh: true,
            input: true,
            numeric: false,
            pageSizes: [10, 20, 50]
        },
        detailTemplate: kendo.template($("#group_template").html()),
        detailInit: detailInit,
        dataSource: {
            transport: {
                read: function (options) {
                    clearAllErrors();
                    fetch("../datasets/company/company_grid.json", {
                        //method: 'POST',
                        cache: 'no-cache',
                        headers: {
                            'Content-Type': 'application/json'
                            // 'Content-Type': 'application/x-www-form-urlencoded',
                        },
                       //body: JSON.stringify({})
                   })
                    .then(response => response.json())
                    .then(responseObj => {
                        options.success(responseObj);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                }
                ,
                destroy: function(e) {
                        // alert(1);
                        clearAllErrors();
                        fetch("../datasets/company/err_response_company_delete.json", {
                            cache: 'no-cache'
                        })
                        .then(response => response.json())
                        .then(response => {
                            if (!response['success']) {
                                bindErrors(response['errors'], currentLang);
                                showCurrentErrors(currentLang);
                            }
                        })
                        .catch(error => console.log("filter error", error));
                        e.preventDefault();
                    }
                },
                sort: [
                {field: 'company_id', dir: 'desc'},
                ],
                serverSorting: true,
                serverFiltering: true,
                serverPaging: true,
                pageSize: 10,
                schema: {
                    data: 'datas',
                    total: 'total',
                    model: {
                        id:"company_id",
                        fields: {
                            "company_id": {type: "string"},
                            "company_name": {type: "string"}
                        }
                    },
                },
            },
            columns: [
            {
                selectable: true,
                headerAttributes: {
                    class: "text-center",
                },
                attributes: {class: "text-center"},
                width: "2em",
            },
            {
                field: "company_id",
                title: "Company ID",
                headerAttributes: {
                    class: "text-center font-weight-bold"
                },
                attributes: {class: "text-left"},
                width: "6em",
            },

            {
                field: "company_name",
                title: "Company Name",
                headerAttributes: {
                    class: "text-center font-weight-bold",
                },
                attributes: {class: "text-left"},
                width: "10em",
            },

            { command: [ 
                { name: "edit", text: { edit: " ", update: " ", cancel: " " } },
                { name: "delete", text: '<span class="k-icon k-i-delete"></span>',ttile:" " }
                ]
                , title: " ", width: "100px" },
                ], 
                editable: {
                    mode: "popup",
                    template: kendo.template($("#popup-editor").html())
                },
                save: function(e) {
                    fetch("../datasets/company/err_response_create.json", {
                        cache: 'no-cache'
                    })
                    .then(response => response.json())
                    .then(response => {
                        if (!response['success']) {
                            bindErrors(response['errors'], currentLang);
                            showCurrentErrors(currentLang);
                        }
                    })
                    .catch(error => console.log("filter error", error));
                    e.preventDefault();
                }
            });
    initLanguage();
}
function init_chart_OverAll(){
    $("#chartOverall").kendoChart({

        legend: {
            position: "top"
        },
        title: {
            text: "Overall Performance"
        },
        chartArea: {
            background: "",
            height:250
        },
        seriesDefaults: {
            type: "line",
            style: "smooth",
        },
        dataSource: {
            transport: {
                /*read: function(e) {
                    fetch("../datasets/grouping/overall_chart.json")
                    .then(response => response.json())
                    .then(response => {
                        if (!response['success']) {
                            bindErrors(response['errors'], currentLang);
                            showCurrentErrors(currentLang);
                        }
                       // alert('x');
                   })
                    .catch(error => console.log("chart error", error));
                }*/
                read: {
                    url: "../datasets/charts/overall_chart.json",
                    dataType: "json"
                }
            },

            schema:{
                data: 'datas',
                model: {
                    fields: {
                        "year": {type: "string"},
                        "user_val": {type: "number"},
                        "cohort_val": {type: "number"},
                        "total_val": {type: "number"},

                    }
                },
            },
            sort: [
            {field: 'year', dir: 'asc'},
            ],
        }, 
        series:
        [{
            type: "line",
            field: "cohort_val",
            categoryField: "year",
            name: "Cohort",
            color: "#3eaee2"
        }, {
            type: "line",
            field: "user_val",
            categoryField: "year",
            name: "User",
            color: "red"
        }],
        categoryAxis: {
            axisCrossingValue: [0, 10],
            majorGridLines: {
                visible: false
            }
        },
        valueAxis: [{
            title: {
                text: "Competition"
            },
            majorUnit: 50,
            labels: {
                template: "#=value#"
            },
            line: {
                visible: false
            }
        }],
        tooltip: {
            visible: true,
            format: "N0"
        }
    });
}
function init_chart_MindSet(){
    $("#chartMindset").kendoChart({

        legend: {
            position: "top"
        },
        title: {
            text: "Mindset"
        },
        chartArea: {
            background: "",
            height:250
        },
        seriesDefaults: {
            type: "line",
            style: "smooth",
        },
        dataSource: {
            transport: {
                /*read: function(e) {
                    fetch("../datasets/grouping/overall_chart.json")
                    .then(response => response.json())
                    .then(response => {
                        if (!response['success']) {
                            bindErrors(response['errors'], currentLang);
                            showCurrentErrors(currentLang);
                        }
                       // alert('x');
                   })
                    .catch(error => console.log("chart error", error));
                }*/
                read: {
                    url: "../datasets/charts/mindset_chart.json",
                    dataType: "json"
                }
            },

            schema:{
                data: 'datas',
                model: {
                    fields: {
                        "year": {type: "string"},
                        "user_val": {type: "number"},
                        "cohort_val": {type: "number"},
                        "total_val": {type: "number"},

                    }
                },
            },
            sort: [
            {field: 'year', dir: 'asc'},
            ],
        }, 
        series:
        [{
            type: "line",
            field: "cohort_val",
            categoryField: "year",
            name: "Cohort",
            color: "#3eaee2"
        }, {
            type: "line",
            field: "user_val",
            categoryField: "year",
            name: "User",
            color: "red"
        }],
        categoryAxis: {
            axisCrossingValue: [0, 10],
            majorGridLines: {
                visible: false
            }
        },
        valueAxis: [{
            title: {
                text: "Competition"
            },
            majorUnit: 50,
            labels: {
                template: "#=value#"
            },
            line: {
                visible: false
            }
        }],
        tooltip: {
            visible: true,
            format: "N0"
        }
    });
}
function init_calendar(){
    let today = new Date(),
    events = [
    +new Date(today.getFullYear(), today.getMonth(), 8),
    +new Date(today.getFullYear(), today.getMonth(), 12),
    +new Date(today.getFullYear(), today.getMonth(), 24),
    +new Date(today.getFullYear(), today.getMonth() + 1, 6),
    +new Date(today.getFullYear(), today.getMonth() + 1, 7),
    +new Date(today.getFullYear(), today.getMonth() + 1, 25),
    +new Date(today.getFullYear(), today.getMonth() + 1, 27),
    +new Date(today.getFullYear(), today.getMonth() - 1, 3),
    +new Date(today.getFullYear(), today.getMonth() - 1, 5),
    +new Date(today.getFullYear(), today.getMonth() - 2, 22),
    +new Date(today.getFullYear(), today.getMonth() - 2, 27)
    ];
    $("#calendar").kendoCalendar({
        value: today,
        dates: events,
        weekNumber: true,
        month: {
                        // template for dates in month view
                        content: '# if ($.inArray(+data.date, data.dates) != -1) { #' +
                        '<div class="' +
                        '# if (data.value < 10) { #' +
                        "cal_focus" +
                        '# } else if ( data.value < 20 ) { #' +
                        "cal_focus" +
                        '# } else { #' +
                        "cal_focus" +
                        '# } #' +
                        '">#= data.value  # •</div>' +
                        '# } else { #' +
                        '#= data.value  #' +
                        '# } #',
                        weekNumber: '<a class="italic">#= data.weekNumber #</a>'
                    },
                    footer: false
                });
}
async function initKendoUI() {
    //initial kendoui component ******
    $('#pop_txt_company_name').kendoTextBox();
    $('#txt_lastname').kendoTextBox();
    $('#txt_lastname').kendoTextBox();
    $('#grid').kendoGrid({
        height: 550,
        sortable: true
    });
    //*** initial data grid
    init_grd_company();
    init_calendar();
    init_chart_OverAll();
    init_chart_MindSet();
    var grid = $("#grd_company").data("kendoGrid");
    $("#btn_add").on("click", function(){
        //alert(1);
        var rowIdx = $(".k-textbox").val();
      //  alert(rowIdx);
      clearAllErrors();
      grid.addRow();



  })
    document.getElementById("btn_filter").addEventListener("click", event => {
        event.preventDefault();
        clearAllErrors();
        fetch("../datasets/company/err_response.json", {
            cache: 'no-cache'
        })
        .then(response => response.json())
        .then(response => {
            if (!response['success']) {
                bindErrors(response['errors'], currentLang);
                showCurrentErrors(currentLang);
            }
        })
        .catch(error => console.log("filter error", error));
        //alert("btn_filter");
    });

    const content = document.getElementById("content");
    content.style.display = "";
    const footer = document.getElementById("footer");
    footer.style.display = "";
}

function detailInit(e) {
    var detailRow = e.detailRow;
    detailRow.find(".detailTabstrip").kendoTabStrip({
        animation: {
            open: { effects: "fadeIn" }
        }
    });

    detailRow.find(".grp_company").kendoGrid({
        dataSource: {
            type: "odata",
            transport: {
                read: function (options) {
                    fetch("../datasets/company/group_grid.json", {
                            //method: 'POST',
                            cache: 'no-cache',
                            headers: {
                                'Content-Type': 'application/json'
                                // 'Content-Type': 'application/x-www-form-urlencoded',
                            },
                           //body: JSON.stringify({})
                       })
                    .then(response => response.json())
                    .then(responseObj => {
                        options.success(responseObj);
                    })
                    .catch(err => {
                        console.log(err);
                    });
                },
                destroy: function(e) {
                        // alert(1);
                        fetch("../datasets/company/err_response_group_delete.json", {
                            cache: 'no-cache'
                        })
                        .then(response => response.json())
                        .then(response => {
                            if (!response['success']) {
                                bindErrors(response['errors'], currentLang);
                                showCurrentErrors(currentLang);
                            }
                        })
                        .catch(error => console.log("filter error", error));
                        e.preventDefault();
                    }
                },
                serverPaging: true,
                serverSorting: true,
                serverFiltering: true,
                pageSize: 7,
                filter: { field: "group_id", operator: "eq", value: e.data.company_id },
                schema: {
                    data: 'datas',
                    total: 'total',
                    model: {
                        id:"group_id",
                        fields: {
                           "group_id": {type: "string"},
                           "group_name": {type: "string"},
                           "company_id": {type: "string"},
                           "company_name": {type: "string"}
                       }
                   },
               },
           },

           scrollable: false,
           sortable: true,
           pageable: true,
           columns: [
           { field: "group_id", title:"ID", width: "8em" },
           { field: "group_name", title:"Group Name", width: "25em" },
           { field: "company_id", title:"Company ID", width: "9em" },
           {command: [ 

            { name: "delete", text: '<span class="k-icon k-i-delete"></span>' }
            ]}
            ], 
            editable: {
                mode: "popup",
                template: kendo.template($("#popup-editor").html())
            },
            save: function(e) {
                fetch("../datasets/company/err_response_create.json", {
                    cache: 'no-cache'
                })
                .then(response => response.json())
                .then(response => {
                    if (!response['success']) {
                        bindErrors(response['errors'], currentLang);
                        showCurrentErrors(currentLang);
                    }
                })
                .catch(error => console.log("filter error", error));
                e.preventDefault();
            },

        });

    document.getElementById("btn_group_filter").addEventListener("click", event => {
        event.preventDefault();
        clearAllErrors();
        fetch("../datasets/company/err_response_group_grid.json", {
            cache: 'no-cache'
        })
        .then(response => response.json())
        .then(response => {
            if (!response['success']) {
                bindErrors(response['errors'], currentLang);
                showCurrentErrors(currentLang);
            }
        })
        .catch(error => console.log("filter error", error));
        //alert("btn_filter");
    });



    initLanguage();
}









document.addEventListener("DOMContentLoaded", function (event) {
    //initial section
    setTimeout(function () {
        document.body.classList.remove('c-no-layout-transition')
    }, 2000);

    createCookie("current_language", currentLang, 30);
    init();
});
