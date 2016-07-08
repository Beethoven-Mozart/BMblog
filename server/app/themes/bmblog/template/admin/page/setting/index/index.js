var DATE1;//相对的全局变量,开始时间

var otherJS = "/assets/js/echarts.min.js";//js文件路径
if ($('#other_js').length == 0) {
    $('.container').after('<script src="' + otherJS + '" id="other_js"></script>');
}

//页面载入完成计算
var finish_load = function () {
    var date2 = new Date();
    $('#e_time').text(date2.getTime() - DATE1.getTime());
    $('#r_time').text(new Date().Format("yyyy-MM-dd hh:mm:ss"));
};

DATE1 = new Date();
// 基于准备好的dom，初始化echarts实例
var myChart = echarts.init(document.getElementById('visitor'));
// 指定图表的配置项和数据
var option = {
    title: {
        text: '访问统计'
    },
    tooltip: {
        trigger: 'axis'
    },
    legend: {
        data: ['PV', 'UV', 'IP']
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
    xAxis: [
        {
            type: 'category',
            boundaryGap: false,
            data: ['周一', '周二', '周三', '周四', '周五', '周六', '周日']
        }
    ],
    yAxis: [
        {
            type: 'value'
        }
    ],
    series: [
        {
            name: 'PV',
            type: 'line',
            stack: '总量',
            label: {
                normal: {
                    show: true,
                    position: 'top'
                }
            },
            areaStyle: {normal: {}},
            data: [120, 132, 101, 134, 90, 230, 210]
        },
        {
            name: 'UV',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [220, 182, 191, 234, 290, 330, 310]
        },
        {
            name: 'IP',
            type: 'line',
            stack: '总量',
            areaStyle: {normal: {}},
            data: [150, 232, 201, 154, 190, 330, 410]
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
myChart.setOption(option);

// 基于准备好的dom，初始化echarts实例
var visit_add = echarts.init(document.getElementById('visit-add'));
// 指定图表的配置项和数据
var option_add = {
    title: {
        text: '访客来源',
        left: 'center',
        top: 20,
        textStyle: {
            color: '#000'
        }
    },

    tooltip: {
        trigger: 'item',
        formatter: "{a} <br/>{b} : {c} ({d}%)"
    },

    visualMap: {
        show: false,
        min: 80,
        max: 600,
        inRange: {
            colorLightness: [0, 1]
        }
    },
    series: [
        {
            name: '访问来源',
            type: 'pie',
            radius: '55%',
            center: ['50%', '50%'],
            data: [
                {value: 335, name: '直接访问'},
                {value: 310, name: '邮件营销'},
                {value: 274, name: '联盟广告'},
                {value: 235, name: '视频广告'},
                {value: 400, name: '搜索引擎'}
            ].sort(function (a, b) {
                return a.value - b.value
            }),
            roseType: 'angle',
            label: {
                normal: {
                    textStyle: {
                        color: 'rgba(20, 20, 20, 0.8)'
                    }
                }
            },
            labelLine: {
                normal: {
                    lineStyle: {
                        color: 'rgba(20, 20, 20, 0.8)'
                    },
                    smooth: 0.2,
                    length: 10,
                    length2: 20
                }
            },
            itemStyle: {
                normal: {
                    color: '#c23531',
                    shadowBlur: 200,
                    shadowColor: 'rgba(0, 0, 0, 0.8)'
                }
            }
        }
    ]
};

// 使用刚指定的配置项和数据显示图表。
visit_add.setOption(option_add);

finish_load();