/**
 * @author yanglei
 * @date 20160721
 * @fileoverview 商家优惠券
 */
var api = require("../../../base/api"),
    help = require("../../../base/help"),
    orm = require("orm"),
    util = require("../../../utils"),
    config = require("../../../utils/config.json"),
    filter = require("../../../filters/coupon/shop");

module.exports = (Router) => {

    Router = new api(Router, {
        router : "/coupon/shopCouponOne",
        modelName : ["CouponGroupDate"],
        platform : false,
        date_picker_data : 1,
        showDayUnit : true,
        flexible_btn: [{
            content: '<a href="javascript:void(0)" help_url="/shopCoupon/help_json">帮助</a>',
            preMethods: ["show_help"],
            customMethods: ''
        }],
        fixedParams(query, filter_key, req, cb) {
            var endTime = new Date(query.startTime + " 23:59:59"),
                startTime = util.date(query.startTime, query.day_type);
            query.date = orm.between(startTime, endTime);
            query.type = "1";
            cb(null, query);
        },
        filter(data, filter_key, dates, filter_key2, page, params) {
            return filter.shopCouponOne(data, dates, params);
        },
        rows: [
            ["name", "published_num", "published_amount", "give_num", "receive_num", "receive_rate",
                "used_num", "used_amount",
                //"used_rate",
                "invalid_num"]
        ],
        cols: [
            [
                {
                    caption : "",
                    type : "string"
                },{
                caption : "发行数量",
                type : "number"
            },{
                caption : "发行总金额",
                type : "number"
            },{
                caption : "发送数量",
                type : "number"
            },{
                caption : "领取数量",
                type : "number"
            },{
                caption : "领取率",
                type : "string"
            },{
                caption : "使用数量",
                type : "number"
            },{
                caption : "使用总金额",
                type : "number"
            //},{
            //    caption : "使用率",
            //    type : "string"
            },{
                caption : "过期数量",
                type : "number"
            }
            ]
        ]
    });

    Router = new api(Router, {
        router : "/coupon/shopCouponTwo",
        modelName : ["CouponGroupDate"],
        platform : false,
        params(query) {
            query.type = "1";
            return query;
        },
        filter(data, filter_key, dates, filter_key2, page, parmas, type) {
            return filter.shopCouponTwo(data, dates, type);
        }
    });

    Router = new api(Router, {
        router : "/coupon/shopCouponThree",
        modelName : ["CouponGroupPriceInterrgional"],
        platform : false,
        params(query) {
            query.type = "1";
            return query;
        },
        filter(data, filter_key, dates) {
            return filter.shopCouponThree(data);
        }
    });

    Router = new api(Router, {
        router : "/coupon/shopCouponFour",
        modelName : ["CouponGroupDate"],
        paging : true,
        platform : false,
        order : ["-date"],
        excel_export : true,
        params(query) {
            query.type = "1";
            return query;
        },
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopCouponFour(data);
        },
        rows : [
            ["date", "published_num", "published_amount",
                "receive_num", "receive_amount", "used_num", "used_amount",
                //"used_rate",
                "invalid_num", "expired_num" ]
        ],
        cols : [
            [
                {
                    caption : "日期",
                    type : "string"
                },{
                    caption : "发行数量",
                    type : "number"
                },{
                    caption : "发行总金额",
                    type : "number"
                },{
                    caption : "领取数量",
                    type : "number"
                },{
                    caption : "领取总金额",
                    type : "number"
                },{
                    caption : "使用数量",
                    type : "number"
                },{
                    caption : "使用总金额",
                    type : "number"
                //},{
                //    caption : "使用率",
                //    type : "string"
                },{
                    caption : "过期数量",
                    type : "number"
                },{
                    caption : "作废数量",
                    type : "number"
                }
            ]
        ]
    });

    Router = new api(Router, {
        router : "/coupon/shopCouponFive",
        modelName : ["CouponGroupShopTop"],
        paging : true,
        date_picker_data : 1,
        showDayUnit : true,
        platform : false,
        order : ["-receive_num"],
        excel_export : true,
        flexible_btn : [{
            content: '<a href="javascript:void(0)">导出</a>',
            preMethods: ['excel_export']
        }],
        filter(data, filter_key, dates) {
            return filter.shopCouponFive(data);
        },
        rows : [
            ["shop_name", "published_num", "published_amount",
                "receive_num", "receive_amount", "used_num", "used_amount",
                //"used_rate",
                "invalid_num", "expired_num" ]
        ],
        cols : [
            [
                {
                    caption : "店铺名称",
                    type : "string"
                },{
                    caption : "发行数量",
                    type : "number"
                },{
                    caption : "发行总金额",
                    type : "number"
                },{
                    caption : "领取数量",
                    type : "number"
                },{
                    caption : "领取总金额",
                    type : "number"
                },{
                    caption : "使用数量",
                    type : "number"
                },{
                    caption : "使用总金额",
                    type : "number"
                //},{
                //    caption : "使用率",
                //    type : "string"
                },{
                    caption : "过期数量",
                    type : "number"
                },{
                    caption : "作废数量",
                    type : "number"
                }
            ]
        ]
    });

    Router = new help(Router, {
        router : "/shopCoupon/help",
        rows : config.help.rows,
        cols : config.help.cols,
        data : [
            {
                name : "发行数量",
                help : "时间段内平台优惠券发行总数量"
            },
            {
                name : "发行总金额",
                help : "时间段内平台优惠券发行总金额"
            },
            {
                name : "领取数量",
                help : "时间段内所有商家优惠券被领取总数量"
            },
            {
                name : "领取总金额",
                help : "时间段内所有商家优惠券被领取总金额"
            },
            {
                name : "使用数量",
                help : "商家优惠券领取被使用总数量"
            },
            {
                name : "使用总金额",
                help : "商家优惠券领取被使用总金额"
            },
            {
                name : "使用率",
                help : "时间段内，商家优惠券领取且被使用数量/商家优惠券领取数量"
            },
            {
                name : "领取率",
                help : "（当日/当周/当月）领取数量/（当日/当周/当月）发行数量"
            },
            {
                name : "领取面值占比分布",
                help : "商家优惠券被领取的面值分布占比"
            },
            {
                name : "使用面值占比分布",
                help : "商家优惠券领取后被使用的面值分布占比"
            },
            {
                name : "使用率面值分布",
                help : "商家优惠券各面值使用数量/商家优惠各面值领取数量"
            },
            {
                name : "过期率",
                help : "优惠券被领取后未使用而过期的数量/领取数量"
            },
            {
                name : "作废率",
                help : "优惠券创建后未被领取的数量/创建数量"
            },
            {
                name : "发送面值占比分布",
                help : "平台优惠券各发送的面值分布占比"
            }
        ]
    });

    return Router;
};