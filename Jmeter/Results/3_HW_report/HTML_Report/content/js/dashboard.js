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

    var data = {"OkPercent": 98.068669527897, "KoPercent": 1.9313304721030042};
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
    createTable($("#apdexTable"), {"supportsControllersDiscrimination": true, "overall": {"data": [0.9801784504178902, 500, 1500, "Total"], "isController": false}, "titles": ["Apdex", "T (Toleration threshold)", "F (Frustration threshold)", "Label"], "items": [{"data": [1.0, 500, 1500, "goto_Main"], "isController": false}, {"data": [0.9515492957746479, 500, 1500, "goto_service\/guestbook"], "isController": false}, {"data": [0.9666666666666667, 500, 1500, "Request_to_Base_TRUNCATE"], "isController": false}, {"data": [1.0, 500, 1500, "goto_clients"], "isController": false}, {"data": [1.0, 500, 1500, "goto_guestbook"], "isController": false}, {"data": [0.9493454752418896, 500, 1500, "POST Request to Base"], "isController": false}]}, function(index, item){
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
    createTable($("#statisticsTable"), {"supportsControllersDiscrimination": true, "overall": {"data": ["Total", 8854, 171, 1.9313304721030042, 6.231646713349861, 1, 1154, 4.0, 6.0, 9.0, 27.0, 29.515399411292123, 217.43645102032144, 5.137475508702276], "isController": false}, "titles": ["Label", "#Samples", "KO", "Error %", "Average", "Min", "Max", "Median", "90th pct", "95th pct", "99th pct", "Transactions\/s", "Received", "Sent"], "items": [{"data": ["goto_Main", 1775, 0, 0.0, 5.722253521126759, 3, 197, 5.0, 6.0, 7.0, 19.480000000000018, 5.917455660754767, 130.90637019831811, 0.6876730699509935], "isController": false}, {"data": ["goto_service\/guestbook", 1775, 86, 4.845070422535211, 5.78478873239437, 2, 459, 4.0, 6.0, 9.199999999999818, 32.200000000000045, 5.920258290029285, 25.897182311435607, 0.7862843041445143], "isController": false}, {"data": ["Request_to_Base_TRUNCATE", 15, 0, 0.0, 49.13333333333333, 1, 641, 3.0, 275.0000000000002, 641.0, 641.0, 0.05321979776476849, 4.6775212879191056E-4, 0.0], "isController": false}, {"data": ["goto_clients", 1757, 0, 0.0, 4.56118383608424, 2, 122, 4.0, 5.0, 6.0, 15.260000000000218, 5.860339145864742, 35.11052798816425, 0.7497113555744933], "isController": false}, {"data": ["goto_guestbook", 1775, 0, 0.0, 4.596056338028168, 2, 158, 4.0, 5.0, 6.0, 20.0, 5.917278118738936, 23.761569945561043, 0.768552724406522], "isController": false}, {"data": ["POST Request to Base", 1757, 85, 4.837791690381332, 10.15424018212861, 2, 1154, 4.0, 10.0, 13.0, 53.42000000000007, 5.860749655593397, 1.8040204728043872, 2.147508467357259], "isController": false}]}, function(index, item){
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
    createTable($("#errorsTable"), {"supportsControllersDiscrimination": false, "titles": ["Type of error", "Number of errors", "% in errors", "% in all samples"], "items": [{"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u043E \\u0431\\u043E\\u0436\\u0435\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u043E\'\\\/", 13, 7.60233918128655, 0.1468262932008132], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 12, 7.017543859649122, 0.1355319629545968], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041E\\u0442\\u043B\\u0438\\u0447\\u043D\\u044B\\u0435 \\u0440\\u0435\\u0431\\u044F\\u0442\\u0430.\'\\\/", 8, 4.678362573099415, 0.0903546419697312], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0410 \\u0421\\u0435\\u0440\\u0435\\u0436\\u0430 \\u043C\\u043E\\u043B\\u043E\\u0434\\u0435\\u0446!\'\\\/", 8, 4.678362573099415, 0.0903546419697312], "isController": false}, {"data": ["Response was null", 1, 0.5847953216374269, 0.0112943302462164], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 12, 7.017543859649122, 0.1355319629545968], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u044B \\u043C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B\'\\\/", 5, 2.9239766081871346, 0.056471651231082], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'Aplana TOP! ))\'\\\/", 6, 3.508771929824561, 0.0677659814772984], "isController": false}, {"data": ["500", 85, 49.707602339181285, 0.960018070928394], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u0441\\u0434\\u0435\\u043B\\u0430\\u043B\\u0438 \\u0441\\u0443\\u043F\\u0435\\u0440-\\u043F\\u0443\\u043F\\u0435\\u0440\'\\\/", 7, 4.093567251461988, 0.0790603117235148], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B!\'\\\/", 10, 5.847953216374269, 0.112943302462164], "isController": false}, {"data": ["Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0420\\u0435\\u043A\\u043E\\u043C\\u0435\\u043D\\u0434\\u0443\\u044E\'\\\/", 4, 2.3391812865497075, 0.0451773209848656], "isController": false}]}, function(index, item){
        switch(index){
            case 2:
            case 3:
                item = item.toFixed(2) + '%';
                break;
        }
        return item;
    }, [[1, 1]]);

        // Create top5 errors by sampler
    createTable($("#top5ErrorsBySamplerTable"), {"supportsControllersDiscrimination": false, "overall": {"data": ["Total", 8854, 171, "500", 85, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u043E \\u0431\\u043E\\u0436\\u0435\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u043E\'\\\/", 13, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 12, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 12, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B!\'\\\/", 10], "isController": false}, "titles": ["Sample", "#Samples", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors", "Error", "#Errors"], "items": [{"data": [], "isController": false}, {"data": ["goto_service\/guestbook", 1775, 86, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0412\\u0441\\u0435 \\u043F\\u0440\\u043E\\u0441\\u0442\\u043E \\u0431\\u043E\\u0436\\u0435\\u0441\\u0442\\u0432\\u0435\\u043D\\u043D\\u043E\'\\\/", 13, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0421\\u043F\\u0430\\u0441\\u0438\\u0431\\u043E!\'\\\/", 12, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u0411\\u043B\\u0430\\u0433\\u043E\\u0434\\u0430\\u0440\\u044E \\u0437\\u0430 \\u043E\\u0442\\u043B\\u0438\\u0447\\u043D\\u0443\\u044E \\u0440\\u0430\\u0431\\u043E\\u0442\\u0443!\'\\\/", 12, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041C\\u043E\\u043B\\u043E\\u0434\\u0446\\u044B!\'\\\/", 10, "Test failed: text expected to contain \\\/&lt;b&gt;\\u0426\\u0435\\u043D\\u0442\\u0440\\u0430\\u043B\\u044C\\u043D\\u044B\\u0439 \\u0431\\u0430\\u043D\\u043A \\u0420\\u043E\\u0441\\u0441\\u0438\\u0439\\u0441\\u043A\\u043E\\u0439 \\u0424\\u0435\\u0434\\u0435\\u0440\\u0430\\u0446\\u0438\\u0438&lt;\\\/b&gt;: \'\\u041E\\u0442\\u043B\\u0438\\u0447\\u043D\\u044B\\u0435 \\u0440\\u0435\\u0431\\u044F\\u0442\\u0430.\'\\\/", 8], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": [], "isController": false}, {"data": ["POST Request to Base", 1757, 85, "500", 85, null, null, null, null, null, null, null, null], "isController": false}]}, function(index, item){
        return item;
    }, [[0, 0]], 0);

});
