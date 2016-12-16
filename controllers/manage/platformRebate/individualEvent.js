/**
 * @author yanglei
 * @date 20160408
 * @fileoverview 单项单级返利
 */
var api = require("../../../base/main"),
    filter = require("../../../filters/platformRebate/individualEvent");

module.exports = (Router) => {
    Router = new api(Router, {
        router : "/platformRebate/individualEventOne",
        modelName : ["RebateOrderMuiltipleOverview"],
        params(query, params) {
            params.plan_type = "6";
            query.category_id_1 = "ALL";
            query.category_id_2 = "ALL";
            query.category_id_3 = "ALL";
            query.category_id_4 = "ALL";
            return params;
        },
        procedure : [{
            aggregate : "params",
            sum : ["unique_plan_id_num", "unique_is_rebate_shop_num",
                "unique_is_rebate_merchandise_num", "unique_is_rebate_order_num",
                "unique_is_rebate_user_num", "unique_is_over_rebate_order_num",
                "is_rebate_fee", "is_over_rebate_order_amount",
                "unique_is_rebate_back_merchandise_num", "unique_back_merchandise_num",
                "is_rebate_back_merchandise_num", "back_merchandise_num",
                "unique_is_rebate_back_user_num", "unique_back_user_num",
                "is_rebate_back_merchandise_amount", "back_merchandise_amount",
                "cancel_is_rebate_order_num",
                "expect_rebate_amount", "unique_expect_rebate_user_num", "cancel_rebate_amount"],
            get : ""
        }],
        platform : false,
        filter(data) {
            return filter.individualEventOne(data);
        },
        rows: [
            ["defate_plan_count", "participate_seller_count", "participate_goods_count", "order_count",
                "participate_user_count", "cancel_is_rebate_order_num" ],
            ["expect_rebate_amount", "unique_expect_rebate_user_num", "cancel_rebate_amount",
                "rebate_order_count", "rebate_order_amount_count",
                //"rebate_order_amount_actual_count",
                "rebate_amount_count"
                //, "rate"
            ],
            ["name", "spu_count", "sku_count", "refund_user_count", "refund_goods_amount_count"
                //"refund_goods_amount_actual_count"
            ]
        ],
        cols: [
            [{
                caption: "返利计划数",
                type: "string"
            }, {
                caption: "参与商户数",
                type: "number"
            }, {
                caption: "参与商品数",
                type: "number"
            }, {
                caption: "订单数",
                type: "number"
            }, {
                caption: "购买用户数",
                type: "number"
            }, {
                caption: "取消订单数",
                type: "number"
            }],
            [{
                caption: "预计返利金额",
                type: "number"
            },{
                caption: "预计获利人次",
                type: "number"
            },{
                caption: "已取消返利金额",
                type: "number"
            },{
                caption: "返利到账订单数",
                type: "string",
                help : "返利订单中已经返利到账的订单数，统计时间为订单返利到账时间"
            }, {
                caption: "返利订单总金额",
                type: "string",
                help : "统计时间内所有已返利订单的成交金额，统计时间为订单返利到账时间"
            //}, {
            //    caption: "返利订单实付金额",
            //    type: "string",
            //    help : "统计时间内所有已返利订单的实际支付金额，统计时间为订单返利到账时间"
            }, {
                caption: "返利到账金额",
                type: "string",
                help : "返利订单中已返利总金额，统计时间为订单返利到账时间"
            //}, {
            //    caption: "返利比率",
            //    type: "string",
            //    help : "返利到账金额/返利到账订单实付金额"
            }],
            [{
                caption: "",
                type: "string"
            }, {
                caption: "退货商品数",
                type: "string"
            }, {
                caption: "退货商品件数",
                type: "string"
            }, {
                caption: "退货用户数",
                type: "string"
            }, {
                caption: "退货商品总金额",
                type: "string"
            //}, {
            //    caption: "实际退货金额",
            //    type: "string"
            }]
        ]
    });

    Router = new api(Router, {
        router : "/platformRebate/individualEventTwo",
        modelName : [ "RebateOrderMuiltipleTrend", "TypeFlow" ],
        params(query, params) {
            params.plan_type = "6";
            return params;
        },
        secondParams() {
            return {
                type_code : 6,
                type : 1,
                status : 1
            }
        },
        fixedParams(req, query, cb) {
            if(query.category_id) {
                req.models.ConfCategories.find({
                    id : query.category_id
                }, (err, data) => {
                    if(err) {
                        cb(err);
                    } else {
                        query['category_id_' + (data[0].level + 1)] = query.category_id;
                        delete query.category_id;
                        cb(null, query);
                    }
                });
            } else {
                query.category_id_1 = "ALL";
                query.category_id_2 = "ALL";
                query.category_id_3 = "ALL";
                query.category_id_4 = "ALL";
                cb(null, query);
            }
        },
        procedure : [{
            aggregate : {
                value : ["rebate_type", "date"]
            },
            sum : ["unique_is_rebate_order_num", "is_rebate_fee",
                "is_rebate_merchandise_num"],
            groupBy : ["date", "rebate_type"],
            get : ""
        }, false],
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'sum_unique_is_rebate_order_num',
                value: '订单数'
            }, {
                key: 'sum_is_rebate_fee',
                value: '订单总金额'
            }, {
                key: 'sum_is_rebate_merchandise_num',
                value: '商品件数'
            }]
        }],
        filter(data, query, dates) {
            return filter.individualEventTwo(data, query.filter_key, dates);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/individualEventThree",
        modelName : [ "RebateOrderPlantypeRebatetypeCategorySum", "TypeFlow" ],
        params(query, params) {
            params.plan_type = "6";
            return params;
        },
        secondParams() {
            return {
                type_code : 6,
                type : 1,
                status : 1
            }
        },
        fixedParams(req, query, cb) {
            if(query.category_id) {
                req.models.ConfCategories.find({
                    id : query.category_id
                }, (err, data) => {
                    if(err) {
                        cb(err);
                    } else {
                        query['category_id_' + (data[0].level + 1)] = query.category_id;
                        delete query.category_id;
                        cb(null, query);
                    }
                });
            } else {
                query.category_id_1 = "ALL";
                query.category_id_2 = "ALL";
                query.category_id_3 = "ALL";
                query.category_id_4 = "ALL";
                cb(null, query);
            }
        },
        procedure : [{
            aggregate : {
                value : ["rebate_type"]
            },
            sum : ["is_rebate_merchandise_num", "is_rebate_fee",
                "is_over_rebate_order_amount", "unique_is_rebate_order_num"],
            groupBy : ["rebate_type"],
            get : ""
        }, false],
        level_select : true,
        level_select_name : "category_id",
        level_select_url : "/api/categories",
        platform : false,
        filter_select: [{
            title: '指标选择',
            filter_key: 'filter_key',
            groups: [{
                key: 'sum_is_rebate_merchandise_num',
                value: '商品件数'
            }, {
                key: 'sum_is_rebate_fee',
                value: '商品总金额'
            }, {
                key: 'sum_is_over_rebate_order_amount',
                value: '返利到账金额'
            }, {
                key: 'sum_unique_is_rebate_order_num',
                value: '订单数'
            }]
        }],
        filter(data, query) {
            return filter.individualEventThree(data, query.filter_key);
        }
    });

    Router = new api(Router,{
        router : "/platformRebate/individualEventFour",
        modelName : [ "RebatetSheduleDetails", "TypeFlow" ],
        params(query, params) {
            params.plan_type = "6";
            return params;
        },
        secondParams() {
            return {
                type_code : 6,
                type : 1,
                status : 1,
                limit : 100
            };
        },
        paging : [true, false],
        platform : false,
        excel_export : true,
        showDayUnit : true,
        date_picker_data : 1,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, query, dates) {
            return filter.individualEventFour(data, query.page);
        },
        rows : [
            [ "id", "plan_name", "plan_type", "validscope_time", "rebate_type", "level", "unique_is_rebate_shop_num",
                "unique_is_rebate_merchandise_num", "unique_is_rebate_user_num", "order_rate", "price_rate",
                "is_over_rebate_order_amount" ]
        ],
        cols : [
            [
                {
                    caption : "序号",
                    type : "number"
                }, {
                caption : "返利计划名称",
                type : "string"
            }, {
                caption : "使用方",
                type : "string"
            }, {
                caption : "有效期",
                type : "string"
            }, {
                caption : "相关流程",
                type : "string"
            }, {
                caption : "层级",
                type : "string"
            }, {
                caption : "参与商家数",
                type : "number"
            }, {
                caption : "参与商品数",
                type : "number"
            }, {
                caption : "参与用户数",
                type : "number"
            }, {
                caption : "新增订单数/订单总数",
                type : "string"
            }, {
                caption : "新增订单金额/订单总金额",
                type : "string"
            }, {
                caption : "返利到账金额",
                type : "number"
            }
            ]
        ]
    });

    return Router;
};