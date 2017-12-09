/*
 * 币种卡片
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import {observer} from 'mobx-react';
import {Select as TinperSelect} from "tinper-bee";
import Select from 'react-select';
import 'react-select/dist/react-select.css';
import {Refers} from 'ssc-refer';
import GlobalStore from '../../stores/GlobalStore';
import Config from '../../config';

let title = {'add': '新增', 'edit': '编辑'}

@observer
export default class CurrencyList extends Component {
    static propTypes = {
        store: PropTypes.object
    }

    constructor(props) {
        super(props)
        this.store = props.store;
        this.state = {
            show: false,
            value: '',
            index: -1,
            validation: {
                pricedigit: null,
                moneydigit: null
            },
            refJsonData: this.store.refJsonData,
            selectedOption:{},
            matchPos: 'any',
            matchValue: true,
            matchLabel: true,
            selectValue: this.store.currency.code,
            options: [{ value: '奥令', label: '11', className: 'State-ACT' },
                { value: '先例', label: '22', className: 'State-NSW' },
                { value: '日元', label: '33', className: 'State-Vic' },
                { value: '港币', label: '44', className: 'State-Qld' },
                { value: '人民币', label: '55', className: 'State-WA' },
                { value: '泰元', label: '66', className: 'State-SA' },
                { value: '韩元', label: '77', className: 'State-Tas' },
                { value: '美元', label: '88', className: 'State-NT' }]
        }

        this.handleRule = this.handleRule.bind(this);
    }

    componentDidMount() {
        this.store.getRefData();

    }

    // 取消
    close() {
        this.store.page = 1;
        if (this.state.flag == 'add') {
            Object.assign(this.store.currency, {
                code: '',
                name: '',
                sign: '',
                pricedigit: 6,
                moneydigit: 2,
                pricerount: 5,
                moneyrount: 5,
                description: '',
                isdefault: 0
            })
        }
        if (this.state.flag == 'edit') {
            Object.assign(this.store.currency, this.store.editCurrencyData);
        }
        this.refs.message.innerHTML = '';
        this.refs.pricedigit.innerHTML = '';
        this.refs.moneydigit.innerHTML = '';
    }


    // 币种参照
    changeCurrency(select) {
        if (select.length <= 0)
            return
        let value = select[0];
        Object.assign(this.store.currency, value);
        this.refs.message.innerHTML = " ";
        // 数据校验
        this.store.ListData.map((value, index) => {
            let val = this.store.currency.code;
            if (value.code == val) {
                this.refs.message.innerHTML = "币种已存在！";
                return;
            }
        });
    }

    // 文本框改变
    handleChange(field, e) {
        let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
        this.refs[field].innerHTML = '';
        var _val = "";
        if (isNaN(val)) {
            val = _val;
            this.refs[field].innerHTML = '只能输入数字!';
            setTimeout(function () {
                this.refs[field].innerHTML = '';
            }.bind(this), 1000);
        } else {
            val = val.replace(/\s+/g, '');
            var reg = new RegExp(/[0-9]/g)
            if (!reg.test(val)) {
                _val = val;
            }
        }
        this.store.currency[field] = val;
        if (field == 'pricedigit') {
            this.setState(Object.assign(this.state.validation, {pricedigit: null}))
        }
        else {
            this.setState(Object.assign(this.state.validation, {moneydigit: null}))
        }
    }

    // 改变进位规则
    changeRule(field, value) {
        this.store.currency[field] = value;
    }

    // 卡片展示
    show(param) {
        let {index, flag} = param;
        this.setState({
            flag, index: index, validation: {
                pricedigit: null,
                moneydigit: null
            }
        })
    }

    // 前端转换规则
    handleRule(param) {
        switch (param) {
            case 0:
                return param = '全部舍位';
                break;
            case 1:
                return param = '全部进位';
                break;
            default:
                return param = '四舍五入';
        }
    }

    // 保存提交
    handleSubmit() {
        if (this.state.flag == 'add') {
            // 币种数据校验
            for (var i = 0, len = this.store.ListData.length; i < len; i++) {
                var val = this.store.currency.code;
                if (this.store.ListData[i].code == val) {
                    this.refs.message.innerHTML = "币种已存在！";
                    return false;
                }
            }
        }

        if (this.store.currency.code == '') {
            this.refs.message.innerHTML = '币种不能为空！';
        }
        if (this.store.currency.pricedigit == '') {
            this.refs.pricedigit.innerHTML = '单价精度不能为空！';
            this.setState(Object.assign(this.state.validation, {pricedigit: 'error'}))
        }
        if (this.store.currency.moneydigit == '') {
            this.refs.moneydigit.innerHTML = '金额精度不能为空！';
            this.setState(Object.assign(this.state.validation, {moneydigit: 'error'}))
        }
        if (this.store.currency.moneydigit == '' || this.store.currency.pricedigit == '' || this.store.currency.code == '') {
            return false;
        }


        this.store.handleSubmit(this.state.flag)
            .then(data => {
                if (data.status) {
                    GlobalStore.showInfo("保存成功");
                    this.store.getCurrencyLst();
                    this.close();
                } else {
                    GlobalStore.showError(data.msg)
                }
            });
    }


    // 币种参照的code name展示
    _renderMenuItemChildren(option, props, index) {
        return [
            <span key="code">
        {option.label + " "}
      </span>,
            <strong key="name">{option.value} </strong>
        ];
    }





    updateValue (newValue) {
        console.log(newValue)
        this.setState({
            selectValue: newValue,
        });
        Object.assign(this.store.currency, {id: newValue.id, code: newValue.label,name: newValue.value,sign:newValue.sign})
    }


    render() {
        let currency = this.store.currency;
        const filterByFields = ['name', 'code'];

        return (
            <div className="ledger">
                <div className="head">
                    <div className="head-r fr">
                        <button className="btn btn-default mr15" onClick={this.close.bind(this)}>取消</button>
                        <button className="btn btn-primary" onClick={this.handleSubmit.bind(this)}>保存</button>
                    </div>
                </div>
                <div className="currency-content container-fluid">
                    <div className="currency-title">
                        {title[this.state.flag]}
                    </div>
                    <Form inline className="currency-form">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="code">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    <span className="currency-bishu">*</span>币种:
                                </Col>
                                <Col xs={6}>
                                    <div className="pr" style={{'width':'260px'}}>
                                        {
                                            (this.state.flag === 'edit') ?
                                                <Refers
                                                    className="currency-ref"
                                                    filterBy={filterByFields}
                                                    labelKey="code"
                                                    emptyLabel="暂无数据"
                                                    onChange={this.changeCurrency.bind(this)}
                                                    placeholder="请选择..."
                                                    referConditions={{"refCode":" ","refType":"list","displayFields":["code","name"]}}
                                                    referDataUrl={'http://127.0.0.1/webCurrency/getRefData'}
                                                    referType="list"
                                                    ref={ref => this._currency = ref}
                                                    selected={[currency]}
                                                    disabled={true}
                                                    renderMenuItemChildren={this._renderMenuItemChildren.bind(this)}
                                                /> :
                                                <Select
                                                    className="currency-ref"
                                                    placeholder="请选择..."
                                                    name="form-field-name"
                                                    value={this.state.selectValue}
                                                    onChange={this.updateValue.bind(this)}
                                                    options={this.store.refJsonData}
                                                    clearable='false'
                                                    optionRenderer={this._renderMenuItemChildren.bind(this)}
                                                />
                                        }
                                        <div ref="message" className="currency-error"></div>
                                        {/*
                                         * <Refers
                                         className="currency-ref"
                                         filterBy={filterByFields}
                                         labelKey="code"
                                         emptyLabel="暂无数据"
                                         onChange={this.changeCurrency.bind(this)}
                                         placeholder="请选择..."
                                         referConditions={{"refCode":" ","refType":"list","displayFields":["code","name"]}}
                                         referDataUrl={'http://127.0.0.1/webCurrency/getRefData'}
                                         referType="list"
                                         ref={ref => this._currency = ref}
                                         selected={[currency]}
                                         renderMenuItemChildren={this._renderMenuItemChildren.bind(this)}
                                         optionRenderer={this._renderMenuItemChildren.bind(this)}
                                         />*/}
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="category">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    币种简称:
                                </Col>
                                <Col xs={6}>
                                    <FormControl type="text" placeholder="币种简称"
                                                 value={currency.name}
                                                 disabled={true}
                                                 style={{'width':'260px'}}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form">
                        <Col xs={6} style={{'display': 'block'}}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="category">
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    币种符号:
                                </Col>
                                <Col xs={6}>
                                    <FormControl type="text" placeholder=" 币种符号"
                                                 value={currency.sign}
                                                 disabled={true}
                                                 style={{'width':'260px'}}
                                    />
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form currency-border clearfix">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="pricedigit"
                                       validationState={this.state.validation.pricedigit}>
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    <span className="currency-bishu">*</span>单价精度:
                                </Col>
                                <Col xs={6}>
                                    <div className="pr" style={{'width':'260px'}}>
                                        <input type="text"
                                               placeholder="单价精度"
                                               value={currency.pricedigit}
                                               className="form-control"
                                               autoComplete="off"
                                               onChange={this.handleChange.bind(this, "pricedigit")}
                                               style={{'width':'260px'}}
                                               maxLength="1"
                                        />
                                        <div ref="pricedigit" style={{'right':'-120px'}}
                                             className="currency-error"></div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="pricerount">
                                <Col xs={3} componentClass={ControlLabel} className="text-right currency-lh">
                                    单价进价:
                                </Col>
                                <Col xs={6}>
                                    <TinperSelect
                                        className="pricerount-select"
                                        defaultValue={this.handleRule(currency.pricerount)}
                                        onChange={this.changeRule.bind(this, "pricerount")}
                                    >
                                        {this.store.pricerounts.map((item, index)=> {
                                            return (<Option key={ 'pricerount' + index }
                                                            value={item.price}>{item.name}</Option>)
                                        })}
                                    </TinperSelect>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="moneydigit"
                                       validationState={this.state.validation.moneydigit}>
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    <span className="currency-bishu">*</span>金额精度:
                                </Col>
                                <Col xs={6}>
                                    <div className="pr" style={{'width':'260px'}}>
                                        <input type="text"
                                               placeholder="金额精度"
                                               value={currency.moneydigit}
                                               className="form-control"
                                               autoComplete="off"
                                               onChange={this.handleChange.bind(this, "moneydigit")}
                                               style={{'width':'260px'}}
                                               maxLength="1"
                                        />
                                        <div ref="moneydigit" style={{'right':'-120px'}}
                                             className="currency-error"></div>
                                    </div>
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="moneyrount">
                                <Col xs={3} componentClass={ControlLabel} className="text-right currency-lh">
                                    金额进价:
                                </Col>
                                <Col xs={6}>
                                    <TinperSelect
                                        className="pricerount-select"
                                        defaultValue={this.handleRule(currency.moneyrount)}
                                        onChange={this.changeRule.bind(this, "moneyrount")}
                                    >
                                        {this.store.pricerounts.map((item, index)=> {
                                            return (<Option key={ 'moneyrount' + index }
                                                            value={item.price}>{item.name}</Option>)
                                        })}
                                    </TinperSelect>
                                </Col>
                            </FormGroup>
                        </Col>
                    </Form>

                    <Form inline className="currency-form">
                        <Col xs={6}>
                            <FormGroup style={{"width":'100%','marginBottom': '15px'}} controlId="pricedigit"
                                       validationState={this.state.validation.pricedigit}>
                                <Col xs={6} componentClass={ControlLabel} className="text-right currency-lh">
                                    备注:
                                </Col>
                            </FormGroup>
                        </Col>
                        <Col xs={6} className="col-xs-pull-3">
                            <FormControl style={{'width':'100%'}} onChange={this.handleChange.bind(this, "description")}
                                         value={currency.description}
                                         componentClass="textarea"
                            />
                        </Col>
                    </Form>

                </div>
            </div>
        );
    }
}
