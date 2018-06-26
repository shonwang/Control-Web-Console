'use strict';

var _extends = Object.assign || function (target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i]; for (var key in source) { if (Object.prototype.hasOwnProperty.call(source, key)) { target[key] = source[key]; } } } return target; };

var _createClass = function () { function defineProperties(target, props) { for (var i = 0; i < props.length; i++) { var descriptor = props[i]; descriptor.enumerable = descriptor.enumerable || false; descriptor.configurable = true; if ("value" in descriptor) descriptor.writable = true; Object.defineProperty(target, descriptor.key, descriptor); } } return function (Constructor, protoProps, staticProps) { if (protoProps) defineProperties(Constructor.prototype, protoProps); if (staticProps) defineProperties(Constructor, staticProps); return Constructor; }; }();

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

define("preheatManage.edit.view", ['require', 'exports', 'template', 'base.view', 'utility', "antd", 'react.backbone', "moment"], function (require, exports, template, BaseView, Utility, Antd, React, moment) {

    var Button = Antd.Button,
        Input = Antd.Input,
        Form = Antd.Form,
        Spin = Antd.Spin,
        FormItem = Form.Item,
        Select = Antd.Select,
        Option = Select.Option,
        Modal = Antd.Modal,
        Table = Antd.Table,
        InputNumber = Antd.InputNumber,
        Tag = Antd.Tag,
        Icon = Antd.Icon,
        Tooltip = Antd.Tooltip,
        Upload = Antd.Upload,
        List = Antd.List,
        DatePicker = Antd.DatePicker,
        TimePicker = Antd.TimePicker,
        RangePicker = DatePicker.RangePicker,
        Col = Antd.Col,
        confirm = Modal.confirm;

    var PreheatManageEditForm = function (_React$Component) {
        _inherits(PreheatManageEditForm, _React$Component);

        function PreheatManageEditForm(props, context) {
            _classCallCheck(this, PreheatManageEditForm);

            var _this = _possibleConstructorReturn(this, (PreheatManageEditForm.__proto__ || Object.getPrototypeOf(PreheatManageEditForm)).call(this, props));

            _this.onClickCancel = _this.onClickCancel.bind(_this);
            _this.renderTaskNameView = _this.renderTaskNameView.bind(_this);
            _this.renderNodesTableView = _this.renderNodesTableView.bind(_this);
            _this.renderTimeBandTableView = _this.renderTimeBandTableView.bind(_this);
            _this.validateTimeBand = _this.validateTimeBand.bind(_this);
            _this.validateNodesList = _this.validateNodesList.bind(_this);
            _this.handleSubmit = _this.handleSubmit.bind(_this);
            _this.state = {
                //上传
                fileList: [],
                uploading: false,
                //预热节点
                isLoadingNodesList: false,
                nodesList: [],
                nodeModalVisible: false,
                nodeDataSource: [],
                isEditNode: false,
                curEditNode: {},
                //分时带宽
                timeBandList: [],
                timeModalVisible: false,
                isEditTime: false,
                curEditTime: {}
            };
            moment.locale("zh");
            return _this;
        }

        _createClass(PreheatManageEditForm, [{
            key: 'componentDidMount',
            value: function componentDidMount() {
                var preHeatProps = this.props.preHeatProps,
                    nodeList = preHeatProps.nodeList;
                if (nodeList.length == 0) {
                    require(['nodeManage.model'], function (NodeManageModel) {
                        var nodeManageModel = new NodeManageModel();
                        nodeManageModel.on("get.node.success", $.proxy(this.onGetNodeListSuccess, this));
                        nodeManageModel.on("get.node.error", $.proxy(this.onGetNodeListError, this));
                        nodeManageModel.getNodeList({ page: 1, count: 9999 });
                        this.setState({
                            isLoadingNodesList: true
                        });
                    }.bind(this));
                }
            }
        }, {
            key: 'componentWillUnmount',
            value: function componentWillUnmount() {}
        }, {
            key: 'onGetNodeListSuccess',
            value: function onGetNodeListSuccess(res) {
                this.props.preHeatProps.nodeList = res;
                this.setState({
                    isLoadingNodesList: false
                });
            }
        }, {
            key: 'onGetNodeListError',
            value: function onGetNodeListError(error) {
                var msg = error ? error.message : "获取节点信息失败!";
                Utility.alerts(msg);
            }
        }, {
            key: 'handleSubmit',
            value: function handleSubmit(e) {
                e.preventDefault();
                this.props.form.validateFields(function (err, vals) {
                    if (!err) {}
                });
            }
        }, {
            key: 'onClickCancel',
            value: function onClickCancel() {
                var onClickCancelCallback = this.props.preHeatProps.onClickCancelCallback;
                onClickCancelCallback && onClickCancelCallback();
            }
        }, {
            key: 'onUploadFile',
            value: function onUploadFile(e) {
                console.log('Upload event:', e);
                if (Array.isArray(e)) {
                    return e;
                }
                return e && e.fileList;
            }
        }, {
            key: 'validateDomain',
            value: function validateDomain(rule, value, callback) {
                if (value && Utility.isDomain(value)) {
                    callback();
                } else {
                    callback('请输入正确的域名！');
                }
            }
        }, {
            key: 'validateNodesList',
            value: function validateNodesList(rule, value, callback) {
                if (this.state.nodesList.length != 0) {
                    callback();
                } else {
                    callback('请添加预热节点！');
                }
            }
        }, {
            key: 'validateTimeBand',
            value: function validateTimeBand(rule, value, callback) {
                if (this.state.timeBandList.length != 0) {
                    callback();
                } else {
                    callback('请添加分时带宽！');
                }
            }
        }, {
            key: 'renderTaskNameView',
            value: function renderTaskNameView(formItemLayout) {
                var _this2 = this;

                var _props$form = this.props.form,
                    getFieldDecorator = _props$form.getFieldDecorator,
                    setFieldsValue = _props$form.setFieldsValue,
                    getFieldValue = _props$form.getFieldValue;

                var taskNameView = "",
                    model = this.props.model;

                var files = ['Racing car sprays burning fuel into crowd.', 'Japanese princess to wed commoner.', 'Australian walks 100km after outback crash.', 'Man charged over missing wedding girl.', 'Los Angeles battles huge wildfires.'];

                var uploadProps = {
                    action: '//jsonplaceholder.typicode.com/posts/',
                    onRemove: function onRemove(file) {
                        var fileList = getFieldValue("fileList");
                        var index = fileList.indexOf(file);
                        var newFileList = fileList.slice();
                        newFileList.splice(index, 1);
                        setFieldsValue({
                            fileList: newFileList
                        });
                        console.log(_this2.props.form.getFieldsValue());
                    },
                    beforeUpload: function beforeUpload(file) {
                        console.log(_this2.props.form.getFieldsValue());
                        var fileList = getFieldValue("fileList"),
                            newFileList = [].concat(_toConsumableArray(fileList), [file]);
                        setFieldsValue({
                            fileList: newFileList
                        });
                        return false;
                    },
                    multiple: true
                };

                if (this.props.isEdit) {
                    taskNameView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.name
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u57DF\u540D', style: { marginBottom: "0px" } }),
                            React.createElement(
                                'span',
                                { className: 'ant-form-text' },
                                model.name
                            )
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6' }),
                            React.createElement(List, { size: 'small', dataSource: files, renderItem: function renderItem(item) {
                                    return React.createElement(
                                        List.Item,
                                        null,
                                        item
                                    );
                                } })
                        )
                    );
                } else {
                    taskNameView = React.createElement(
                        'div',
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u4EFB\u52A1\u540D\u79F0', hasFeedback: true }),
                            getFieldDecorator('taskName', {
                                rules: [{ required: true, message: '请输入任务名称!' }]
                            })(React.createElement(Input, null))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u57DF\u540D', hasFeedback: true }),
                            getFieldDecorator('taskDomain', {
                                validateFirst: true,
                                rules: [{
                                    required: true, message: '请输入预热域名!' }, {
                                    validator: this.validateDomain
                                }]
                            })(React.createElement(Input, null))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u6587\u4EF6' }),
                            React.createElement(
                                'div',
                                { className: 'dropbox' },
                                getFieldDecorator('fileList', {
                                    valuePropName: 'fileList',
                                    getValueFromEvent: $.proxy(this.onUploadFile, this),
                                    initialValue: this.state.fileList,
                                    rules: [{ type: "array", required: true, message: '请上传预热文件!' }]
                                })(React.createElement(
                                    Upload.Dragger,
                                    uploadProps,
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-drag-icon' },
                                        React.createElement(Icon, { type: 'inbox' })
                                    ),
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-text' },
                                        'Click or drag file to this area to upload'
                                    ),
                                    React.createElement(
                                        'p',
                                        { className: 'ant-upload-hint' },
                                        'Support for a single or bulk upload.'
                                    )
                                ))
                            )
                        )
                    );
                }

                return taskNameView;
            }
        }, {
            key: 'handleCancel',
            value: function handleCancel() {
                this.setState({
                    nodeModalVisible: false,
                    timeModalVisible: false
                });
            }
        }, {
            key: 'onClickAddNodes',
            value: function onClickAddNodes(event) {
                this.setState({
                    isEditNode: false,
                    curEditNode: {},
                    nodeModalVisible: true
                });
            }
        }, {
            key: 'handleNodeOk',
            value: function handleNodeOk(e) {
                var _this3 = this;

                e.preventDefault();
                var _state = this.state,
                    nodesList = _state.nodesList,
                    isEditNode = _state.isEditNode,
                    curEditNode = _state.curEditNode;
                var _props$form2 = this.props.form,
                    getFieldsValue = _props$form2.getFieldsValue,
                    validateFields = _props$form2.validateFields;

                var newNodes = null;
                validateFields(["selectNodes", "inputOriginBand"], function (err, vals) {
                    if (!err && !isEditNode) {
                        console.log(getFieldsValue());
                        newNodes = {
                            index: nodesList.length + 1,
                            id: Utility.randomStr(8),
                            nodeName: getFieldsValue().selectNodes,
                            opType: getFieldsValue().inputOriginBand
                        };
                        _this3.setState({
                            nodesList: [].concat(_toConsumableArray(nodesList), [newNodes]),
                            nodeModalVisible: false
                        });
                    } else if (!err && isEditNode) {
                        _.find(nodesList, function (el) {
                            if (el.id == curEditNode.id) {
                                el.nodeName = getFieldsValue().selectNodes, el.opType = getFieldsValue().inputOriginBand;
                            }
                        });

                        _this3.setState({
                            nodesList: [].concat(_toConsumableArray(nodesList)),
                            nodeModalVisible: false
                        });
                    }
                });
            }
        }, {
            key: 'handleNodeSearch',
            value: function handleNodeSearch(value) {
                var preHeatProps = this.props.preHeatProps;
                var nodeArray = [],
                    nodeList = preHeatProps.nodeList;
                if (value && nodeList) {
                    nodeArray = _.filter(nodeList, function (el) {
                        return el.name.indexOf(value) > -1 || el.chName.indexOf(value) > -1;
                    }.bind(this)).map(function (el) {
                        return React.createElement(
                            Option,
                            { key: el.id },
                            el.chName
                        );
                    });
                }

                this.setState({
                    nodeDataSource: nodeArray
                });
            }
        }, {
            key: 'onClickEditNode',
            value: function onClickEditNode(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.nodesList, function (obj) {
                    return obj.id == id;
                }.bind(this));

                this.setState({
                    nodeModalVisible: true,
                    isEditNode: true,
                    curEditNode: model
                });
            }
        }, {
            key: 'onClickDeleteNode',
            value: function onClickDeleteNode(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function () {
                        var list = _.filter(this.state.nodesList, function (obj) {
                            return obj.id !== id;
                        }.bind(this));
                        _.each(list, function (el, index) {
                            el.index = index + 1;
                        });
                        this.setState({
                            nodesList: list
                        });
                    }.bind(this)
                });
            }
        }, {
            key: 'renderNodesTableView',
            value: function renderNodesTableView(formItemLayout) {
                var _this4 = this,
                    _React$createElement;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state2 = this.state,
                    nodesList = _state2.nodesList,
                    nodeModalVisible = _state2.nodeModalVisible,
                    nodeDataSource = _state2.nodeDataSource,
                    curEditNode = _state2.curEditNode;

                var preheatNodesView = "",
                    model = this.props.model;
                var columns = [{
                    title: '批次',
                    dataIndex: 'index',
                    key: 'index'
                }, {
                    title: '预热节点',
                    dataIndex: 'nodeName',
                    key: 'nodeName',
                    render: function render(text, record) {
                        var colors = ['pink', 'red', 'orange', 'green', 'cyan', 'blue', 'purple'];
                        var content = [];
                        var random = void 0;
                        for (var i = 0; i < record.nodeName.length; i++) {
                            random = Math.floor(Math.random() * colors.length);
                            content.push(React.createElement(
                                Tag,
                                { color: colors[random], key: i, style: { marginBottom: '5px' } },
                                record.nodeName[i].label
                            ));
                        }
                        return content;
                    }
                }, {
                    title: '回源带宽',
                    dataIndex: 'opType',
                    key: 'opType',
                    render: function render(text, record) {
                        return text + "M";
                    }
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    render: function render(text, record) {
                        var editButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "编辑" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this4.onClickEditNode, _this4) },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this4.onClickDeleteNode, _this4) },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var buttonGroup;
                        // if (record.status == 2) {
                        //     buttonGroup = (<div>{playButton}</div>)
                        // } else if (record.status == 1) {
                        buttonGroup = React.createElement(
                            'div',
                            null,
                            editButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            deleteButton
                        );
                        // }
                        return buttonGroup;
                    }
                }];

                var addEditNodesView = null;

                if (this.state.isLoadingNodesList) {
                    addEditNodesView = React.createElement(
                        'div',
                        { style: { textAlign: "center" } },
                        React.createElement(Spin, null)
                    );
                } else {
                    addEditNodesView = React.createElement(
                        Form,
                        null,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u9884\u70ED\u8282\u70B9' }),
                            getFieldDecorator('selectNodes', {
                                initialValue: curEditNode.nodeName || [],
                                rules: [{ type: "array", required: true, message: '请选择预热节点!' }]
                            })(React.createElement(
                                Select,
                                { mode: 'multiple', allowClear: true, style: {},
                                    labelInValue: true,
                                    notFoundContent: '请输入节点关键字',
                                    filterOption: false,
                                    onSearch: $.proxy(this.handleNodeSearch, this) },
                                nodeDataSource
                            ))
                        ),
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u56DE\u6E90\u5E26\u5BBD' }),
                            getFieldDecorator('inputOriginBand', {
                                initialValue: curEditNode.opType || 100,
                                rules: [{ required: true, message: '请输入回源带宽!' }]
                            })(React.createElement(InputNumber, null)),
                            React.createElement(
                                'span',
                                { style: { marginLeft: "10px" } },
                                'M'
                            )
                        )
                    );
                }

                preheatNodesView = React.createElement(
                    FormItem,
                    _extends({}, formItemLayout, { label: '\u9884\u70ED\u8282\u70B9', required: true }),
                    React.createElement(
                        Button,
                        { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddNodes, this) },
                        '\u6DFB\u52A0'
                    ),
                    getFieldDecorator('nodesList', {
                        rules: [{ validator: this.validateNodesList }]
                    })(React.createElement(Table, { rowKey: 'id', columns: columns, pagination: false, size: 'small', dataSource: nodesList })),
                    React.createElement(
                        Modal,
                        (_React$createElement = { title: '预热节点', destroyOnClose: true
                        }, _defineProperty(_React$createElement, 'destroyOnClose', true), _defineProperty(_React$createElement, 'visible', nodeModalVisible), _defineProperty(_React$createElement, 'onOk', $.proxy(this.handleNodeOk, this)), _defineProperty(_React$createElement, 'onCancel', $.proxy(this.handleCancel, this)), _React$createElement),
                        addEditNodesView
                    )
                );

                return preheatNodesView;
            }
        }, {
            key: 'onClickAddTime',
            value: function onClickAddTime(event) {
                this.setState({
                    isEditTime: false,
                    curEditTime: {},
                    timeModalVisible: true
                });
            }
        }, {
            key: 'handleTimeOk',
            value: function handleTimeOk(e) {
                var _this5 = this;

                e.preventDefault();
                var _state3 = this.state,
                    timeBandList = _state3.timeBandList,
                    isEditTime = _state3.isEditTime,
                    curEditTime = _state3.curEditTime;
                var _props$form3 = this.props.form,
                    getFieldsValue = _props$form3.getFieldsValue,
                    validateFields = _props$form3.validateFields;

                var newTimeBand = null;
                validateFields(["selectStartTime", "selectEndTime", "inputBand"], function (err, vals) {
                    var format = 'HH:mm';
                    var time = getFieldsValue().selectStartTime.format(format) + "-" + getFieldsValue().selectEndTime.format(format);
                    if (!err && !isEditTime) {
                        console.log(getFieldsValue());
                        newTimeBand = {
                            id: Utility.randomStr(8),
                            createTime: time,
                            opType: getFieldsValue().inputBand
                        };
                        _this5.setState({
                            timeBandList: [].concat(_toConsumableArray(timeBandList), [newTimeBand]),
                            timeModalVisible: false
                        });
                    } else if (!err && isEditTime) {
                        time = curEditTime.selectStartTime.format(format) + "-" + curEditTime.selectEndTime.format(format);
                        _.each(timeBandList, function (el) {
                            if (el.id == curEditTime.id) {
                                el.createTime = time;
                                el.opType = curEditTime.opType;
                            }
                        });
                        _this5.setState({
                            timeBandList: [].concat(_toConsumableArray(timeBandList)),
                            timeModalVisible: false
                        });
                    }
                });
            }
        }, {
            key: 'handleEditTimeClick',
            value: function handleEditTimeClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                var model = _.find(this.state.timeBandList, function (obj) {
                    return obj.id == id;
                }.bind(this));
                var format = 'HH:mm',
                    selectStartTime = model.createTime.split("-")[0],
                    selectEndTime = model.createTime.split("-")[1];
                this.setState({
                    timeModalVisible: true,
                    isEditTime: true,
                    curEditTime: {
                        selectStartTime: moment(selectStartTime, format),
                        selectEndTime: moment(selectEndTime, format),
                        opType: model.opType,
                        id: model.id
                    }
                });
            }
        }, {
            key: 'handleDeleteTimeClick',
            value: function handleDeleteTimeClick(event) {
                var eventTarget = event.srcElement || event.target,
                    id;
                if (eventTarget.tagName == "I") {
                    eventTarget = $(eventTarget).parent();
                    id = eventTarget.attr("id");
                } else {
                    id = $(eventTarget).attr("id");
                }
                confirm({
                    title: '你确定要删除吗？',
                    okText: '确定',
                    okType: 'danger',
                    cancelText: '算了，不删了',
                    onOk: function () {
                        var list = _.filter(this.state.timeBandList, function (obj) {
                            return obj.id !== id;
                        }.bind(this));
                        this.setState({
                            timeBandList: list
                        });
                    }.bind(this)
                });
            }
        }, {
            key: 'renderTimeBandTableView',
            value: function renderTimeBandTableView(formItemLayout) {
                var _this6 = this,
                    _React$createElement2;

                var getFieldDecorator = this.props.form.getFieldDecorator;
                var _state4 = this.state,
                    timeModalVisible = _state4.timeModalVisible,
                    curEditTime = _state4.curEditTime;

                var timeBandView = "",
                    model = this.props.model;
                var columns = [{
                    title: '时间',
                    dataIndex: 'createTime',
                    key: 'createTime'
                }, {
                    title: '带宽',
                    dataIndex: 'opType',
                    key: 'opType',
                    render: function render(text, record) {
                        return text + "M";
                    }
                }, {
                    title: '操作',
                    dataIndex: 'id',
                    key: 'action',
                    render: function render(text, record) {
                        var editButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "编辑" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this6.handleEditTimeClick, _this6) },
                                React.createElement(Icon, { type: 'edit' })
                            )
                        );
                        var deleteButton = React.createElement(
                            Tooltip,
                            { placement: 'bottom', title: "删除" },
                            React.createElement(
                                'a',
                                { href: 'javascript:void(0)', id: record.id, onClick: $.proxy(_this6.handleDeleteTimeClick, _this6) },
                                React.createElement(Icon, { type: 'delete' })
                            )
                        );
                        var buttonGroup;
                        // if (record.status == 2) {
                        //     buttonGroup = (<div>{playButton}</div>)
                        // } else if (record.status == 1) {
                        buttonGroup = React.createElement(
                            'div',
                            null,
                            editButton,
                            React.createElement('span', { className: 'ant-divider' }),
                            deleteButton
                        );
                        // }
                        return buttonGroup;
                    }
                }];

                var format = 'HH:mm';

                var addEditTimeView = React.createElement(
                    Form,
                    null,
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u65F6\u95F4', required: true }),
                        React.createElement(
                            Col,
                            { span: 11 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('selectStartTime', {
                                    rules: [{ required: true, message: '请选择开始时间!' }],
                                    initialValue: curEditTime.selectStartTime || moment('00:00', format)
                                })(React.createElement(TimePicker, { format: format, minuteStep: 1 }))
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 2 },
                            React.createElement(
                                'span',
                                { style: { display: 'inline-block', width: '100%', textAlign: 'center' } },
                                '-'
                            )
                        ),
                        React.createElement(
                            Col,
                            { span: 11 },
                            React.createElement(
                                FormItem,
                                null,
                                getFieldDecorator('selectEndTime', {
                                    rules: [{ required: true, message: '请选择结束时间!' }],
                                    initialValue: curEditTime.selectEndTime || moment('23:59', format)
                                })(React.createElement(TimePicker, { format: format, minuteStep: 1 }))
                            )
                        )
                    ),
                    React.createElement(
                        FormItem,
                        _extends({}, formItemLayout, { label: '\u5E26\u5BBD' }),
                        getFieldDecorator('inputBand', {
                            initialValue: curEditTime.opType || 100,
                            rules: [{ required: true, message: '请输入带宽!' }]
                        })(React.createElement(InputNumber, null)),
                        React.createElement(
                            'span',
                            { style: { marginLeft: "10px" } },
                            'M'
                        )
                    )
                );

                timeBandView = React.createElement(
                    FormItem,
                    _extends({}, formItemLayout, { label: '\u5206\u65F6\u5E26\u5BBD', required: true }),
                    React.createElement(
                        Button,
                        { icon: 'plus', size: 'small', onClick: $.proxy(this.onClickAddTime, this) },
                        '\u6DFB\u52A0'
                    ),
                    getFieldDecorator('timeBand', {
                        rules: [{ validator: this.validateTimeBand }]
                    })(React.createElement(Table, { rowKey: 'id', columns: columns, pagination: false, size: 'small', dataSource: this.state.timeBandList })),
                    React.createElement(
                        Modal,
                        (_React$createElement2 = { title: '分时带宽', destroyOnClose: true
                        }, _defineProperty(_React$createElement2, 'destroyOnClose', true), _defineProperty(_React$createElement2, 'visible', timeModalVisible), _defineProperty(_React$createElement2, 'onOk', $.proxy(this.handleTimeOk, this)), _defineProperty(_React$createElement2, 'onCancel', $.proxy(this.handleCancel, this)), _React$createElement2),
                        addEditTimeView
                    )
                );

                return timeBandView;
            }
        }, {
            key: 'disabledDate',
            value: function disabledDate(current) {
                return current && current < moment().add(-1, 'day');
            }
        }, {
            key: 'disabledTime',
            value: function disabledTime(_, type) {
                function range(start, end) {
                    var result = [];
                    for (var i = start; i < end; i++) {
                        result.push(i);
                    }
                    return result;
                }

                if (type === 'start') {
                    return {
                        disabledHours: function disabledHours() {
                            return range(0, moment().hour() + 1);
                        }
                    };
                }
            }
        }, {
            key: 'render',
            value: function render() {
                var getFieldDecorator = this.props.form.getFieldDecorator;

                var formItemLayout = {
                    labelCol: { span: 6 },
                    wrapperCol: { span: 14 }
                };
                var taskNameView = this.renderTaskNameView(formItemLayout);
                var preheatNodesView = this.renderNodesTableView(formItemLayout);
                var timeBandView = this.renderTimeBandTableView(formItemLayout);

                return React.createElement(
                    'div',
                    null,
                    React.createElement(
                        Form,
                        { onSubmit: this.handleSubmit },
                        taskNameView,
                        preheatNodesView,
                        timeBandView,
                        React.createElement(
                            FormItem,
                            _extends({}, formItemLayout, { label: '\u8D77\u6B62\u65F6\u95F4' }),
                            getFieldDecorator('range-time-picker', {
                                rules: [{ type: 'array', required: true, message: '请选择起止时间！' }]
                            })(React.createElement(RangePicker, { showTime: { format: 'HH:mm', minuteStep: 30 },
                                format: 'YYYY/MM/DD HH:mm',
                                disabledDate: this.disabledDate,
                                disabledTime: this.disabledTime }))
                        ),
                        React.createElement(
                            FormItem,
                            { wrapperCol: { span: 12, offset: 6 } },
                            React.createElement(
                                Button,
                                { type: 'primary', htmlType: 'submit' },
                                '\u4FDD\u5B58'
                            ),
                            React.createElement(
                                Button,
                                { onClick: this.onClickCancel, style: { marginLeft: "10px" } },
                                '\u53D6\u6D88'
                            )
                        )
                    )
                );
            }
        }]);

        return PreheatManageEditForm;
    }(React.Component);

    var PreheatManageEditView = Form.create()(PreheatManageEditForm);
    return PreheatManageEditView;
});
