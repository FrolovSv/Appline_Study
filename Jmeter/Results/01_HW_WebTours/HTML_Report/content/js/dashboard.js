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

    var data = {"OkPercent": 99.84556978315423, "KoPercent": 0.15443021684576283};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.94253638432147, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [0.9860573199070488, 500, 1500, "find flight"], "isController": true}, {"data": [0.9825581395348837, 500, 1500, "Payment Details"], "isController": true}, {"data": [0.9969207082371054, 500, 1500, "main"], "isController": false}, {"data": [0.9014626635873749, 500, 1500, "goto main"], "isController": true}, {"data": [0.9725656877897991, 500, 1500, "goto login.pl"], "isController": false}, {"data": [0.9841576506955177, 500, 1500, "goto reservation.pl"], "isController": false}, {"data": [0.8098998459167951, 500, 1500, "login"], "isController": true}, {"data": [0.9833333333333333, 500, 1500, "choise flight"], "isController": true}, {"data": [0.9825581395348837, 500, 1500, "Buy ticket"], "isController": false}, {"data": [0.9965357967667436, 500, 1500, "goto nav.pl_home"], "isController": false}, {"data": [0.9992254066615027, 500, 1500, "JSR223 Sampler"], "isController": false}, {"data": [0.8025502318392581, 500, 1500, "goto flights"], "isController": true}, {"data": [0.9936318023928985, 500, 1500, "goto nav.pl_menu"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 15541, 24, 0.15443021684576283, 211.52731484460463, 0, 3172, 196.0, 351.0, 412.0, 541.0, 25.911513041622484, 47.36800960927652, 15.825157440035545], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["find flight", 2582, 0, 0.0, 256.4786986831914, 105, 3286, 228.0, 391.7000000000003, 450.5499999999997, 570.8700000000008, 4.315863724346353, 11.433230285888362, 3.9201118601840674], "isController": true}, {"data": ["Payment Details", 1290, 0, 0.0, 258.3558139534882, 109, 1080, 229.0, 390.0, 462.45000000000005, 622.079999999999, 2.1694782993308253, 6.208116468715786, 2.2768863293226014], "isController": true}, {"data": ["main", 1299, 0, 0.0, 176.08698999230185, 68, 666, 151.0, 285.0, 339.0, 459.0, 2.166849044517989, 2.1708645153239097, 1.2268819001589688], "isController": false}, {"data": ["goto main", 1299, 0, 0.0, 388.3464203233254, 143, 1178, 358.0, 583.0, 653.0, 830.0, 2.1647799140420725, 5.87738098189184, 2.1262926159798754], "isController": true}, {"data": ["goto login.pl", 1294, 24, 1.8547140649149922, 225.8632148377125, 79, 709, 200.0, 341.0, 394.0, 531.1999999999998, 2.1630657361360695, 2.455114609887584, 1.2689068442057754], "isController": false}, {"data": ["goto reservation.pl", 1294, 0, 0.0, 272.32148377125213, 111, 931, 247.0, 411.5, 469.25, 574.7499999999993, 2.1619526408736025, 9.542281072534847, 1.2872554123999846], "isController": false}, {"data": ["login", 2596, 24, 0.9244992295839753, 443.2580893682584, 74, 1566, 403.0, 837.3000000000002, 955.1500000000001, 1225.0900000000006, 4.331409560135015, 9.994643679099449, 5.211460129571047], "isController": true}, {"data": ["choise flight", 2580, 0, 0.0, 271.65658914728624, 108, 1526, 244.0, 411.9000000000001, 473.0, 596.0, 4.339423663987325, 13.154249192455122, 3.5292540280531965], "isController": true}, {"data": ["Buy ticket", 1290, 0, 0.0, 258.351937984496, 109, 1080, 229.0, 390.0, 462.45000000000005, 622.079999999999, 2.1712310206637233, 6.2131320054810955, 2.278725825593764], "isController": false}, {"data": ["goto nav.pl_home", 1299, 0, 0.0, 212.25943033102405, 71, 880, 191.0, 317.0, 362.0, 479.0, 2.166957484928052, 3.7123199336942707, 0.9014881724407715], "isController": false}, {"data": ["JSR223 Sampler", 1291, 0, 0.0, 3.261812548412093, 0, 3172, 1.0, 1.0, 2.0, 4.0, 2.1592889566837603, 0.0, 0.0], "isController": false}, {"data": ["goto flights", 2588, 0, 0.0, 447.9350850077276, 70, 1545, 412.5, 873.0999999999999, 1006.0, 1236.1100000000001, 4.321464889767579, 16.784351108690352, 5.118684392172939], "isController": true}, {"data": ["goto nav.pl_menu", 2591, 0, 0.0, 217.95214203010437, 74, 970, 192.0, 336.8000000000002, 387.4000000000001, 520.0799999999999, 4.324084365539501, 7.385335191116686, 2.5640237583694647], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/Welcome, &lt;b&gt;vladov&lt;\\\/b&gt;, to the Web Tours reservation pages\\\/", 24, 100.0, 0.15443021684576283], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 15541, 24, "Test failed: text expected to contain \\\/Welcome, &lt;b&gt;vladov&lt;\\\/b&gt;, to the Web Tours reservation pages\\\/", 24, null, null, null, null, null, null, null, null], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["goto login.pl", 1294, 24, "Test failed: text expected to contain \\\/Welcome, &lt;b&gt;vladov&lt;\\\/b&gt;, to the Web Tours reservation pages\\\/", 24, null, null, null, null, null, null, null, null], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
