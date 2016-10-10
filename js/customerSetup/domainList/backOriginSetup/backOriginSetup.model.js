define("backOriginSetup.model", ['require','exports', 'utility'], function(require, exports, Utility) {
    var Model = Backbone.Model.extend({
        initialize: function(){}
    });

    var BackOriginSetupCollection = Backbone.Collection.extend({
        
        model: Model,

        initialize: function(){},

        setBackSourceConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setBackSourceConfig";
            var url = "http://192.168.158.91:8090/channelManager/domain/setBackSourceConfig";
            Utility.postAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("set.backSourceConfig.success");
                } else {
                    this.trigger("set.backSourceConfig.error");
                }
            }.bind(this),function(res){
                this.trigger("set.backSourceConfig.error", res);
            }.bind(this));
        },

        setHostHeaderConfig: function(args){
            var url = BASE_URL + "/channelManager/domain/setHostHeaderConfig";
            var url = "http://192.168.158.91:8090/channelManager/domain/setHostHeaderConfig";
            Utility.getAjax(url, args, function(res){
                if(res == 1){
                    this.trigger("set.hostConfig.success");
                } else {
                    this.trigger("set.hostConfig.error");
                }
            }.bind(this),function(res){
                this.trigger("set.hostConfig.error", res);
            }.bind(this));
        },
    });

    return BackOriginSetupCollection;
});