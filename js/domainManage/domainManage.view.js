define("domainManage.view", ['require', 'exports', 'template', 'modal.view', 'utility'], function(require, exports, template, Modal, Utility) {

    var AddOrEditDomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.model = options.model;
            this.isEdit = options.isEdit;

            if(this.isEdit){
                this.args = {
                    id : this.model.get("id"),
                    domain : this.model.get("domain"),
                    user_id : this.model.get("user_id"),
                    cname : this.model.get("cname"),
                    type : this.model.get("type"),
                    audit_status : this.model.get("audit_status"),
                    test_url : this.model.get("test_url"),
                    description : this.model.get("description"),
                    origin_type : this.model.get("origin_type"),
                    origin_address : this.model.get("origin_address"),
                    cdn_factory : this.model.get("cdn_factory"),
                    conf_param : this.model.get("conf_param"),
                    conf_range : this.model.get("conf_range"),
                    refer_nullable : this.model.get("refer_nullable"),
                    refer_visit_control : this.model.get("refer_visit_control"),
                    refer_visit_content : this.model.get("refer_visit_content"),
                    ip_visit_control : this.model.get("ip_visit_control"),
                    wildcard : this.model.get("wildcard"),
                    region : this.model.get("region"),
                    host_type : this.model.get("host_type"),
                    protocol : this.model.get("protocol"),
                    has_origin_policy : this.model.get("has_origin_policy"),
                    custom_host_header : this.model.get("custom_host_header"),
                    ws_used : this.model.get("ws_used"),
                    ip_visit_content : this.model.get("ip_visit_content"),
                    policys:[]
                }
            }else{
                this.args = {
                    id : 0,
                    domain:"",
                    user_id:"",
                    cname:"",
                    type:1,
                    audit_status:null,
                    test_url:"",
                    description:"",
                    origin_type:1,
                    origin_address:"",
                    cdn_factory : 1,
                    conf_param:true,
                    conf_range:true,
                    refer_nullable:true,
                    refer_visit_control:0,
                    refer_visit_content:"",
                    ip_visit_control:0,
                    wildcard:1,
                    region:"",
                    host_type:1,
                    protocol:1,
                    has_origin_policy:true,
                    custom_host_header:"",
                    ws_used : 0,
                    ip_visit_content:"",
                    policys:[]
                }
            }

            this.$el = $(_.template(template['tpl/domainManage/domainManage.add&edit.html'])({data:this.args}));

            this.collection.off("get.cacheRuleList.success");
            this.collection.on("get.cacheRuleList.success", $.proxy(this.onGetCacheRuleListSuccess, this));
            this.collection.off("get.cacheRuleList.error");
            this.collection.on("get.cacheRuleList.error", $.proxy(this.onGetError, this));

            this.$el.find(".addCacheRule").on("click", $.proxy(this.onClickAddCacheRule,this));
            this.initDropMenu();

        },

        onGetCacheRuleListSuccess:function(res){
            if(res.length > 0){
                this.table = $(_.template(template['tpl/domainManage/domainManage.add&edit.table.html'])({data:res}));
                this.$el.find(".table-ctn").html(this.table[0]);
            }
            //this.args.policys = res;
            this.$el.find(".table-ctn .delete").off("click");
            this.$el.find(".table-ctn .delete").on("click", $.proxy(this.onClickDelete, this));
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        initDropMenu: function(){
            //加速类型
            var typeList = [
                {name: "下载", value: 1},
                {name: "直播", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeList, function(value){
                this.args.type = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(typeList,function(k,v){
                    if(v.value == this.model.get("type")){
                        this.$el.find("#dropdown-type .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //过滤参数
            var confParamList = [
                {name: "是", value: true},
                {name: "否", value: false}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-confParam"), confParamList, function(value){
                this.args.conf_param = $.trim(value);
            }.bind(this));
            if(this.isEdit){
                $.each(confParamList,function(k,v){
                    if(v.value == this.model.get("conf_param")){
                        this.$el.find("#dropdown-confParam .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //回源类型
            var originTypeList = [
                {name: "IP", value: 1},
                {name: "源站域名", value: 2},
                {name: "OSS域名", value: 3}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-originType"), originTypeList, function(value){
                this.args.origin_type = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(originTypeList,function(k,v){
                    if(v.value == this.model.get("origin_type")){
                        this.$el.find("#dropdown-originType .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //range回源
            var confRangeList = [
                {name: "是", value: true},
                {name: "否", value: false}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-confRange"), confRangeList, function(value){
                this.args.conf_range = $.trim(value);
            }.bind(this));
            if(this.isEdit){
                $.each(confRangeList,function(k,v){
                    if(v.value == this.model.get("conf_range")){
                        this.$el.find("#dropdown-confRange .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //refer是否为空
            var referNullableList = [
                {name: "是", value: true},
                {name: "否", value: false}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-referNullable"), referNullableList, function(value){
                this.args.refer_nullable = $.trim(value);
            }.bind(this));
            if(this.isEdit){
                $.each(referNullableList,function(k,v){
                    if(v.value == this.model.get("refer_nullable")){
                        this.$el.find("#dropdown-referNullable .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //refer防盗链开关及类型
            var referVisitControlList = [
                {name: "关闭", value: 0},
                {name: "白名单", value: 1},
                {name: "黑名单", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-referVisitControl"), referVisitControlList, function(value){
                this.args.refer_visit_control = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(referVisitControlList,function(k,v){
                    if(v.value == this.model.get("refer_visit_control")){
                        this.$el.find("#dropdown-referVisitControl .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //IP防盗链开关及类型
            var ipVisitControlList = [
                {name: "关闭", value: 0},
                {name: "白名单", value: 1},
                {name: "黑名单", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-ipVisitControl"), ipVisitControlList, function(value){
                this.args.ip_visit_control = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(ipVisitControlList,function(k,v){
                    if(v.value == this.model.get("ip_visit_control")){
                        this.$el.find("#dropdown-ipVisitControl .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //泛域名标识
            var wildcardList = [
                {name: "普通域名", value: 1},
                {name: "泛域名", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-wildcard"), wildcardList, function(value){
                this.args.wildcard = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(wildcardList,function(k,v){
                    if(v.value == this.model.get("wildcard")){
                        this.$el.find("#dropdown-wildcard .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //回源host头类型
            var hostTypeList = [
                {name: "加速域名", value: 1},
                {name: "回源域名", value: 2}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-hostType"), hostTypeList, function(value){
                this.args.host_type = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(hostTypeList,function(k,v){
                    if(v.value == this.model.get("host_type")){
                        this.$el.find("#dropdown-hostType .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //使用的协议
            var protocolList = [
                {name: "http+flv", value: 1},
                {name: "hls", value: 2},
                {name: "rtmp", value: 3}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-protocol"), protocolList, function(value){
                this.args.protocol = parseInt($.trim(value));
            }.bind(this));
            if(this.isEdit){
                $.each(protocolList,function(k,v){
                    if(v.value == this.model.get("protocol")){
                        this.$el.find("#dropdown-protocol .cur-value").html(v.name);
                    }
                }.bind(this));
            }
            //源站是否有缓存规则
            var originPolicyList = [
                {name: "是", value: true},
                {name: "否", value: false}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-originPolicy"), originPolicyList, function(value){
                this.args.has_origin_policy = $.trim(value);
            }.bind(this));
            if(this.isEdit){
                $.each(originPolicyList,function(k,v){
                    if(v.value == this.model.get("has_origin_policy")){
                        this.$el.find("#dropdown-originPolicy .cur-value").html(v.name);
                    }
                }.bind(this));
            }
        },

        onClickAddCacheRule:function(){
            if(this.isEdit){
                window.editDomainPopup.$el.modal("hide");
            }else{
                window.addDomainPopup.$el.modal("hide");
            }
            setTimeout(function() {
                this.onClickAddCacheRuleModal();
            }.bind(this), 500);
        },

        onClickDelete: function(e){
            var eTarget = e.srcElement || e.target,currentTr;

            if (eTarget.tagName == "SPAN") {
                currentTr = $(eTarget).parent().parent().parent();
            } else {
                currentTr = $(eTarget).parent().parent();
            }
            currentTr.remove();
            var tbodyLen = this.$el.find(".table-ctn tbody").children().length;
            if(!tbodyLen){
                this.$el.find(".table-ctn table").remove();
            }
        },

        onClickAddCacheRuleModal:function(){
            if (this.addCacheRulePopup) $("#" + this.addCacheRulePopup.modalId).remove();

            var addCacheRuleView = new AddCacheRuleView({
                collection: this.collection
            });
            var options = {
                title:"添加缓存规则",
                body : addCacheRuleView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addCacheRuleView.getArgs();
                    if (!options) return;
                    this.addCacheRulePopup.$el.modal("hide");
                    if(this.isEdit){
                        setTimeout(function() {
                            window.editDomainPopup.$el.modal("show");
                        }.bind(this), 500);
                    }else{
                        setTimeout(function() {
                            window.addDomainPopup.$el.modal("show");
                        }.bind(this), 500);
                    }
                    //添加缓存规则列表
                    var tableLen = this.$el.find(".table-ctn").children().length;
                    if(tableLen){
                        this.tr = $(_.template(template['tpl/domainManage/domainManage.cacheRule.tableTr.html'])({data:options}));
                        this.$el.find(".table-ctn tbody").append(this.tr[0].outerHTML);
                    }else{
                        this.table = $(_.template(template['tpl/domainManage/domainManage.add&edit.table.html'])({data:[options]}));
                        this.$el.find(".table-ctn").html(this.table[0]);
                    }
                    this.$el.find(".table-ctn .delete").off("click");
                    this.$el.find(".table-ctn .delete").on("click", $.proxy(this.onClickDelete, this));

                    //所有缓存规则（对象数组）
                    //this.args.policys.push(options);
                }.bind(this),
                onHiddenCallback: function(){
                    if(this.isEdit){
                        window.editDomainPopup.$el.modal("show");
                    }else{
                        window.addDomainPopup.$el.modal("show");
                    }
                }.bind(this)
            }
            this.addCacheRulePopup = new Modal(options);
        },

        getArgs: function() {
            this.args.domain = $.trim(this.$el.find("#input-name").val());
            this.args.user_id = $.trim(this.$el.find("#input-userId").val());
            this.args.cname = $.trim(this.$el.find("#input-cname").val());
            this.args.test_url = $.trim(this.$el.find("#input-testUrl").val());
            this.args.origin_address = $.trim(this.$el.find("#textarea-originAddress").val());
            this.args.refer_visit_content = $.trim(this.$el.find("#textarea-referVisitContent").val());
            this.args.ip_visit_content = $.trim(this.$el.find("#textarea-ipVisitContent").val());
            this.args.region = $.trim(this.$el.find("#textarea-region").val());
            this.args.custom_host_header = $.trim(this.$el.find("#input-customHostHeader").val());
            this.args.description = $.trim(this.$el.find("#textarea-description").val());

            //收集缓存规则
            var trLen = this.$el.find(".table-ctn tbody").children().length;
            for(var i = 0; i< trLen; i++){
                var json = {
                    type : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(0).attr("value")),
                    policy : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(1).attr("value")),
                    expire_time : $.trim(this.$el.find(".table-ctn tbody").children().eq(i).children().eq(2).attr("value"))
                }
                this.args.policys.push(json);
            }

            return this.args;
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var AddCacheRuleView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.$el = $(_.template(template['tpl/domainManage/domainManage.addCacheRule.html'])());
            this.initDropMenu();
        },

        initDropMenu:function(){
            var typeList = [
                {name: "文件后缀", value: 0},
                {name: "目录", value: 1},
                {name: "具体url",value:2},
                {name: "正则预留",value:3},
                {name: "url包含指定参数",value:4},
                {name: "全局默认缓存配置项",value:9}
            ];
            Utility.initDropMenu(this.$el.find(".dropdown-type"), typeList, function(value){
                this.type = value;
            }.bind(this));
        },

        getArgs: function() {
            return {
                type : this.type ? this.type : this.$el.find("#dropdown-type").siblings().children().eq(0).attr('value'),
                policy : $.trim(this.$el.find("#textarea-policy").val()),
                expire_time : parseInt($.trim(this.$el.find("#input-expireTime").val()))
            }
        },

        render: function(target) {
            this.$el.appendTo(target);
        }
    });

    var DomainManageView = Backbone.View.extend({
        events: {},

        initialize: function(options) {
            this.collection = options.collection;
            this.$el = $(_.template(template['tpl/domainManage/domainManage.html'])());
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));

            this.initPageDropMenu();

            this.getPageArgs = {
                domain: "",
                page: 1,
                count: 10
            };

            this.collection.getDomainList(this.getPageArgs); //请求域名列表接口

            this.collection.on("get.domainList.success", $.proxy(this.onGetDomainListSuccess,this));
            this.collection.on("get.domainList.error", $.proxy(this.onGetError,this));
            this.collection.on("delete.domain.success", $.proxy(this.onDeleteDomainSuccess, this));
            this.collection.on("delete.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("send.domain.success", $.proxy(this.onSendDomainSuccess, this));
            this.collection.on("send.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("add.domain.success", $.proxy(this.onAddDomainSuccess, this));
            this.collection.on("add.domain.error", $.proxy(this.onGetError,this));
            this.collection.on("edit.domain.success", $.proxy(this.oneditDomainSuccess, this));
            this.collection.on("edit.domain.error", $.proxy(this.onGetError,this));

            this.$el.find(".opt-ctn .create").on("click", $.proxy(this.onClickCreate, this));
            this.$el.find(".opt-ctn .query").on("click", $.proxy(this.onClickQueryButton, this));

            this.enterKeyBindQuery();
        },

        enterKeyBindQuery:function(){
            $(document).on('keydown', function(e){
                if(e.keyCode == 13){
                    this.onClickQueryButton();
                }
            }.bind(this));
        },

        onClickQueryButton: function(){
            this.isInitPaginator = false;
            this.getPageArgs.page = 1;
            this.getPageArgs.domain = this.$el.find("#input-domain").val();
            if (this.getPageArgs.domain == "") this.getPageArgs.domain = null;
            this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
            this.$el.find(".pagination").html("");
            this.collection.getDomainList(this.getPageArgs);
        },

        initTable: function(){
            if (this.collection.models.length !== 0){
                this.table = $(_.template(template['tpl/domainManage/domainManage.table.html'])({data:this.collection.models}));
                this.$el.find(".table-ctn").html(this.table[0]);
            }else{
                this.$el.find(".table-ctn").html(_.template(template['tpl/empty.html'])());
            }
        },

        onGetDomainListSuccess: function(){
            this.initTable();
            if (!this.isInitPaginator) this.initPaginator();
            this.$el.find(".table-ctn .edit").on("click", $.proxy(this.onClickEdit, this));
            this.$el.find(".table-ctn .delete").on("click", $.proxy(this.onClickDelete, this));
            this.$el.find(".table-ctn .send").on("click", $.proxy(this.onClickSend, this));
        },

        onDeleteDomainSuccess:function(res){
            alert("域名删除成功");
            this.collection.getDomainList(this.getPageArgs); //请求域名列表接口
        },

        onSendDomainSuccess:function(res){
            alert("域名下发成功");
            this.collection.getDomainList(this.getPageArgs); //请求域名列表接口
        },

        onAddDomainSuccess:function(res){
            alert("域名添加成功");
            this.collection.getDomainList(this.getPageArgs); //请求域名列表接口
        },

        oneditDomainSuccess:function(res){
            alert("域名修改成功");
            this.collection.getDomainList(this.getPageArgs); //请求域名列表接口
        },

        onClickCreate: function(){
            if (this.addDomainPopup) $("#" + this.addDomainPopup.modalId).remove();

            var addDomainView = new AddOrEditDomainManageView({
                collection: this.collection,
                isEdit: false
            });
            var options = {
                title:"添加域名",
                body : addDomainView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = addDomainView.getArgs();
                    if (!options) return;
                    this.collection.addDomain(options);
                    this.addDomainPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.addDomainPopup = new Modal(options);
            window.addDomainPopup = this.addDomainPopup;
        },

        onClickEdit:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            this.collection.getCacheRuleList(id); //调用显示缓存规则列表

            var model = this.collection.get(id);

            if(this.editDomainPopup) $("#" + this.editDomainPopup.modalId).remove();

            var editDomainView = new AddOrEditDomainManageView({
                collection: this.collection,
                model: model,
                isEdit: true
            });

            var options = {
                title:"编辑域名",
                body : editDomainView,
                backdrop : 'static',
                type     : 2,
                onOKCallback:  function(){
                    var options = editDomainView.getArgs();
                    if (!options) return;
                    this.collection.editDomain(options);
                    this.editDomainPopup.$el.modal("hide");
                }.bind(this),
                onHiddenCallback: function(){}.bind(this)
            }
            this.editDomainPopup = new Modal(options);
            window.editDomainPopup = this.editDomainPopup;
        },

        onClickDelete:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }
            var result = confirm("你确定要删除当前域名吗？")
            if (!result) return;
            //请求删除接口
            this.collection.deleteDomain(id);
        },

        onClickSend:function(e){
            var eTarget = e.srcElement || e.target,id;

            if (eTarget.tagName == "SPAN") {
                id = $(eTarget).parent().attr("id");
            } else {
                id = $(eTarget).attr("id");
            }

            var result = confirm("你确定要下发吗？")
            if (!result) return;
            //请求下发接口传id
            this.collection.sendDomain(id);
        },

        initPaginator: function(){
            this.$el.find(".total-items span").html(this.collection.total)
            if (this.collection.total <= this.getPageArgs.count) return;
            var total = Math.ceil(this.collection.total/this.getPageArgs.count);

            this.$el.find(".pagination").jqPaginator({
                totalPages: total,
                visiblePages: 10,
                currentPage: 1,
                onPageChange: function (num, type) {
                    if (type !== "init"){
                        this.$el.find(".table-ctn").html(_.template(template['tpl/loading.html'])({}));
                        var args = _.extend(this.getPageArgs);
                        args.page = num;
                        args.count = this.getPageArgs.count;
                        this.collection.getDomainList(args); //请求域名列表接口
                    }
                }.bind(this)
            });
            this.isInitPaginator = true;
        },

        initPageDropMenu: function(){
            var pageNum = [
                {name: "10条", value: 10},
                {name: "20条", value: 20},
                {name: "50条", value: 50},
                {name: "100条", value: 100}
            ]
            Utility.initDropMenu(this.$el.find(".page-num"), pageNum, function(value){
                this.getPageArgs.count = value;
                this.getPageArgs.page = 1;
                this.collection.getDomainList(this.getPageArgs);
            }.bind(this));
        },

        onGetError: function(error) {
            if (error && error.message)
                alert(error.message)
            else
                alert("网络阻塞，请刷新重试！")
        },

        hide: function() {
            this.$el.hide();
            $(document).off('keydown');
        },

        update: function() {
            this.$el.show();
            this.enterKeyBindQuery();
        },

        render: function(target) {
            this.$el.appendTo(target)
        }
    });

    return DomainManageView;
});