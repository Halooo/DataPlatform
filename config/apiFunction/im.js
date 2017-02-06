
/**
 * IM分析 模块功能函数文件
*/

let util = require("../../utils"),
    moment = require("moment"),
    orm  = require("orm"),
    _ = require("lodash");
let eventproxy = require("eventproxy"),
    excelExport = require('../../utils/excelExport'),
    nodeExcel = require('excel-export');

let cluster = global.cluster;
// cluster.get("message:app:0112:notdisturb:count" , (err , result)=>{
//     console.log(23333);
//     if(err){
//         console.log(err);
//     }
//     console.log(result);
// })

// cluster.pipeline([
//     "message:app:0112:notdisturb:count"
// ]).exec((err, data) => {
//     if(err) {
//         console.log(err);
//     } else {
//         console.log(data);
//     }
// });
// 



let Component_Using = {
    date_picker:{
        name : "startTime",
        endname: "endTime",
        defaultData     : 7,
        show            : true,
    },
    toggle : {
        show : true
    },
    filter_select : []
}



module.exports = {
    im_realtime_one_api(obj){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                cancelDateLimit : false,
                defaultData     : 7,
                show            : false,
            },
            filter_select : [],
            drop_down : {
                channel : false,
            }
        };
        let Text = [
            "",
            "总发消息数",
            "总发消息人数",
            "单发消息数",
            "单发消息人数",
            "群发消息数",
            "群发消息人数",
            "IM使用占比",
            "设置免打扰",
            "表情下载次数"
        ];
        return (req , res , next) => {
            let row0 = {"date" : ""} , row1 = {"date" : "今日"} , row2 = {"date" : "昨日"} , row3 = {"date" : "占比"} , Result = [row0 , row1 , row2 , row3];
            for(let i=1;i<obj.rows[0].length;i++){
                row0[i] = Text[i];
                row1[i] = 0;
                row2[i] = 0;
                row3[i] = 0;
            }

            if(Object.keys(req.query) == 0){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }

            let date = moment(new Date()).format("MMDD"),
        zDate = moment(new Date - 24 * 60 * 60 * 1000).format("MMDD");
            

            let DATA = util.toTable([Result] , obj.rows , obj.cols);
            res.json({
                code: 200,
                components: Component,
                modelData: DATA,
            });
        }
    },

    im_realtime_two_api(Obj){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                defaultData     : 7,
                show            : false,
            },
            drop_down : {
                channel : false,
            },
            toggle : {
                show : true
            },
            filter_select : [
                {
                    title: '数据指标',
                    filter_key: 'message_type',
                    groups : [
                        {
                            key: "all",
                            value: '总计发消息数'
                        },
                        {
                            key: "single",
                            value: '单聊发消息数'
                        },
                        {
                            key: "total",
                            value: '群聊发消息数'
                        }
                    ]
                },
                {
                    title: '对比时段',
                    filter_key: 'type',
                    groups : [
                        {
                            key: "day",
                            value: '前一日'
                        },
                        {
                            key: "week",
                            value: '上周同期'
                        }
                    ]
                }
            ]
        };
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }

            let DATA = [{
                type : "line",
                map : {
                    "today" : "今日",
                    "comparison" : "对比"
                },
                data : {},
                config: { // 配置信息
                    stack: false,  // 图的堆叠
                    categoryY : true
                }
            }];
            
            res.json({
                code: 200,
                components: Component,
                modelData: DATA,
            });
                
        }
    },
    
    im_using_one_api(obj){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                cancelDateLimit : false,
                defaultData     : 1,
                show            : true,
                showDayUnit     : true
            },
            filter_select : []
        };
        let Text = [
            "",
            "总发消息数",
            "总发消息人数",
            "单发消息数",
            "单发消息人数",
            "群发消息数",
            "群发消息人数",
            "IM使用占比",
            "新增使用占比",
            "群活跃度",
            "设置免打扰次数",
            "表情下载次数"
        ];
        return (req , res , next) => {
            let query = req.query;
            let date = util.beforeDate(query.startTime , 2 , query.day_type);
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }

            req.models.ImDetail.find({
                date : date,
                day_type: query.day_type
            } , (err , data) => {
                //表一
                let Result1 = [] , Rows1 = obj.rows[0];
                let obj1 = {},obj2 = {};
                for(let key of Rows1){
                    obj1[key] = 0;
                    obj2[key] = 0;
                }
                obj1.Date = date[0];
                obj2.Date = date[1];
                Result1.push(obj1,obj2);

                for(let item of data){
                    item.date = util.getDate(item.date);
                    let useObj;
                    if(item.date == date[0]){
                        useObj = obj1;
                    }else{
                        useObj = obj2;
                    }

                    for(let key in useObj){
                        if(key == "Date") continue;
                        useObj[key] = item[key];
                    }
                }

                //表二
                let Result2 = [] , Rows2 = obj.rows[1];
                let  Tobj0 = {} , Tobj1 = {} , Tobj2 = {} , Tobj3 = {};
                Result2.push(Tobj0 , Tobj1 , Tobj2 , Tobj3);

                Rows2.map((item , index) => {
                    Tobj0[item] = Text[index];
                    if(item == "Date"){
                        Tobj1[item] = date[0];
                        Tobj2[item] = date[1];
                        switch(query.day_type){
                            case "1":
                            Tobj3[item] = "日环比";
                            break;
                            case "2":
                            Tobj3[item] = "周环比";
                            break;
                            case "3":
                            Tobj3[item] = "月环比";
                            break;
                        }
                    }else{
                        Tobj1[item] = 0;
                        Tobj2[item] = 0;
                        Tobj3[item] = 0;
                    }
                });

                //表二装载数据
                for(let item of data){
                    item.date = util.getDate(item.date);
                    let useObj;
                    if(item.date == date[0]){
                        useObj = Tobj1;
                    }else{
                        useObj = Tobj2;
                    }

                    for(let key in useObj){
                        if(item[key]){
                            useObj[key] = item[key];
                        }
                    }
                    useObj["IM使用占比"] = util.numberLeave( item.total_mess_uv / (item.app_dau || 1) , 2 );
                    useObj["新增使用占比"] = util.numberLeave( item.im_register_users / (item.register_users || 1) , 2 );
                    useObj["群活跃度"] = util.numberLeave( item.group_mess_pv / (item.group_member_count || 1) , 2 );
                }

                //计算环比
                for(let key in Tobj3){
                    if(key == "Date") continue;

                    Tobj3[key] = util.toFixed( (Tobj1[key] - Tobj2[key]) , Tobj2[key] );
                }


                let DATA = util.toTable([Result1 , Result2] , obj.rows , obj.cols);

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    },


    //使用分析-数据趋势
    im_using_two_api(Obj){
        let Component = {
            date_picker:{
                name : "startTime",
                endname: "endTime",
                defaultData     : 7,
                show            : true,
            },
            toggle : {
                show : true
            },
            filter_select : [
                {
                    title: '指标',
                    filter_key: 'message_type',
                    groups : [
                        {
                            key: "number",
                            value: '发消息数'
                        },
                        {
                            key: "human",
                            value: '发消息人数'
                        }
                    ]
                }
            ]
        };
        let Text = [
            "日期",
            "总发消息数",
            "总发消息人数",
            "单发消息数",
            "单发消息人数",
            "群发消息数",
            "群发消息人数"
        ];
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            let dates = util.times(query.startTime, query.endTime, "1");
            
            req.models.ImDetail.find({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , (err , data) => {
                let map;
                if(query.message_type == "number"){
                    map = {
                        "single_mess_pv" : "单聊",
                        "group_mess_pv"  : "群聊"
                    }
                }else{
                    map = {
                        "single_mess_uv" : "单聊",
                        "group_mess_uv"  : "群聊"
                    }
                }
                let Result = util.ChartData(dates , Object.keys(map));
                //加载数据
                for(let item of data){
                    item.date = util.getDate(item.date);
                    if(Result[item.date]){
                        for(let key in map){
                            Result[item.date][key] += item[key];
                        }
                    }
                }

                let DATA = [{
                    type : "bar",
                    map : map,
                    data : Result,
                    config: { // 配置信息
                        stack: true,  // 图的堆叠
                        categoryY : true
                    }
                }];

                if(query.main_show_type_filter == "table"){
                    let obj = {};
                    Obj.rows[0].map((item , index) => {
                        obj[item] = Text[index];
                    });
                    data.unshift(obj);
                    DATA = util.toTable([data] , Obj.rows , Obj.cols);
                }

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
                
        }
    },

    //使用分析--IM使用情况
    im_using_three_api(OBJ){
        let Component = Component_Using;
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            let dates = util.times(query.startTime , query.endTime, "1");
            
            req.models.ImDetail.find({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , (err , data) => {
                let Arr1 = ["IM使用占比" , "新增使用占比", "群活跃度"];
                let map = {
                    "IM使用占比" : "IM使用占比",
                    "新增使用占比": "新增使用占比",
                    "群活跃度"   : "群活跃度",
                    "set_group_shield_pv" : "设置免打扰次数",
                    "face_load_pv" : "表情下载次数"
                };
                let Result = util.ChartData(dates , Object.keys(map));
                // 加载数据
                for(let item of data){
                    item.date = util.getDate(item.date);
                    if(Result[item.date]){
                        let Useobj = Result[item.date];
                        for(let key in map){
                            switch(key){
                                case "IM使用占比":
                                Useobj[key] = util.numberLeave( item.total_mess_uv / (item.app_dau || 1) , 2 );
                                break;
                                case "新增使用占比":
                                 Useobj[key] = util.numberLeave( item.im_register_users / (item.register_users || 1) , 2 );
                                break;
                                case "群活跃度":
                                 Useobj[key] = util.numberLeave( item.group_mess_pv / (item.group_member_count || 1) , 2 );
                                break;
                                default:
                                Useobj[key] += item[key];
                            }
                        }
                    }
                }

                let DATA = [{
                    type : "line",
                    map : map,
                    data : Result,
                    config: { // 配置信息
                        stack: false,  // 图的堆叠
                        categoryY : false
                    }
                }];

                if(query.main_show_type_filter == "table"){
                    let TextObj = {},Text = [
                        "日期",
                        "IM使用占比",
                        "新增使用占比",
                        "群活跃度",
                        "设置免打扰次数",
                        "表情下载次数"
                    ] , arr2 = ["IM使用占比",
                        "新增使用占比",
                        "群活跃度"];
                    OBJ.rows[0].map((item , index) => {
                        TextObj[item] = Text[index];
                    });
                    let TableData = [TextObj];

                    for(let key in Result){
                        let obj = {};
                        obj = Result[key];
                        obj["date"] = key;
                        for(let names in obj){
                            if(arr2.includes(names)){
                                obj[names] = util.toFixed(obj[names] , 0);
                            }
                        }
                        TableData.push(obj);
                    }

                    DATA = util.toTable([TableData] , OBJ.rows , OBJ.cols);
                }

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    },


    //使用分析--IM带来的交易
    im_using_four_api(OBJ){
        let Component = Component_Using;
        let ArrSum = [
            "order_users",
            "order_times",
            "paid_users",
            "paid_times",
            "paid_amount",
            "im_order_users",
            "im_order_times",
            "im_paid_users",
            "im_paid_times",
            "im_paid_amount",
            "im_group_order_users",
            "im_group_order_times",
            "im_group_paid_users",
            "im_group_paid_times",
            "im_group_paid_amount",
            "im_single_order_users",
            "im_single_paid_users"
        ];
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            let dates = util.times(query.startTime , query.endTime, "1");
            let SQL = req.models.ads2_im_bring_transaction.aggregate();
            for(let item of ArrSum){
                SQL.sum(item);
            }
            let SqlResult = {};
            let Deal100Columns = ["paid_amount" , "im_paid_amount" , "im_group_paid_amount"]
            SQL.get((...values)=>{
                if(values[0]){
                    next(values[0]);
                    return;
                }
                values.splice(0,1);
                for(let i=0;i<values.length;i++){
                    
                    if(Deal100Columns.includes(ArrSum[i])){
                        SqlResult[ArrSum[i]] = (values[i] || 0) / 100;
                    }else{
                        SqlResult[ArrSum[i]] = values[i] || 0;
                    }
                }

                let map = {
                    "not_im" : "非IM交易",
                    "im"     : "IM交易"
                }
                let Result = util.ChartData(["下单人数" , "支付人数" , "新增订单量" , "支付订单量" , "支付金额"] , Object.keys(map));
                Result["下单人数"].im = SqlResult["im_order_users"];
                Result["下单人数"].not_im = SqlResult["order_users"] - SqlResult["im_order_users"];
                Result["支付人数"].im = SqlResult["im_paid_users"];
                Result["支付人数"].not_im = SqlResult["paid_users"] - SqlResult["im_paid_users"];
                Result["新增订单量"].im = SqlResult["im_order_times"];
                Result["新增订单量"].not_im = SqlResult["order_times"] - SqlResult["im_order_times"];
                Result["支付订单量"].im = SqlResult["im_paid_times"];
                Result["支付订单量"].not_im = SqlResult["paid_times"] - SqlResult["im_paid_times"];
                Result["支付金额"].im = SqlResult["im_paid_amount"];
                Result["支付金额"].not_im = SqlResult["paid_amount"] - SqlResult["im_paid_amount"];

                let DATA = [{
                    type : "bar",
                    map : map,
                    data : Result,
                    config: { // 配置信息
                        stack: true,  // 图的堆叠
                        categoryY : false
                    }
                }];

                if(query.main_show_type_filter == "table"){
                    let TableData = [] , Tobj1 = {} , Tobj2 = {} , Tobj3 = {} , Tobj4 = {} , Tobj5 = {};
                    for(let i=0;i<5;i++){
                        let obj = {};
                        for(let key of OBJ.rows[0]){
                            obj[key] = 0;
                        }
                        TableData.push(obj);
                    }

                    TableData[0].A = "IM-总交易";
                    TableData[0].B = SqlResult["im_order_users"];
                    TableData[0].C = SqlResult["im_paid_users"];
                    TableData[0].D = SqlResult["im_order_times"];
                    TableData[0].E = SqlResult["im_paid_times"];
                    TableData[0].F = SqlResult["im_paid_amount"];

                    TableData[1].A = "IM-群聊交易";
                    TableData[1].B = SqlResult["im_group_order_users"];
                    TableData[1].C = SqlResult["im_group_paid_users"];
                    TableData[1].D = SqlResult["im_group_order_times"];
                    TableData[1].E = SqlResult["im_group_paid_times"];
                    TableData[1].F = SqlResult["im_group_paid_amount"];

                    TableData[2].A = "IM-单聊交易";
                    TableData[2].B = SqlResult["im_single_order_users"];
                    TableData[2].C = SqlResult["im_single_paid_users"];
                    TableData[2].D = SqlResult["im_order_times"] - SqlResult["im_group_order_times"];
                    TableData[2].E = SqlResult["im_paid_times"] - SqlResult["im_group_paid_times"];
                    TableData[2].F = SqlResult["im_paid_amount"] - SqlResult["im_group_paid_amount"];                    

                    TableData[3].A = "平台-总交易";
                    TableData[3].B = SqlResult["order_users"];
                    TableData[3].C = SqlResult["paid_users"];
                    TableData[3].D = SqlResult["order_times"];
                    TableData[3].E = SqlResult["paid_times"];
                    TableData[3].F = SqlResult["paid_amount"];

                    TableData[4].A = "IM交易占比";
                    TableData[4].B = util.toFixed( SqlResult["im_order_users"] , SqlResult["order_users"] );
                    TableData[4].C = util.toFixed( SqlResult["im_paid_users"] , SqlResult["paid_users"] );
                    TableData[4].D = util.toFixed( SqlResult["im_order_times"] , SqlResult["order_times"] );
                    TableData[4].E = util.toFixed( SqlResult["im_paid_times"] , SqlResult["paid_times"] );
                    TableData[4].F = util.toFixed( SqlResult["im_paid_amount"] , SqlResult["paid_amount"] );
                    DATA = util.toTable([TableData] , OBJ.rows , OBJ .cols);
                }


                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    },


    //ImGroupActive
    im_using_five_api(OBJ){
        let Component = {
            date_picker:{
                defaultData : 1,
                show        : true,
                showDayUnit : true
            },
            flexible_btn : [
                {
                    content: `<a href="javascript:void(0)">导出</a>`, 
                    preMethods: ["excel_export"]
                }
            ],
            filter_select : []
        };
        return (req , res , next) => {
            let query = req.query;
            if(!query.startTime){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }

            let ep = new eventproxy();
            req.models.ImGroupActive.count({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , (err , data)=>{
                if(err) next(err);
                ep.emit("one" , data);
            });
            
            req.models.ImGroupActive.find({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , {
                limit : query.limit / 1 || 20,
                offset: (query.page - 1)*query.limit
            } , (err , data) => {
                if(err){
                    next(err);
                    return;
                }
                ep.emit("two" , data);
            });

            ep.all("one" , "two" , (one , two)=>{
                for(let item of two){
                    item["群活跃度"] = util.toFixed(item.group_mess_pv , item.group_member_count);
                }
                DATA = util.toTable([two] , OBJ.rows , OBJ.cols , [one]);

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
                
        }
    },

    im_using_five_api_excel(OBJ){
        return (req , res , next) => {
            let query = req.query;
            let Condition = {};
            if(query.to && query.from){
                Condition.offset = --query.from;
                Condition.limit  = query.to - query.from;
            }
            if(query.limit && query.page){
                Condition.limit = query.limit;
                Condition.offset= (query.page - 1)*query.limit;
            }

            req.models.ImGroupActive.find({
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            } , Condition , (err , data) => {
                if(err){
                    next(err);
                    return;
                }

                for(let item of data){
                    item["群活跃度"] = util.toFixed(item.group_mess_pv , item.group_member_count);
                }

                let conf = excelExport.analysisExcel([{
                    data : data,
                    rows : OBJ.rows[0],
                    cols : OBJ.cols[0]
                }]),
                    result = nodeExcel.execute(conf);

                res.setHeader('Content-Type', 'application/vnd.openxmlformats');
                res.setHeader("Content-Disposition", "attachment; filename=" + "Report.xlsx");
                res.end(result, 'binary');
            });
        };
    },



    im_message_one_api(OBJ){
        let Component = {
            date_picker:{
                defaultData : 7,
                show        : true
            },
            toggle : {
                show : true
            },
            filter_select : []
        };
        return (req , res , next) => {
            let query = req.query;
            if(Object.keys(query).length == 0){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }

            let ep = new eventproxy();
            let condition = {
                date : orm.between(query.startTime , query.endTime),
                day_type: query.day_type
            };
            req.models.ImEvent.aggregate( condition ).sum("click_pv").get((...values)=>{
                if(values[0]){
                    next(values[0]);
                    return;
                }
                ep.emit("one" , values);
            });

            req.models.db1.driver.execQuery(`select message_event_name,sum(click_pv) as click_pv ,sum(click_uv) as click_uv from ads2_im_event_mess where date BETWEEN ? AND ? AND day_type = ? group by message_event_name` , [query.startTime , query.endTime , query.day_type] , (err , data) => {
                if(err){
                    next(err);
                    return;
                }
                ep.emit("two" , data);
            });
            ep.all("one" , "two" , (ONE , TWO) => {
                let map = {
                    "value" : "消息类型"
                }
                let Result = {};
                for(let item of TWO){
                    if(Result[item.message_event_name]){
                        Result[item.message_event_name].value += item.click_pv;
                    }else{
                        Result[item.message_event_name] = { value : item.click_pv };
                    }
                }
                let DATA = [{
                    type : "pie",
                    map : map,
                    data : Result,
                    config: { // 配置信息
                        stack: false,  // 图的堆叠
                        categoryY : false
                    }
                }];

                if(query.main_show_type_filter == "table"){
                    for(let item of TWO){
                        item["人均发消息数"] = util.numberLeave( item.click_pv / (item.click_uv || 1) , 2 );
                        item["消息数占比"]   = util.toFixed( item.click_pv , ONE[1] );
                    }
                    DATA = util.toTable([TWO] , OBJ.rows , OBJ.cols);
                }

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    },

    im_message_three_api(OBJ){
        let Component = {
            date_picker:{
                defaultData : 7,
                show        : true
            },
            filter_select : []
        };
        return (req , res , next) => {
            let query = req.query;
            if(Object.keys(query).length == 0){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            req.models.db1.driver.execQuery(`select msg_type_name,sum(msg_times) as msg_times ,sum(msg_users) as msg_users from ads2_im_customerservice_msg where date BETWEEN ? AND ? AND day_type = ? group by msg_type_name` , [query.startTime , query.endTime , query.day_type] , (err , data) => {
                if(err){
                    next(err);
                    return;
                }
                DATA = util.toTable([data] , OBJ.rows , OBJ.cols);

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    },


    im_message_four_api(OBJ){
        let Component = {
            date_picker:{
                defaultData : 7,
                show        : true
            },
            filter_select : []
        };
        return (req , res , next) => {
            let query = req.query;
            if(Object.keys(query).length == 0){
                res.json({
                    code: 200,
                    components: Component,
                    modelData: [],
                });
                return;
            }
            req.models.db1.driver.execQuery(`select face_id,sum(load_uv) as load_uv ,sum(load_pv) as load_pv from ads2_im_face_load where date BETWEEN ? AND ? AND day_type = ? group by face_id` , [query.startTime , query.endTime , query.day_type] , (err , data) => {
                if(err){
                    next(err);
                    return;
                }
                DATA = util.toTable([data] , OBJ.rows , OBJ.cols);

                res.json({
                    code: 200,
                    components: Component,
                    modelData: DATA,
                });
            });
        }
    }
}
