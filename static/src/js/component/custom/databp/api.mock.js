var store = require('../../../store/store.js');
var actions = require('../../../store/actions.js');

function extractResult(res) {
	return new Promise(function(s, j){
		if(res.code !== '200' || res.iserror !== '0') {
			j('获取埋点信息失败：' + res.msg);
		}
		var data;
		if (res && (data = res.data) && (data = data.result)) {
			s(data);
		} else {
            j('获取的埋点信息为空');
		}
	});
}
function errHandler(err) {
	actions.alert(store, {
        show: true,
        msg: '请求过程中失败：' + err.toString(),
        type: 'danger'
    });
}

var api = {
	getBp({pageUrl, selector, platform, pointId, matchUrlId}) {
		return Promise.resolve({
			    "msg": "SUCCESS",
			    "code": "200",
			    "data": {
			        "result": {
			            "pointId": 0,
			            "matchUrlId": 27,
			            "pointName": "",
			            "pageUrl": "",
			            "selector": "",
			            "privateParam": "",
			            "pattern": "https://mall.gomeplus.com/shop/",
			            "publicParam": "sid=1001",
			            "platform": "",
			            "createTime": "",
			            "updateTime": ""
			        },
			        "total": 1
			    },
			    "iserror": "0"
			}).then(extractResult).catch(errHandler);
	},
	updateBp({pageUrl, selector, pointName, platform, pointId, matchUrlId, pattern, publicParam, privateParam}) {
		return Promise.resolve({
		    "msg": "SUCCESS",
		    "code": "200",
		    "data": {
		        "result": {
		            "pointId": 24,
		            "matchUrlId": 27,
		            "pointName": "测试埋点1",
		            "pageUrl": "https://mall.gomeplus.com/shop/10145.html",
		            "selector": "<div />",
		            "privateParam": "uid=100201",
		            "pattern": "https://mall.gomeplus.com/shop/",
		            "publicParam": "sid=100101",
		            "platform": "H501",
		            "createTime": "",
		            "updateTime": ""
		        },
		        "total": 1
		    },
		    "iserror": "0"
		}).then(extractResult).catch(errHandler);
	},
	saveBp({pageUrl, selector, pointName, platform, pointId, matchUrlId, pattern, publicParam, privateParam}) {
		return Promise.resolve({
		    "msg": "保存成功",
		    "code": "200",
		    "data": {
		        "result": 24,
		        "total": 1
		    },
		    "iserror": "0"
		});
	},
	deleteBp({pointId, matchUrlId}) {
		return Promise.resolve({
		    "msg": "SUCCESS",
		    "code": "200",
		    "data": {
		        "result": "",
		        "total": 1
		    },
		    "iserror": "0"
		}).then(extractResult).catch(errHandler);
	},
	// useless: selector
	listBps({pageUrl, platform, pointName, page, size}){
		return Promise.resolve({
		    "data": {
		        "total": 20,
		        "result": [{
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        }, 
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 50,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>2",
		            "pointName": "埋点2",
		            "pointParam": "uid=1",
		            "createTime": 1478239758000,
		            "updateTime": 1478239758000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "1"
		        },
		        {
		            "id": 51,
		            "pageUrl": "https://mall.gomeplus.com/item/2016-11042.html",
		            "selector": "<div/>3",
		            "pointName": "埋点4",
		            "pointParam": "uid=1&aid=1&cid=2016-11042&bid=2",
		            "createTime": 1478239778000,
		            "updateTime": 1478240238000,
		            "platform": "H5",
		            "isActive": "1",
		            "uniquePoint": "0"
		        }]
		    },
		    "code": "200",
		    "msg": "",
		    "iserror": "0"
		}).then(function(res) {
			if(res.code !== '200' || res.iserror !== '0') {
				return Promise.reject('获取埋点信息失败：' + res.msg);
			}
			var data;
			if (res && (data = res.data) && (data = data.result)) {
				return {
					data,
					total: res.data.total
				}
			} else {
	            return Promise.reject('获取的埋点信息为空');
			}
		}).catch(errHandler);
	}
}
module.exports = api;