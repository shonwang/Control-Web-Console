define("cacheRule.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){
            //0文件后缀，1目录，2具体url,3正则预留,4url包含指定参数9全局默认缓存配置项
            var type = this.get('type');
            if (type === 0) this.set("typeName", "文件类型");
            if (type === 1) this.set("typeName", "指定目录");
            if (type === 2) this.set("typeName", "指定URL");
            if (type === 3) this.set("typeName", "正则匹配");
            if (type === 4) this.set("typeName", "url包含指定参数");
            if (type === 9) this.set("typeName", "全部文件");

            var hasOriginPolicy = this.get('hasOriginPolicy'),
                expireTime = this.get('expireTime'), summary = '';

            if (expireTime === 0 && hasOriginPolicy === 0) summary = "缓存时间：不缓存";
            if (expireTime !== 0 && hasOriginPolicy === 0) summary = "缓存时间：" + Utility.timeFormat(expireTime);
            if (expireTime !== 0 && hasOriginPolicy === 1) summary = "使用源站缓存, 若源站无缓存时间，则缓存：" + Utility.timeFormat(expireTime);
            this.set("summary", summary);
        }
    });

    var CacheRuleCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setPolicy: function(args){
            var url = BASE_URL + "/channelManager/cache/setPolicy",
            successCallback = function(res){
                if (res)
                    this.trigger("set.policy.success", res)
                else
                    this.trigger("set.policy.error", res)
            }.bind(this),
            errorCallback = function(response){
                this.trigger("set.policy.error", response)
            }.bind(this);
            Utility.postAjax(url, args, successCallback, errorCallback);
        },

        getPolicyList: function(args){
            var url = BASE_URL + "/channelManager/cache/getPolicyList",
            successCallback = function(res){
                this.reset();
                if (res){
                    _.each(res, function(element, index, list){
                        this.push(new Model(element));
                    }.bind(this))
                    this.total = res.total;
                    this.trigger("get.policy.success");
                } else {
                    this.trigger("get.policy.error"); 
                } 
            }.bind(this),
            errorCallback = function(response){
                this.trigger("get.policy.error", response);  
            }.bind(this);
            Utility.getAjax(url, args, successCallback, errorCallback);
        }
    });

    return CacheRuleCollection;
});