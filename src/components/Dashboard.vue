<script setup>
import BenchmarkChart from "./BenchmarkChart.vue";
import * as echarts from "echarts";
import { gradientColors } from "../util";

const logFiles = import.meta.globEager(`/json/*.json`);
const logs = [];

for (const fileName of Object.keys(logFiles)) {
  const logObject = logFiles[fileName].default;
  const benchmarkObject = logObject["benchmarks"]
    .filter((e) => e["run_type"] == "iteration")
    .sort((a, b) => a["cpu_time"] - b["cpu_time"]);

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
      type: "value",
    },
    yAxis: {
      type: "category",
      data: benchmarkObject.map((e) => e["name"]),
      show: false,
    },
    series: [
      {
        name: "测试样例",
        type: "bar",
        data: benchmarkObject.map((e) => e["cpu_time"]),
        barWidth: 30,
        itemStyle: {
          normal: {
            color: function (params) {
              return benchmarkColors[params.dataIndex];
            },
            label: {
              show: true,
              position: "right",
              formatter: function(params) {
                  const obj =benchmarkObject[params['dataIndex']]

                  return `${obj['name']}  ${params['value'].toFixed(2)} ${obj['time_unit']}`
              },
              textStyle: {
                color: "#000",
                fontSize: 13,
                fontWeight: 'bold'
              },
            },
          },
        },
      },
    ],
  };

  logs.push({
    fileName: fileName,
    chartOption: chartOption,
  });
}
</script>

<template>
  <BenchmarkChart
    v-for="log in logs"
    :key="log.fileName"
    :option="log.chartOption"
  ></BenchmarkChart>
</template>
