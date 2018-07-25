'use strict';

define("preheatManage.model", ['require', 'exports', 'utility'], function (require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function initialize() {
            var taskId = this.get("taskId");
            if (taskId) this.set("id", taskId);
        }
    });

    var PreheatManageCollection = Backbone.Collection.extend({

        model: Model,

        initialize: function initialize() {},

        getPreheatList: function getPreheatList(args) {

            var tempData = {
                "preloadTaskList": [{
                    "taskId": 377,
                    "taskName": "爱奇艺TOP100预热",
                    "preloadFilePath": "http://121.14.55.64/asp/hls/main/0303000a/3/default/e719f5f8827c6/main.m3u8",
                    "preloadUrlCount": 1000,
                    "currentBandwidth": 100,
                    "startTime": "2018-06-13 17:03:00",
                    "endTime": "2018-06-14 17:03:00",
                    "successRate": "99%",
                    "status": 3,
                    "committer": "yewrh",
                    "currentNodes": "szcm14;yyct05;yyct04",
                    "commitTime": "2018-06-14 17:03:00",
                    "currentBatch": 1,
                    "progress": 2771,
                    "batchTimeBandwidth": [{
                        "sortnum": 1,
                        "nodes": "szcm14;yyct05;yyct04",
                        "timeWidth": [{
                            "id": 1,
                            "startTime": "02:00",
                            "endTime": "04:00",
                            "bandwidth": "100"
                        }, {
                            "id": 2,
                            "startTime": "12:00",
                            "endTime": "14:00",
                            "bandwidth": "100"
                        }]
                    }, {
                        "sortnum": 2,
                        "nodes": "szcm14;yyct05;yyct04",
                        "timeWidth": [{
                            "id": 1,
                            "startTime": "02:00",
                            "endTime": "04:00",
                            "bandwidth": "100"
                        }, {
                            "id": 2,
                            "startTime": "12:00",
                            "endTime": "14:00",
                            "bandwidth": "100"
                        }]
                    }]
                }]
            };

            var url = BASE_URL + "/refresh/task/query",
                //"/rs/device/pagelist",
            successCallback = function (res) {
                this.reset();
                if (res) {
                    _.each(tempData.preloadTaskList, function (element, index, list) {
                        this.push(new Model(element));
                    }.bind(this));
                    this.total = 1; //res.total;
                    this.trigger("get.preheat.success", res.rows);
                } else {
                    this.trigger("get.preheat.error");
                }
            }.bind(this),
                errorCallback = function (response) {
                this.trigger('get.preheat.error', response);
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        }
    });

    return PreheatManageCollection;
});
