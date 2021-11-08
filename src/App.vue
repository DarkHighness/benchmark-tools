<script setup>
import BenchmarkChart from "./components/BenchmarkChart.vue";
import * as echarts from "echarts";
import { parseLogFiles } from "./log";
import { parseTime } from "./util";
import { ref } from "vue";

const logFiles = import.meta.globEager(`/json/*.json`);
const logs = parseLogFiles(logFiles);
const isInView = ref(false);
const selectLog = ref(null);
const chartHeight = window.innerHeight - 98 + "px";

const displayBenchmarkLog = (logItem) => {
  if (logItem != null) {
    isInView.value = true;
    selectLog.value = logItem;
  } else {
    isInView.value = false;
    selectLog.value = null;
  }
};
</script>

<template>
  <div>
    <ul class="log-list" v-if="!isInView">
      <li
        v-for="log in logs"
        :key="log.fileName"
      >
        <div class="log-title" @click="displayBenchmarkLog(log)">
          <span>{{ log.benchmarkName }}</span>
          <span>{{ `${log.benchmarkCases} Case(s)` }}</span>
        </div>
        <div class="log-table">
          <table>
            <tr>
              <td>Date</td>
              <td colspan="2">
                {{ new Date(log.contextObject.date).toLocaleString() }}
              </td>
            </tr>
            <tr>
              <td>Host</td>
              <td colspan="2">{{ log.contextObject.host_name }}</td>
            </tr>
            <tr>
              <td>Cpu</td>
              <td>
                {{ log.contextObject.num_cpus }} x
                {{ log.contextObject.mhz_per_cpu }} MHz
              </td>
            </tr>
            <tr>
              <td>Cache</td>
            </tr>
            <tr>
              <td></td>
              <td>L1 Instruction</td>
              <td>{{ log.cacheInfo["L1I"] }}</td>
            </tr>
            <tr>
              <td></td>
              <td>L1 Data</td>
              <td>{{ log.cacheInfo["L1D"] }}</td>
            </tr>
            <tr>
              <td></td>
              <td>L2</td>
              <td>{{ log.cacheInfo["L2"] }}</td>
            </tr>
            <tr>
              <td></td>
              <td>L3</td>
              <td>{{ log.cacheInfo["L3"] }}</td>
            </tr>
            <tr>
              <td>Benchmarks</td>
              <td colspan="2">Name</td>
              <td colspan="3">Cpu Time</td>
              <td colspan="3">Real Time</td>
              <td>Threads</td>
              <td colspan="2">Iterations</td>
            </tr>
            <tr v-for="benchmark in log.benchmarkObject" :key=benchmark>
              <td></td>
              <td colspan="2">{{benchmark['name']}}</td>
              <td colspan="3">{{ parseTime(benchmark['cpu_time'], benchmark['time_unit']) }}</td>
              <td colspan="3">{{ parseTime(benchmark['real_time'], benchmark['time_unit']) }}</td>
              <td>{{benchmark['threads']}}</td>
              <td colspan="2">{{benchmark['iterations']}}</td>
            </tr>
          </table>
        </div>
      </li>
    </ul>
    <div class="chartView" v-if="isInView">
      <BenchmarkChart
        :option="selectLog.chartOption"
        :height="chartHeight"
        class="chart"
      ></BenchmarkChart>
      <div class="operations">
        <button @click="displayBenchmarkLog(null)">⬅️ Back</button>
      </div>
    </div>
  </div>
</template>

<style>
.log-list {
  list-style: none;
  margin: 0;
  padding: 0;
  display: flex;
  flex-direction: column;
  justify-content: center;
  padding: 8px 24px;
}

.log-list > li > .log-title {
  font-size: 18px;
  font-weight: bold;
  text-transform: capitalize;
  padding: 12px 0;
  border-bottom: black 2px solid;
  display: flex;
  justify-content: space-between;
}

.log-list > li > .log-title > span:last-child {
  text-transform: none;
}

.chartView {
  display: flex;
  flex-direction: column;
  padding: 16px;
}

.chartView .operations {
  left: 16px;
  bottom: 0;
  display: flex;
}

.operations > button {
  border: none;
  background: #409eff;
  color: white;
  font-size: 16px;
  padding: 12px 16px;
  border-radius: 8px;
  text-transform: uppercase;
}

.log-table > table > tr > td {
  min-width: 80px;
}
</style>
