define("setupChannelManage.edit.view", ['require','exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var EditChannelView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.options = options;
            this.collection = options.collection;
            this.model      = options.model;
            this.isEdit = options.isEdit;

            this.$el = $(_.template(template['tpl/setupChannelManage/setupChannelManage.edit.html'])({data: {}}));

            this.$el.find(".opt-ctn .save").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".opt-ctn .cancel").on("click", $.proxy(this.onClickCancelButton, this));
            this.$el.find(".use-customized .togglebutton input").on("click", $.proxy(this.onClickIsUseCustomizedBtn, this));
            this.$el.find(".view-setup-list").on("click", $.proxy(this.onClickViewSetupBillBtn, this))

            this.collection.off("get.channel.config.success");
            this.collection.off("get.channel.config.error");
            this.collection.on("get.channel.config.success", $.proxy(this.initSetup, this));
            this.collection.on("get.channel.config.error", $.proxy(this.onGetError, this));
            this.collection.getChannelConfig({
                domain: this.model.get("domain"),
                version: this.model.get("version") || this.model.get("domainVersion")
            })

            if (this.model.get("topologyId")) {
                require(['setupTopoManage.model'], function(SetupTopoManageModel){
                    var mySetupTopoManageModel = new SetupTopoManageModel();
                    mySetupTopoManageModel.on("get.topo.OriginInfo.success", $.proxy(this.onGetTopoInfo, this));
                    mySetupTopoManageModel.on("get.topo.OriginInfo.error", $.proxy(this.onGetError, this));
                    mySetupTopoManageModel.getTopoOrigininfo(this.model.get("topologyId"))
                }.bind(this));
            }
        },

        onGetTopoInfo: function(data){
            this.$el.find("#input-topology").val(data.name);
        },

        initSetup: function(data){
            this.$el.find("#input-domain").val(this.model.get("domain"));
            this.$el.find("#input-type").val(this.model.get("businessTypeName") || this.model.get("platformName"));
            this.$el.find("#input-protocol").val(this.model.get("protocolName"));
            this.$el.find("#input-application").val(data.applicationType.name);
            this.$el.find("#text-comment").val(this.model.get("description"));

            var isUseCustomized = this.model.get("tempUseCustomized");
            this.$el.find(".use-customized .togglebutton input").attr("disabled", "disabled");
            if (isUseCustomized === 2){
                this.$el.find(".use-customized .togglebutton input").get(0).checked = true;
                this.showCustomized();
            } else {
                this.$el.find(".use-customized .togglebutton input").get(0).checked = false;
                this.hideCustomized();
            }

            this.initConfigFile(data);
        },

        initConfigFile: function(data){
            var upArray = [], downArray = [];
            _.each(data, function(el, key, ls){
                if (key !== "applicationType"){
                    _.each(el, function(fileObj, index, list){
                        if (fileObj.topologyLevel === 1){
                            upArray.push({
                                id: fileObj.id,
                                name: key,
                                content: fileObj.content,
                                luaOnly: fileObj.luaOnly === undefined ? true : fileObj.luaOnly
                            })
                        } else if (fileObj.topologyLevel === 2){
                            downArray.push({
                                id: fileObj.id,
                                name: key,
                                content: fileObj.content,
                                luaOnly: fileObj.luaOnly === undefined ? true : fileObj.luaOnly
                            })
                        }
                    }.bind(this))
                }
            }.bind(this))

            this.configReadOnly = $(_.template(template['tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'])({
                data: {up: upArray, down: downArray},
                panelId: Utility.randomStr(8)
            }));
            this.configReadOnly.appendTo(this.$el.find(".automatic"))

            var tplPath = 'tpl/setupChannelManage/setupChannelManage.editCfgTrue.html';
            if (!this.isEdit) tplPath = 'tpl/setupChannelManage/setupChannelManage.editCfgFalse.html'

            this.configEdit = $(_.template(template[tplPath])({
                data: {up: upArray, down: downArray},
                panelId: Utility.randomStr(8)
            }));
            this.configEdit.appendTo(this.$el.find(".customized"))
        },

        onClickIsUseCustomizedBtn: function(event){
            var eventTarget = event.srcElement || event.target;
            if (eventTarget.tagName !== "INPUT") return;
            if (eventTarget.checked){
                this.model.set("tempUseCustomized", 2);
                this.showCustomized();
            } else {
                this.model.set("tempUseCustomized", 1);
                this.hideCustomized();
            }
        },

        hideCustomized: function(){
            this.$el.find(".customized").hide();
            this.$el.find(".customized-comment").hide();
            this.$el.find(".automatic").addClass("col-md-offset-3");
        },

        showCustomized: function(){
            this.$el.find(".customized").show();
            this.$el.find(".customized-comment").show();
            this.$el.find(".automatic").removeClass("col-md-offset-3");
        },

        onClickViewSetupBillBtn: function(){
            require(['setupBill.view', 'setupBill.model'], function(SetupBillView, SetupBillModel){
                var mySetupBillModel = new SetupBillModel();
                var mySetupBillView = new SetupBillView({
                    collection: mySetupBillModel,
                    originId: this.model.get("id"),
                    onSaveCallback: function(){}.bind(this),
                    onCancelCallback: function(){
                        mySetupBillView.$el.remove();
                        this.$el.find(".edit-panel").show();
                    }.bind(this)
                })

                this.$el.find(".edit-panel").hide();
                mySetupBillView.render(this.$el.find(".bill-panel"));
            }.bind(this))
        },

        onClickCancelButton: function(){
            this.options.onCancelCallback && this.options.onCancelCallback();
        },

        onGetError: function(error){
            if (error&&error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    return EditChannelView;
});