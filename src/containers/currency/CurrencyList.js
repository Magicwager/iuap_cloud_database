/*
 * 币种卡片
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import {observer} from 'mobx-react';

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
            currency: {},
            ulList: [],  //
            value: '',
            index: -1,
            validation: {
                pricedigit: null,
                moneydigit: null
            }
        }
    }

    componentDidMount() {
        this.store.getRefData()
    }

    // 取消
    close() {
        this.store.page = 1;
        //Object.assign(this.store.currency, {code:'',name:'',sign:'',pricedigit:6,moneydigit:2,pricerount:5,moneyrount:5,description:'',isdefault:0})
    }

    // 币种参照
    changeCurrency(select) {
        if (select.length <= 0)
            return
        let value = select[0];
        //this.setState({ulList: select})
        Object.assign(this.store.currency, value);
        //Object.assign(this.store.currency, {id: value.id, name: value.name, code: value.code, sign: value.sign});
        this.refs.message.innerHTML = " ";
        console.log(444, value)
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
        /*保存上次的值*/
        if (isNaN(val)) {
            val = _val;
            this.refs[field].innerHTML = '只能输入数字!';
            setTimeout(function () {
                this.refs[field].innerHTML = '';
            }.bind(this), 1000);
        } else {
            val = val.replace(/\s+/g, '');
            _val = val;
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
    changeRule(field, e) {
        let value = e.target.value;
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
        {option.code + " "}
      </span>,
            <strong key="name">{option.name} </strong>
        ];
    }

    _handleBlur( ) {

        let _this = this;
        let val = _this._currency.getInstance().getInputTextValue();
        this.store.refJsonData.map((value, index) => {
            if (value.code != val) {
                Object.assign(this.store.currency, {id: '', name: '', code: '', sign: ''});
                _this._currency.getInstance()._handleTextChange('');
                _this._currency.getInstance()._hideDropdown();
                console.log(456)
            }
        })


        // let _this = this;

        // let op = this.store.refJsonData.filter((item, index) => {
        //     if (item == select[0]) {
        //         return true;
        //     }
        // })
        // setTimeout(function () {
        //     if(_this.state.ulList.length>0&&op.length == 0){
        //         _this._currency.getInstance().clear();
        //     }
        // }, 3000)

        //   let val = e.target.value;
        //   this.store.refJsonData.map((value,index) => {
        //       if(value.code !== val ) {
        //           Object.assign(this.store.currency, {id: '', name: '', code: '', sign: ''});
        //
        //       }
        //   })
        //$('.currency-ref .dropdown-menu').hide()
        // console.log(this._currency.getInstance())
        // console.log(this._currency.getInstance()._handleTextChange(''))
        // console.log(this._currency.getInstance()._handleBlur())
        // console.log(this._currency.getInstance().handleClickOutside())
        //$('.currency-ref').find('input.form-control.bootstrap-typeahead-input-main').val(' ')
        //console.log($('.currency-ref').find('input.form-control.bootstrap-typeahead-input-main').val());
        //console.log(22, JSON.stringify(this._currency.getInstance().getInputTextValue())); //获取输入框里当前输入的值
        //console.log(33, JSON.stringify(this._currency.getInstance().clear())); //清除
        //console.log(44, JSON.stringify(this._currency.getInstance().hideRefers)); //显示参照
    }

    render() {
        let currency = this.store.currency;
        const filterByFields = ['name', 'code'];

        //let ul = [currency];

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
                                                    onBlur={this._handleBlur.bind(this)}
                                                    onChange={this.changeCurrency.bind(this)}
                                                    placeholder="请选择..."
                                                    referConditions={{"refCode":" ","refType":"list","displayFields":["code","name"]}}
                                                    referDataUrl={'http://127.0.0.1/webCurrency/getRefData'}
                                                    referType="list"
                                                    ref={ref => this._currency = ref}
                                                    //defaultSelected={[currency]}
                                                    selected={[currency]}
                                                    disabled={true}
                                                    renderMenuItemChildren={this._renderMenuItemChildren.bind(this)}
                                                />
                                                :
                                                <Refers
                                                    className="currency-ref"
                                                    filterBy={filterByFields}
                                                    labelKey="code"
                                                    emptyLabel="暂无数据"
                                                    onBlur={this._handleBlur.bind(this)}
                                                    onChange={this.changeCurrency.bind(this)}
                                                    placeholder="请选择..."
                                                    referConditions={{"refCode":" ","refType":"list","displayFields":["code","name"]}}
                                                    referDataUrl={'http://127.0.0.1/webCurrency/getRefData'}
                                                    referType="list"
                                                    ref={ref => this._currency = ref}
                                                    //defaultSelected={[currency]}
                                                    selected={[currency]}
                                                    renderMenuItemChildren={this._renderMenuItemChildren.bind(this)}
                                                />
                                        }
                                        <div ref="message" className="currency-error"></div>
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
                                    <div className="pricerount-select">
                                        <select defaultValue={currency.pricerount} value={currency.pricerount}
                                                onChange={this.changeRule.bind(this, "pricerount")}>
                                            {this.store.pricerounts.map((item, index)=> {
                                                return (<option key={ 'pricerount' + index }
                                                                value={item.price}>{item.name}</option>)
                                            })}
                                        </select>
                                        <i className="cl cl-arrow-down select-i"></i>
                                    </div>
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
                                    <div className="pricerount-select">
                                        <select defaultValue={currency.moneyrount} value={currency.moneyrount}
                                                onChange={this.changeRule.bind(this, "moneyrount")}>
                                            {this.store.pricerounts.map((item, index)=> {
                                                return (<option key={ 'moneyrount' + index }
                                                                value={item.price}>{item.name}</option>)
                                            })}
                                        </select>
                                        <i className="cl cl-arrow-down select-i"></i>
                                    </div>

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
