<script>
import { defineComponent } from 'vue'
import { VueEcharts } from 'vue3-echarts';

export default defineComponent({
    name: 'BenchmarkChart',
    components: {
        VueEcharts
    },
    props: {
        option: {
            type: Object,
            required: true
        },
        height: {
            type: String,
            required: true
        }
    }
})
</script>

<template>
  <vue-echarts :option="option" :style="'height:' + height" ref="chart" />
</template>
