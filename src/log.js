import prettyBytes from "pretty-bytes";
import { gradientColors, parseTime } from "./util";

export function parseLogFiles(logFiles) {
  const logs = [];

  for (const fileName of Object.keys(logFiles)) {
    let benckmarkName = fileName
      .substring(fileName.lastIndexOf("/") + 1, fileName.lastIndexOf("."))
      .replace(/_/g, " ");

    const logObject = logFiles[fileName].default;
    const contextObject = logObject["context"];
    const cacheInfo = parseCacheInfo(contextObject['caches']);
    const benchmarkObject = logObject["benchmarks"]
      .filter((e) => e["run_type"] == "iteration")
      .sort((a, b) => a["cpu_time"] - b["cpu_time"]);

    const benchmarkCases = benchmarkObject.length;

    const benchmarkColors = gradientColors(
      "#1565C0",
      "#b92b27",
      Math.max(benchmarkObject.length, 2)
    );

    const chartOption = {
      title: {
        text: logObject["context"]["executable"],
      },
      tooltip: {},
      legend: {
        data: ["测试样例"],
      },
      xAxis: {
        type: "log",
      },
      yAxis: {
        type: "category",
        data: benchmarkObject.map((e) => e["name"]),
        show: false,
      },
      dataZoom: [
        {
          show: true,
          realtime: true,
          type: "slider",
          maxValueSpan: 10,
          handleSize: 0,
          height: "80%",
          showDetail: false,
          showDataShadow: false,
          start: 0,
          end: 100,
          yAxisIndex: [0, 1],
        },
        {
          type: "inside",
          show: true,
          yAxisIndex: [0, 1],
          start: 1,
          end: 10,
        },
      ],
      series: [
        {
          name: "测试样例",
          type: "bar",
          data: benchmarkObject.map((e) => e["cpu_time"]),
          barWidth: 30,
          emphasis: {
            focus: "self",
          },
          itemStyle: {
            normal: {
              color: function (params) {
                return benchmarkColors[params.dataIndex];
              },
              label: {
                show: true,
                position: "right",
                formatter: function (params) {
                  const obj = benchmarkObject[params["dataIndex"]];

                  return `${obj["name"]}\n${parseTime(params["value"], obj["time_unit"])}`;
                },
                textStyle: {
                  color: "#000",
                  fontSize: 13,
                  fontWeight: "bold",
                },
              },
            },
          },
        },
      ],
    };

    logs.push({
      fileName: fileName,
      contextObject: contextObject,
      cacheInfo: cacheInfo,
      benchmarkObject: benchmarkObject,
      benchmarkName: benckmarkName,
      benchmarkCases: benchmarkCases,
      chartOption: chartOption,
    });
  }

  return logs;
}

function parseCacheInfo(cacheInfo) {
    const ret = {};

    for(const cache of cacheInfo) {
        const cacheString = prettyBytes(cache['size']);

        if(cache['level'] == 1) {
            if(cache['type'] == 'Instruction') {
                ret['L1I'] = cacheString;
            } else if(cache['type'] == 'Data') {
                ret['L1D'] = cacheString;
            }
        } else if(cache['level'] == 2) {
            ret['L2'] = cacheString;
        } else {
            ret['L3'] = cacheString;
        }
    }

    return ret;
}