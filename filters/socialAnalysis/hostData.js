/**
 * @author Hao Sun
 * @date 20160512
 * @fileoverview 圈主数据
 */
var util = require("../../utils"),
    _ = require("lodash");

module.exports = {
    hostOne(data) {
        var source = data.first.data[0],
            newData = {
                one : 0,
                two : 0,
                three : 0,
                four : 0,
                five : 0
            };

        return util.toTable([[newData]], data.rows, data.cols);
    },
    hostTwo(data) {
        var source = data.first.data[0],
            array = ["APP", "WAP", "PC", "总计"],
            newData = [],
            obj = {};

        for(let key of array) {
            obj[key] = {
                sum_first_groupOwner_num : 0,
                sum_new_groupOwner_num : 0,
                sum_attention_groupOwner_num : 0,
                sum_cancel_attention_groupOwner_num : 0
            }
        }

        for(let key of source) {
            obj[key.type].sum_first_groupOwner_num = key.sum_first_groupOwner_num;
            obj["总计"].sum_first_groupOwner_num = key.sum_first_groupOwner_num;
            obj[key.type].sum_new_groupOwner_num = key.sum_new_groupOwner_num;
            obj["总计"].sum_new_groupOwner_num = key.sum_new_groupOwner_num;
            obj[key.type].sum_attention_groupOwner_num = key.sum_attention_groupOwner_num;
            obj["总计"].sum_attention_groupOwner_num = key.sum_attention_groupOwner_num;
            obj[key.type].sum_cancel_attention_groupOwner_num = key.sum_cancel_attention_groupOwner_num;
            obj["总计"].sum_cancel_attention_groupOwner_num = key.sum_cancel_attention_groupOwner_num;
        }

        for(let key in obj) {
            newData.push({
                type : key,
                sum_first_groupOwner_num : obj[key].sum_first_groupOwner_num,
                rate : util.toFixed(obj[key].sum_first_groupOwner_num, obj["总计"].sum_first_groupOwner_num),
                sum_new_groupOwner_num : obj[key].sum_new_groupOwner_num,
                sum_attention_groupOwner_num : obj[key].sum_attention_groupOwner_num,
                sum_cancel_attention_groupOwner_num : obj[key].sum_cancel_attention_groupOwner_num
            });
        }

        return util.toTable([newData], data.rows, data.cols);
    },
    hostThree(data, filter_key, dates) {
        var source = data.first.data[0],
            type = "line",
            newData = {},
            filter_name = {
                sum_first_groupOwner_num : "首当圈主数",
                sum_new_groupOwner_num : "新增圈主数",
                sum_attention_groupOwner_num : "关注次数",
                sum_cancel_attention_groupOwner_num : "取关次数"
            },
            map = {
                value : filter_name[filter_key]
            };

        for(let date of dates) {
            newData[date] = {
                value : 0
            };
        }

        for(let key of source) {
            var date = util.getDate(key.date);
            newData[date].value = key[filter_key];
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : false //柱状图竖着
            }
        }];
    },
    hostFour(data, filter_key) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            obj = {},
            filter_name = {
                new_groupOwner_num : "圈主",
                new_fans_num : "粉丝数"
            },
            map = {
                value : filter_name[filter_key]
            },
            newData = {};

        for(var key of orderData) {
            obj[key.id] = {
                value : 0
            }
        }
        for(var key of source) {
            obj[key.category_id].value += key[filter_key];
        }
        for(var key of orderData) {
            newData[key.name] = {
                value : obj[key.id].value
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    hostFive(data, query) {
        var source = data.first.data[0],
            orderData = data.second.data[0],
            type = "pie",
            obj = {},
            filter_name = {
                new_groupOwner_num : "圈主",
                new_fans_num : "粉丝数"
            },
            filter_key = query.filter_key || "-1",
            map = {
                value : filter_name[query.filter_key2]
            },
            newData = {};
        for(var key of orderData) {
            if(key.pid === filter_key) {
                obj[key.id] = {
                    value : 0
                }
            }
        }

        for(var key of source) {
            obj[key.category_id].value += key[query.filter_key2];
        }

        for(var key of orderData) {
            if(key.pid === filter_key) {
                newData[key.name] = {
                    value : obj[key.id].value
                };
            }
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }]
    },
    hostSix(data, page) {
        var source = data.first.data[0],
            page = page || 1,
            count = data.first.count > 100 ? 100 : data.first.count,
            newData = [];
        for(var i = 0; i < source.length; i++) {
            source[i].id = (page - 1) * 20 + i +1;
            newData.push(source[i]);
        }
        return util.toTable([newData], data.rows, data.cols, [count]);
    }
};