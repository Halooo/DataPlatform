/**
 * @author Hao Sun
 * @date 20160511
 * @fileoverview 圈子数据
 */

var api = require("../../../base/main"),
    filter = require("../../../filters/socialAnalysis/hostData");

module.exports = (Router) => {
    Router = new api(Router,{
        router : "/socialAnalysis/hostOne",
        modelName : ["GroupownerStatistics"],
        platform : false,
        date_picker: false,
        filter(data) {
            return filter.hostOne(data);
        },
        rows: [
            ["one", "two", "three", "four", "five"]
        ],
        cols: [
            [{
                caption: "累计圈主数",
                type: "number"
            }, {
                caption: "圈主人均粉丝数",
                type: "number"
            }, {
                caption: "累计邀请好友数",
                type: "number"
            }, {
                caption: "累计关注次数",
                type: "number"
            }, {
                caption: "累计取关次数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostTwo",
        modelName : ["GroupownerStatistics"],
        platform : false,
        procedure : [{
            aggregate : {
                value : ["type"]
            },
            sum : ["first_groupOwner_num", "new_groupOwner_num",
                "attention_groupOwner_num", "cancel_attention_groupOwner_num"],
            groupBy : ["type"],
            get : ""
        }],
        filter(data) {
            return filter.hostTwo(data);
        },
        rows: [
            ["type", "sum_first_groupOwner_num", "rate", "sum_new_groupOwner_num",
                "sum_attention_groupOwner_num", "sum_cancel_attention_groupOwner_num"]
        ],
        cols: [
            [{
                caption: "平台",
                type: "string"
            }, {
                caption: "首当圈主数",
                type: "number",
                help : "当日第一次当圈主"
            }, {
                caption: "首当圈主占比",
                type: "string"
            }, {
                caption: "新增圈主数",
                type: "number",
                help : "首次建立圈子的圈主数"
            }, {
                caption: "关注次数",
                type: "number"
            }, {
                caption: "取关次数",
                type: "number"
            }]
        ]
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostThree",
        modelName : [ "GroupownerStatistics" ],
        platform : false,
        //level_select : true,
        //level_select_name : "group_type",
        //level_select_url : "/api/socialAnalysisCategories",
        procedure : [{
            aggregate : {
                value : ["date"]
            },
            sum : ["first_groupOwner_num", "new_groupOwner_num",
                "attention_groupOwner_num", "cancel_attention_groupOwner_num"],
            groupBy : ["date"],
            get : ""
        }],
        filter_select : [{
            title: '指标',
            filter_key : 'type',
            groups: [{
                key: ['APP', "WAP", "PC"],
                value: '全部'
            },{
                key: 'APP',
                value: 'APP'
            },{
                key: 'WAP',
                value: 'WAP'
            },{
                key: 'PC',
                value: 'PC'
            }]
        }, {
            title: '指标',
            filter_key : 'filter_key',
            groups: [{
                key: 'sum_first_groupOwner_num',
                value: '首当圈主数'
            },{
                key: 'sum_new_groupOwner_num',
                value: '新增圈主数'
            },{
                key: 'sum_attention_groupOwner_num',
                value: '关注次数'
            },{
                key: 'sum_cancel_attention_groupOwner_num',
                value: '取关次数'
            }]
        }],
        filter(data, query, dates, type) {
            return filter.hostThree(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostFour",
        modelName : [ "GroupownerCategoryDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, data) {
            return {
                pid : ""
            };
        },
        fixedParams(req, query, cb) {
            var group_type = [];
            req.models.SocialCategory.find({
                pid : ""
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.category_id = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [
            {
                title: '指标选择',
                filter_key: 'filter_key',
                groups: [{
                    key: 'new_groupOwner_num',
                    value: '圈主'
                }, {
                    key: 'new_fans_num',
                    value: '粉丝数'
                }]
            }
        ],
        filter(data, query, dates, type) {
            return filter.hostFour(data, query.filter_key);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostFive",
        modelName : [ "GroupownerCategoryDistribution", "SocialCategory" ],
        platform : false,
        secondParams(query, params, data) {
            return {};
        },
        fixedParams(req, query, cb) {
            var filter_key = query.filter_key || "-1",
                group_type = [];
            req.models.SocialCategory.find({
                pid : filter_key
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        group_type.push(key.id);
                    }
                    query.category_id = group_type;
                    cb(null, query);
                } else {
                    cb(err);
                }
            });
        },
        selectFilter(req, cb) {
            var filter_select = {
                title: '一级分类',
                filter_key: 'filter_key',
                groups: []
            };
            req.models.SocialCategory.find({
                pid : ""
            }, (err, data) => {
                if(!err) {
                    for(var key of data) {
                        var obj = {
                            key : key.id,
                            value : key.name,
                            cell : {
                                title: '指标',
                                filter_key: 'filter_key2',
                                groups: [{
                                    key: 'new_groupOwner_num',
                                    value: '圈主'
                                }, {
                                    key: 'new_fans_num',
                                    value: '粉丝数'
                                }]
                            }
                        };
                        filter_select.groups.push(obj);
                    }
                    cb(null,[filter_select]);
                } else {
                    cb(err);
                }
            });
        },
        filter_select: [],
        filter(data, query, dates, type) {
            return filter.hostFive(data, query);
        }
    });

    Router = new api(Router,{
        router : "/socialAnalysis/hostSix",
        modelName : [ "GroupownerList" ],
        platform : false,
        paging : [true],
        order : ["-new_fans_num"],
        showDayUnit : true,
        date_picker_data: 1,
        control_table_col : true,
        search : {
            show : true,
            title : "请输入圈主ID：",
            key : "groupOwner_id"
        },
        filter(data, query, dates, type) {
            return filter.hostSix(data, query.page);
        },
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        rows: [
            [ "top", "groupOwner_name", "groupOwner_id", "daren_flag", "5", "6", "7", "8", "9" , "10",
            "11", "12", "13", "14"]
        ],
        cols: [
            [{
                caption: "排名",
                type: "number"
            }, {
                caption: "圈主名称",
                type: "string"
            }, {
                caption: "圈主ID",
                type: ""
            }, {
                caption: "是否达人",
                type: ""
            }, {
                caption: "累计发布话题数",
                type: ""
            }, {
                caption: "新增邀请好友数",
                type: ""
            }, {
                caption: "累计邀请好友数",
                type: ""
            }, {
                caption: "新增粉丝数",
                type: "number",
                help : "圈主本时间区间新关注粉丝数（第一次关注时间不在此时间区，不+1）"
            },{
                caption: "当前粉丝数",
                type: "",
                help : "当前累计的关注粉丝数"
            }, {
                caption: "新增圈子数",
                type: "number",
                help : "圈主新建圈子数"
            }, {
                caption: "当前圈子数",
                type: "",
                help : "此圈主下圈子数"
            }, {
                caption: "新增关注次数",
                type: ""
            }, {
                caption: "累计关注次数",
                type: ""
            }, {
                caption: "新增取关次数",
                type: ""
            }]
        ]
    });

    return Router;
};