var otherJS="/assets/js/echarts.min.js";//js文件路径
if($('#other_js').length == 0){
    $('.container').after('<script src="'+otherJS+'" id="other_js"></script>');
}

// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('visitor'));
// 指定图表的配置项和数据
var option = {
    title: {
        text: '访问统计'
    },
    tooltip : {
        trigger: 'axis'
    },
    legend: {
        data:['PV','UV','IP']
    },
    toolbox: {
        feature: {
            saveAsImage: {}
        }
    },
    grid: {
        left: '3%',
        right: '4%',
        bottom: '3%',
        containLabel: true
    },
    xAxis : [
        {
            type : 'category',
            boundaryGap : false,
            data : ['周一','周二','周三','周四','周五','周六','周日']
        }
    ],
    yAxis : [
        {
            type : 'value'
        }
    ],
    series : [
        {
            name:'PV',
            type:'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data:[120, 132, 101, 134, 90, 230, 210]
        },
        {
            name:'UV',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[220, 182, 191, 234, 290, 330, 310]
        },
        {
            name:'IP',
            type:'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data:[150, 232, 201, 154, 190, 330, 410]
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);