/**
 * @author yanglei
 * @date 20160429
 * @fileoverview 用户管理
 */
var orm = require("orm"),
    config = require("../../../config/config"),
    util = require("../../../utils");

module.exports = (Router) => {
    Router.get("/users/find", (req, res, next) => {
        var query = req.query,
            limit = query.limit || 10,
            username = query.username || "",
            page = query.page || 1,
            count = "SELECT count(1) FROM tbl_dataplatform_nodejs_users2"
                + " WHERE is_admin<99 AND"
                + " (username like '%" + username + "%' OR role like '%" +  username + "%')",
            sql = "SELECT * FROM tbl_dataplatform_nodejs_users2"
                + " WHERE is_admin<99 AND"
                + " (username like '%" + username + "%' OR role like '%" +  username + "%')"
                + " LIMIT " + (page - 1) * limit + "," + limit;
        req.models.db1.driver.execQuery(count, (err, count) => {
            if(!err) {
                req.models.db1.driver.execQuery(sql, (err, data) => {
                        if(!err) {
                            res.json({
                                code : 200,
                                count : count[0]["count(1)"],
                                data : data
                            });
                        } else {
                            next(err);
                        }
                    });
            } else {
                next(err)
            }
        });
    });

    Router.post("/users/update", (req, res, next) => {
        var params = req.body,
            content = [];
        req.models.User2.find({
            id : params.id
        }, (err, data) => {
            if(!err) {
                if(data.length) {
                    var username = data[0].username;
                    if(data[0].status === 1) {
                        if(params.status === "0") {
                            content.push(username + "被禁用");
                        }
                    } else {
                        if(params.status === "1") {
                            content.push(username + "被启用");
                        }
                    }
                    if(params.role) {
                        if(params.role !== data[0].role) {
                            if(params.role) {
                                content.push("修改" + username + "角色为" + params.role);
                            } else {
                                content.push(username + "角色被清空了");
                            }
                        }
                    }

                    if(params.limited) {
                        if(params.limited !== data[0].limited) {
                            content.push(username + "权限被修改");
                        }
                    }
                    if(params.export) {
                        if(params.export !== data[0].export) {
                            content.push(username + "下载权限被修改");
                        }
                    }
                    if(data[0].remark) {
                        if(params.remark !== data[0].remark) {
                            if(params.remark) {
                                content.push(username + "被修改备注");
                            } else {
                                content.push(username + "备注被清空了");
                            }
                        }
                    } else {
                        if(params.remark) {
                            content.push(username + "被修改备注");
                        }
                    }

                    data[0].status = params.status || data[0].status;
                    data[0].role = params.role !== undefined ? params.role : data[0].role;
                    data[0].remark = params.remark !== undefined ? params.remark : data[0].remark;
                    data[0].limited = params.limited || data[0].limited;
                    data[0].export = params.export || data[0].export;
                    _save();
                } else {
                    res.json({
                        code : 400,
                        success : false,
                        msg : "无该用户,无法修改"
                    })
                }
            } else {
                res.json({
                    code : 400,
                    success : false,
                    msg : "查询错误"
                })
            }
            function _log() {
                var log = {
                    username : req.session.userInfo.username,
                    date : new Date().getTime(),
                    ip : util.getClientIp(req),
                    content : content.join(";")
                };
                req.models.Log.create(log, (err, data) => {
                    if(!err) {
                        res.json({
                            code : 200,
                            success : true,
                            msg : "修改成功"
                        })
                    } else {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "修改失败"
                        })
                    }
                });
            }
            function _save() {
                data[0].save((err) => {
                    if(!err) {
                        _log();
                    } else {
                        res.json({
                            code : 400,
                            success : false,
                            msg : "修改失败"
                        })
                    }
                })
            }
        });
    });

    Router.get("/users/download", (req, res, next) => {
        req.models.User2.find({
            is_admin : orm.lt(99)
        }, (err, data) => {
            if(err) {
                return next(err);
            }
            let newData = [];
            for(let key of data) {
                let arr = [];
                
            }
        });
    });

     return Router;
};