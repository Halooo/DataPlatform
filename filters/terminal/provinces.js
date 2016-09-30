/**
 * @author yanglei
 * @date 20160418
 * @fileoverview 网络及运营商
 */
var _ = require("lodash"),
    util = require("../../utils");

module.exports = {
    provincesOne(data, filter_key) {
        var source = data.first.data,
            newData = {},
            tArray = [],
            array = util.uniq(_.pluck(source, "key_name")),
            filter_name = {
                value : "新增用户",
                value3 : "启动次数"
            },
            type = "bar",
            map = {
                value : filter_name[filter_key]
            };
        for(var model of array) {
            var obj = {
                model : model,
                value : 0
            };
            for(var key of source) {
                if(model === key.key_name) {
                    obj.value += key[filter_key];
                }
            }
            tArray.push(obj);
        }
        tArray.sort((a, b) => {
            return b.value - a.value;
        });
        var top = tArray.length > 10 ? 10 : tArray.length;
        for(var i = 0; i < top; i++) {
            newData[tArray[top - 1 - i].model] = {
                value : tArray[top - 1 - i].value
            };
        }
        return [{
            type : type,
            map : map,
            data : newData,
            config: { // 配置信息
                stack: false, // 图的堆叠
                categoryY : true //柱状图竖着
            }
        }]
    },
    provincesTwo(data, filter_key) {
        var source = data.first.data,
            second = data.first.count,
            count = second.length,
            total_value = 0,
            total_value3 = 0,
            cols_name = "";
        if(filter_key === "terminal_province") {
            cols_name = "省市";
        } else {
            cols_name = "国家";
        }
        data.cols[0][0].caption = cols_name;
        for(let key of second) {
            total_value += key.value;
            total_value3 += key.value3;
        }
        for(var key of source) {
            key.new_users_rate = util.toFixed(key.value, total_value);
            key.start_up_rate = util.toFixed(key.value3, total_value3);
        }
        return util.toTable([source], data.rows, data.cols, [count]);
    }
};