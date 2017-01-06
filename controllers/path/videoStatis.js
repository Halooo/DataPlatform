/**
 * @author Mr.He
 * @date 20160511
 * @fileoverview 社交分析
 */

module.exports = {
    video() {
        return {
            id : 108,
            name : "视频统计",
            path : "/videoStatis/video",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title : "播放统计",
                    query_api : "/videoStatis/videoOne"
                },
                {
                    type : "chart",
                    title : "播放趋势",
                    query_api : "/videoStatis/videoTwo"
                },
                {
                    type : "table",
                    title : "播放明细",
                    query_api : "/videoStatis/videoThree"
                },
            ]
        }
    },
    videoEdition() {
        return {
            id : 109,
            name : "视频版本统计",
            path : "/videoStatis/edition",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "版本统计",
                    query_api : "/videoStatis/videoFour"
                }
            ]
        }
    },
    videoKpi() {
        return {
            id: 1002,
            name : "视频播放KPI",
            path : "/videoStatis/videokpi",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "指标概览 (12/14)",
                    query_api : "/videoStatis/videoKpiOne"
                },
                {
                    type : "chart",
                    title: "指标趋势",
                    query_api : "/videoStatis/videoKpiTwo"
                },
                {
                    type : "table",
                    title: "数据明细",
                    query_api : "/videoStatis/videokpiThree"
                }
            ]
        }
    },
    videoDetails() {
        return {
            id: 200,
            name : "视频明细",
            path : "/videoStatis/videoDetails",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "视频明细",
                    query_api : "/videoStatis/videoDetailsOne"
                }
            ]
        }
    },
    videoDetailsOperating() {
        return {
            id: 201,
            name : "视频明细",
            path : "/videoStatis/videoDetailsOperating",
            display : true,
            defaultData : [
                {
                    type : "chart",
                    title: "趋势",
                    query_api : "/videoStatis/videoDetailsOperatingOne"
                }
            ]
        }
    },
    videoDetailsTwo() {
        return {
            id: 201,
            name : "视频明细",
            path : "/videoStatis/videoDetails2",
            display : true,
            defaultData : [
                {
                    type : "table",
                    title: "视频明细",
                    query_api : "/videoStatis/videoDetailsTwo"
                }
            ]
        }
    }
};