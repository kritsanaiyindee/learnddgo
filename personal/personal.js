import "../vendors/@progress/kendo-ui/2020.3.1118/js/kendo.all.min.js"

async function init(){
    await initLanguage();
    initKendoUI();
}

async function initLanguage() {
    await i18nLoader(i18nUrl, ["en", "th"]);
    //alert(i18nUrl);
    bindDropdownLanguage(currentLang);
    bindI18n(currentLang);
}


//initial kendoui component ******




function init_grd_personal(){

    $('#grid').kendoGrid({
        height: 650,
        sortable: true
    });
    //*** initial data grid
    $('#grd_personal').kendoGrid({
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
        edit: function(e) {
            if (e.model.isNew()){
                //e.container.data("kendoWindow").title("Add New");
                e.container.data("kendoWindow").setOptions({
                    title: 'Add'
                });
                $("#avatar_image").click(function() {
                    //alert(1);
                    $("#files").click();
                })

                $('#files').change(function() {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                    // get loaded data and render thumbnail.
                    //alert(e.target.result);
                        document.getElementById("avatar_image").src = e.target.result;
                    };

                    // read the image file as a data URL.
                    reader.readAsDataURL(this.files[0]);

                    //$('#test_form').submit();
                });
                var data = [
                { text: "Student", value: "1" },
                { text: "Administrator", value: "2" },
                ];
                $("#txt_pop_user_role").kendoDropDownList({
                dataTextField: "text",
                dataValueField: "value",
                dataSource: data,
                height: 100
                });



                initLanguage();



            }else{
                //e.container.data("kendoWindow").title("Update");
                e.container.data("kendoWindow").setOptions({
                    title: 'Update'
                });
                                $("#avatar_image").click(function() {
                    //alert(1);
                    $("#files").click();
                })

                $('#files').change(function() {
                    var reader = new FileReader();

                    reader.onload = function (e) {
                    // get loaded data and render thumbnail.
                    //alert(e.target.result);
                        document.getElementById("avatar_image").src = e.target.result;
                    };

                    // read the image file as a data URL.
                    reader.readAsDataURL(this.files[0]);

                    //$('#test_form').submit();
                });
                initLanguage();

            }

        },
    // detailTemplate: kendo.template($("#user_create_tempalte").html()),
      //detailInit: detailInit,
     // template: kendo.template($("#user_create_tempalte").html()),
     dataSource: {
        transport: {
            read: function (options) {
                fetch("../datasets/personal/personal_grid.json", {
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
        {field: 'user_name', dir: 'desc'},
        ],
        serverSorting: true,
        serverFiltering: true,
        serverPaging: true,
        pageSize: 10,
        schema: {
            data: 'datas',
            total: 'total',
            model: {
                id:"user_name",
                fields: {
                    "user_name": {type: "string"},
                    "first_name": {type: "string"},
                    "last_name": {type: "string"},
                    "user_email": {type: "string"},
                    "user_company": {type: "string"},
                    "user_mobile": {type: "string"},
                    "user_password": {type: "string"},
                    "user_role": {type: "string"},
                    "user_group": {type: "string"}

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
        field: "first_name",
        title: "Full Name",
        headerAttributes: {
            class: "text-center font-weight-bold"
        },
        attributes: {class: "text-left"},
    },

    {
        field: "user_role",
        title: "Role",
        headerAttributes: {
            class: "text-center font-weight-bold",
        },
        attributes: {class: "text-left"},
        width: "8em",
        attributes:{ 'style':"#=user_role!=='Admin'?'color:blue;':'color:red;'#" },
        
    },

    {
        field: "user_email",
        title: "User Email",
        headerAttributes: {
            class: "text-center font-weight-bold",
        },
        attributes: {class: "text-left"},
        width: "8em",
    },
    {
        field: "user_company",
        title: "Company",
        headerAttributes: {
            class: "text-center font-weight-bold",
        },
        attributes:{ 'style':"#=user_role!=='Admin'?'color:blue;':'color:blue;'#" },
        width: "8em",
    },
    { command: [ 
        { name: "edit",  text: { 
           edit: " ", 
           update:" ", 
           cancel: " " 
       },

                         //template:"<a role='button' class='k-grid-edit'><span class='k-icon k-i-edit'></span></a>"
                         //, template: "<a role='button' class='k-grid-edit'><span class='k-icon k-i-edit'></span></a>"
                     },
                     { name: "delete", text: '<span class="k-icon k-i-delete"></span>' }
                     ]
                     , title: " ", width: "10em" },
                     ], 
                     editable: {
                        mode: "popup",
                        template: kendo.template($("#user_create_tempalte").html())
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

    init_grd_personal();
    init_calendar();
    init_chart_OverAll();
    init_chart_MindSet();
    $("#btn_add").on("click", function(){
        var rowIdx = $(".k-textbox").val();
        $("#grd_personal").data("kendoGrid").addRow();
      //  init();

  });





    document.getElementById("btn_filter").addEventListener("click", event => {
        event.preventDefault();
        clearAllErrors();
        fetch("../datasets/personal/err_response.json", {
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
         //   alert("btn_filter");
     });

    const content = document.getElementById("content");
    content.style.display = "";
    const footer = document.getElementById("footer");
    footer.style.display = "";
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




