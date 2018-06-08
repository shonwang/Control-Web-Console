define("specialLayerManage.replaceNode.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var ReplaceNodeView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model = options.model;
            this.$el = $(_.template(template['tpl/specialLayerManage/specialLayerManage.replaceNode.html'])({}));
            this.$el.find("#dropdown-originNode").attr("disabled", true);
            this.$el.find("#dropdown-nowNode").attr("disabled", true);


            this.collection.off("get.strategyInfoByNode.success");
            this.collection.off("get.strategyInfoByNode.error");
            this.collection.on("get.strategyInfoByNode.success", $.proxy(this.onGetStrategySuccess, this));
            this.collection.on("get.strategyInfoByNode.error", $.proxy(this.onGetError, this));
            this.collection.off("get.node.success");
            this.collection.off("get.node.error");
            this.collection.on("get.node.success", $.proxy(this.onGetNodeSuccess, this));
            this.collection.on("get.node.error", $.proxy(this.onGetError, this));
            this.collection.getNodeList();
            
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickSaveButton, this));
            this.initLayerStrategyTable();
            
            this.defaultParam = {
                

            }
        },
         
        onGetNodeSuccess:function(res){
            this.$el.find("#dropdown-originNode").attr("disabled", false);
            this.$el.find("#dropdown-nowNode").attr("disabled", false);
            var originNameList = [];
            var nowNameList = [];
            var originIsMultiwireList = {};
            var nowIsMultiwireList = {};
            _.each(res.rows, function(el, index, list){
                originNameList.push({name: el.chName, value:el.id})
                originIsMultiwireList[el.id]= (el.operatorId == 9);
                nowNameList.push({name: el.chName, value:el.id})
                nowIsMultiwireList[el.id]= (el.operatorId == 9);
            });
            // this.isMultiwireList = originIsMultiwireList;
            var originSearchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-originNode').get(0),
                panelID: this.$el.find('#dropdown-originNode').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: originNameList,
                callback: function(data) {
                    this.nodeId = data.value;
                    this.$el.find('#dropdown-originNode .cur-value').html(data.name);
                    this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                    this.collection.getStrategyInfoByNode(data)
                }.bind(this)
            });
            var nowSearchSelect = new SearchSelect({
                containerID: this.$el.find('.dropdown-nowNode').get(0),
                panelID: this.$el.find('#dropdown-nowNode').get(0),
                isSingle: true,
                openSearch: true,
                onOk: function(){},
                data: nowNameList,
                callback: function(data) {
                    this.nodeId = data.value;
                    this.$el.find('#dropdown-nowNode .cur-value').html(data.name);
                    // this.setIspList();
                }.bind(this)
            });
            
        },

        onGetStrategySuccess:function(res){
            
            _.each(res, function(el){
                if(el.type === 202){
                    el.typeName = "cache"
                }else if(el.type === 203){
                    el.typeName = "live"
                }
            }.bind(this))
            this.initLayerStrategyTable(res);
        },


        onClickSaveButton: function(){

        },

        onClickCancelButton: function() {
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        initLayerStrategyTable: function(args) {
            var dataObj = args || [];
            this.defaultParam = dataObj;
            this.nodeTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.editNode.table.html'])({
                data: dataObj
            }));
            if (dataObj.length !== 0){    
                this.$el.find(".table-ctn").html(this.nodeTable[0]);
                this.nodeTable.find("tbody .view").on("click", $.proxy(this.onClickItemView, this));
            }else
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty-2.html'])({
                    data: {
                        message: "暂无数据"
                    }
                }));
        },

        onClickItemView:function(event){     
            var eventTarget = event.currentTarget || event.target, id;
            var dataObj;
            id = $(eventTarget).attr("id");
            _.each(this.defaultParam, function(el){
                if(el.id == id){
                    dataObj = el.rule
                }
            }.bind(this));
            console.log(dataObj)
            this.ruleTable = $(_.template(template['tpl/specialLayerManage/specialLayerManage.viewRule.html'])({
                data: dataObj
            }));
            if (dataObj){    
                var idStr = "tr[data-nodeid=" + id + "]"+".toggle-show"
                this.$el.find(idStr).html(this.ruleTable[0]);
            }
            if(this.$el.find(idStr).css("display") == "none"){
                this.$el.find(idStr).show()
            }else{
                this.$el.find(idStr).hide()
            }
            
        },

        onGetError: function(error){
            if (error&&error.message)
                Utility.alerts(error.message)
            else
                Utility.alerts("服务器返回了没有包含明确信息的错误，请刷新重试或者联系开发测试人员！")
        },

        render: function(target) {
            this.$el.appendTo(target);

        }
    });

    return ReplaceNodeView;
});