/**
 * Created by Hao on 2016-05-18.
 */

const util = require("../../utils"),
    moment = require("moment");

module.exports = {
    vtradeOne(data, dates) {
        let source = data.first.data[0],
            total = {},
            obj = {},
            _one = {},
            _seven = {},
            newData = [];

        for(let date of dates) {
            obj[date] = {};
            for(let key of data.rows[0]) {
                if(key !== "name") {
                    obj[date][key] = 0;
                }
            }
        }

        for(let key of data.rows[0]) {
            total[key] = 0;
        }

        for(let item of source) {
            let date = util.getDate(item.date);
            for(let key in obj[dates[0]]) {
                obj[date][key] += item[key] || 0;
            }
        }

        for(let key in obj) {
            for(let k in obj[dates[0]]) {
                total[k] += obj[key][k];
            }
            obj[key].trading_amount = obj[key].trading_amount.toFixed(2);
            obj[key].ordered_amount = obj[key].ordered_amount.toFixed(2);
            obj[key].paid_amount = obj[key].paid_amount.toFixed(2);
            obj[key].custmer_price = util.division(obj[key].paid_amount, obj[key].paid_user_num);
            obj[key].order_price = util.division(obj[key].paid_amount, obj[key].paid_num);
        }

        for(let key in obj[dates[0]]) {
            _one[key] = util.toFixed(
                obj[dates[6]][key] - obj[dates[5]][key],
                obj[dates[5]][key]
            );
        }

        obj[dates[6]].name = "昨天";
        obj[dates[5]].name = "前天";
        _one.name = "环比";

        total.custmer_price = util.division(total.paid_amount, total.paid_user_num);
        total.order_price = util.division(total.paid_amount, total.paid_num);
        for(let key in obj[dates[0]]) {
            _seven[key] = util.toFixed(obj[dates[6]][key], total[key] / 7);
        }
        _seven.name = "7日平均环比";

        newData.push(obj[dates[6]]);
        newData.push(obj[dates[5]]);
        newData.push(_one);
        newData.push(_seven);

        return util.toTable([newData], data.rows, data.cols);
    },
    vtradeTwo(data, query, dates) {
        var source = data.first.data[0],
            newData = {},
            type = "line",
            filter_key = query.filter_key,
            filter_name = {
                ordered_num: '下单总量',
                paid_num: '支付订单量',
                ordered_user_num: '下单人数',
                ordered_amount: '下单金额',
                trading_amount: '成交金额',
                paid_amount: '支付金额',
                custmer_price: '客单价',
                order_price: '笔单价',
                rebuy_rate: '复购率(%)'
            },
            map = {
                value : filter_name[filter_key]
            };
        for(let date of dates) {
            newData[date] = {
                value : 0,
                paid_amount : 0,
                paid_user_num : 0,
                paid_num : 0,
                ordered_usernum_last30day : 0,
                paid_usernum_last30day : 0
            };
        }

        for(let key of source) {
            let date = util.getDate(key.date);
            if(filter_key === "custmer_price") {
                newData[date].paid_amount += key.paid_amount;
                newData[date].paid_user_num += key.paid_user_num;
            } else if(filter_key === "order_price") {
                newData[date].paid_amount += key.paid_amount;
                newData[date].paid_num += key.paid_num;
            } else if(filter_key === "rebuy_rate") {
                newData[date].ordered_usernum_last30day += key.ordered_usernum_last30day;
                newData[date].paid_usernum_last30day += key.paid_usernum_last30day;
            } else {
                newData[date].value += key[filter_key];
            }
        }

        if(filter_key === "custmer_price") {
            for(let date in newData) {
                newData[date].value =
                    util.division(newData[date].paid_amount, newData[date].paid_user_num);
            }

        } else if(filter_key === "order_price") {
            for(let date in newData) {
                newData[date].value =
                    util.division(newData[date].paid_amount, newData[date].paid_num);
            }
        } else if(filter_key === "rebuy_rate") {
            for(let date in newData) {
                newData[date].value =
                    util.percentage(newData[date].ordered_usernum_last30day, newData[date].paid_usernum_last30day);
            }
        } else {
            for(let date in newData) {
                newData[date].value = Math.ceil(newData[date].value);
            }
        }

        return [{
            type : type,
            map : map,
            data : newData,
            config: {
                stack: false
            }
        }];
    },
    vtradeThree(data, dates) {
        let source = data.first.data[0],
            count = data.first.count;

        for(let item of source) {
            item.ordered_amount = item.ordered_amount.toFixed(2);
            item.trading_amount = item.trading_amount.toFixed(2);
            item.paid_amount = item.paid_amount.toFixed(2);
            item.date = moment(item.date).format("YYYY-MM-DD");
            item.custmer_price = util.division(item.paid_amount, item.paid_user_num);
            item.order_price = util.division(item.paid_amount, item.paid_num);
            item.rebuy_rate = util.toFixed(
                item.ordered_usernum_last30day,
                item.paid_usernum_last30day
            );
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    vtradeFour(data, dates) {
        var source = data.first.data[0],
            count = data.first.count;

        for(let item of source) {
            item.date = moment(item.date).format("YYYY-MM-DD");
            item.refund_rate = util.toFixed(item.refund_item_quantity, item.paid_item_quantity);
            item.delivery_amount = item.delivery_amount.toFixed(2);
            item.refund_amount = item.refund_amount.toFixed(2);
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    },
    vtradeFive(data, query) {
        var source = data.first.data,
            _count = data.first.count[0].count,
            count = _count > 100 ? 100 : _count,
            page = query.page || 1;

        for(let i = 0; i < source.length; i++) {
            source[i].rank = (page - 1) * 20 + i + 1;
        }

        return util.toTable([source], data.rows, data.cols, [count]);
    }
};