/*
   Licensed to the Apache Software Foundation (ASF) under one or more
   contributor license agreements.  See the NOTICE file distributed with
   this work for additional information regarding copyright ownership.
   The ASF licenses this file to You under the Apache License, Version 2.0
   (the "License"); you may not use this file except in compliance with
   the License.  You may obtain a copy of the License at

       http://www.apache.org/licenses/LICENSE-2.0

   Unless required by applicable law or agreed to in writing, software
   distributed under the License is distributed on an "AS IS" BASIS,
   WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
   See the License for the specific language governing permissions and
   limitations under the License.
*/
var showControllersOnly = false;
var seriesFilter = "";
var filtersOnlySampleSeries = true;

/*
 * Add header in statistics table to group metrics by category
 * format
 *
 */
function summaryTableHeader(header) {
    var newRow = header.insertRow(-1);
    newRow.className = "tablesorter-no-sort";
    var cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Requests";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 3;
    cell.innerHTML = "Executions";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 7;
    cell.innerHTML = "Response Times (ms)";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 1;
    cell.innerHTML = "Throughput";
    newRow.appendChild(cell);

    cell = document.createElement('th');
    cell.setAttribute("data-sorter", false);
    cell.colSpan = 2;
    cell.innerHTML = "Network (KB/sec)";
    newRow.appendChild(cell);
}

/*
 * Populates the table identified by id parameter with the specified data and
 * format
 *
 */
function createTable(table, info, formatter, defaultSorts, seriesIndex, headerCreator) {
    var tableRef = table[0];

    // Create header and populate it with data.titles array
    var header = tableRef.createTHead();

    // Call callback is available
    if(headerCreator) {
        headerCreator(header);
    }

    var newRow = header.insertRow(-1);
    for (var index = 0; index < info.titles.length; index++) {
        var cell = document.createElement('th');
        cell.innerHTML = info.titles[index];
        newRow.appendChild(cell);
    }

    var tBody;

    // Create overall body if defined
    if(info.overall){
        tBody = document.createElement('tbody');
        tBody.className = "tablesorter-no-sort";
        tableRef.appendChild(tBody);
        var newRow = tBody.insertRow(-1);
        var data = info.overall.data;
        for(var index=0;index < data.length; index++){
            var cell = newRow.insertCell(-1);
            cell.innerHTML = formatter ? formatter(index, data[index]): data[index];
        }
    }

    // Create regular body
    tBody = document.createElement('tbody');
    tableRef.appendChild(tBody);

    var regexp;
    if(seriesFilter) {
        regexp = new RegExp(seriesFilter, 'i');
    }
    // Populate body with data.items array
    for(var index=0; index < info.items.length; index++){
        var item = info.items[index];
        if((!regexp || filtersOnlySampleSeries && !info.supportsControllersDiscrimination || regexp.test(item.data[seriesIndex]))
                &&
                (!showControllersOnly || !info.supportsControllersDiscrimination || item.isController)){
            if(item.data.length > 0) {
                var newRow = tBody.insertRow(-1);
                for(var col=0; col < item.data.length; col++){
                    var cell = newRow.insertCell(-1);
                    cell.innerHTML = formatter ? formatter(col, item.data[col]) : item.data[col];
                }
            }
        }
    }

    // Add support of columns sort
    table.tablesorter({sortList : defaultSorts});
}

$(document).ready(function() {

    // Customize table sorter default options
    $.extend( $.tablesorter.defaults, {
        theme: 'blue',
        cssInfoBlock: "tablesorter-no-sort",
        widthFixed: true,
        widgets: ['zebra']
    });

    var data = {"OkPercent": 98.05978567399887, "KoPercent": 1.940214326001128};
    var dataset = [
        {
            "label" : "KO",
            "data" : data.KoPercent,
            "color" : "#FF6347"
        },
        {
            "label" : "OK",
            "data" : data.OkPercent,
            "color" : "#9ACD32"
        }];
    $.plot($("#flot-requests-summary"), dataset, {
        series : {
            pie : {
                show : true,
                radius : 1,
                label : {
                    show : true,
                    radius : 3 / 4,
                    formatter : function(label, series) {
                        return '<div style="font-size:8pt;text-align:center;padding:2px;color:white;">'
                            + label
                            + '<br/>'
                            + Math.round10(series.percent, -2)
                            + '%</div>';
                    },
                    background : {
                        opacity : 0.5,
                        color : '#000'
                    }
                }
            }
        },
        legend : {
            show : true
        }
    });

    // Creates APDEX table
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9800902425267908, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "goto_Main"], "isController": false}, {"data": [0.95160382667417, 500, 1500, "goto_service\/guestbook"], "isController": false}, {"data": [0.9642857142857143, 500, 1500, "Request_to_Base_TRUNCATE"], "isController": false}, {"data": [1.0, 500, 1500, "goto_clients"], "isController": false}, {"data": [1.0, 500, 1500, "goto_guestbook"], "isController": false}, {"data": [0.9488636363636364, 500, 1500, "POST Request to Base"], "isController": false}]}, function(index, item){
        switch(index){
            case 0:
                item = item.toFixed(3);
                break;
            case 1:
            case 2:
                item = formatDuration(item);
                break;
        }
        return item;
    }, [[0, 0]], 3);

    // Create statistics table
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8865, 172, 1.940214326001128, 6.099266779469816, 1, 1413, 4.0, 6.0, 7.0, 23.0, 29.508687837028162, 217.88463598878235, 5.140059775689035], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["goto_Main", 1777, 0, 0.0, 5.56781091727631, 3, 200, 5.0, 6.0, 7.0, 19.440000000000055, 5.937127258998406, 131.34154667782315, 0.6899591248250101], "isController": false}, {"data": ["goto_service\/guestbook", 1777, 86, 4.839617332583005, 5.137310073157003, 2, 186, 4.0, 6.0, 7.0, 25.88000000000011, 5.916962736786727, 26.382776184932556, 0.7858466134794871], "isController": false}, {"data": ["Request_to_Base_TRUNCATE", 14, 0, 0.0, 57.99999999999999, 1, 544, 4.0, 358.5, 544.0, 544.0, 0.05353626125695494, 4.705335462037055E-4, 0.0], "isController": false}, {"data": ["goto_clients", 1760, 0, 0.0, 4.600000000000001, 2, 283, 4.0, 5.0, 6.0, 11.0, 5.881841818558548, 35.23935503599286, 0.7524621857726267], "isController": false}, {"data": ["goto_guestbook", 1777, 0, 0.0, 4.458075407990992, 2, 191, 4.0, 5.0, 5.0, 12.0, 5.936869395555199, 23.840241166526347, 0.7710972945398843], "isController": false}, {"data": ["POST Request to Base", 1760, 86, 4.886363636363637, 10.350568181818181, 2, 1413, 4.0, 7.0, 12.0, 63.23999999999796, 5.861215736032157, 1.805683995134525, 2.1503471823287676], "isController": false}]}, function(index, item){
        switch(index){
            // Errors pct
            case 3:
                item = item.toFixed(2) + '%';
                break;
            // Mean
            case 4:
            // Mean
            case 7:
            // Median
            case 8:
            // Percentile 1
            case 9:
            // Percentile 2
            case 10:
            // Percentile 3
            case 11:
            // Throughput
            case 12:
            // Kbytes/s
            case 13:
            // Sent Kbytes/s
                item = item.toFixed(2);
                break;
        }
        return item;
    }, [[0, 0]], 0, summaryTableHeader);

    // Create error table
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u043E \\u0431\\u043E\\u0436\\u0435\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u043E\'\\\/", 7, 4.069767441860465, 0.07896221094190638], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 10, 5.813953488372093, 0.11280315848843768], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u044B \\u043C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B\'\\\/", 6, 3.488372093023256, 0.0676818950930626], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 7, 4.069767441860465, 0.07896221094190638], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041E\\u0442\\u043B\\u0438\\u0447\\u043D\\u044B\\u0435 \\u0440\\u0435\\u0431\\u044F\\u0442\\u0430.\'\\\/", 7, 4.069767441860465, 0.07896221094190638], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'Aplana TOP! ))\'\\\/", 8, 4.651162790697675, 0.09024252679075014], "isController": false}, {"data": ["500", 86, 50.0, 0.970107163000564], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u0441\\u0434\\u0435\\u043B\\u0430\\u043B\\u0438 \\u0441\\u0443\\u043F\\u0435\\u0440-\\u043F\\u0443\\u043F\\u0435\\u0440\'\\\/", 11, 6.395348837209302, 0.12408347433728144], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B!\'\\\/", 10, 5.813953488372093, 0.11280315848843768], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E\'\\\/", 10, 5.813953488372093, 0.11280315848843768], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0410 \\u0421\\u0435\\u0440\\u0435\\u0436\\u0430 \\u043C\\u043E\\u043B\\u043E\\u0434\\u0435\\u0446!\'\\\/", 10, 5.813953488372093, 0.11280315848843768], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8865, 172, "500", 86, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u0441\\u0434\\u0435\\u043B\\u0430\\u043B\\u0438 \\u0441\\u0443\\u043F\\u0435\\u0440-\\u043F\\u0443\\u043F\\u0435\\u0440\'\\\/", 11, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 10, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B!\'\\\/", 10, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E\'\\\/", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["goto_service\/guestbook", 1777, 86, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u0441\\u0434\\u0435\\u043B\\u0430\\u043B\\u0438 \\u0441\\u0443\\u043F\\u0435\\u0440-\\u043F\\u0443\\u043F\\u0435\\u0440\'\\\/", 11, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 10, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B!\'\\\/", 10, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E\'\\\/", 10, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0410 \\u0421\\u0435\\u0440\\u0435\\u0436\\u0430 \\u043C\\u043E\\u043B\\u043E\\u0434\\u0435\\u0446!\'\\\/", 10], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Request to Base", 1760, 86, "500", 86, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
