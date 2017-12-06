/*
* 币种卡片
* dangwei@yonyou.com
*/
import React, { Component, PropTypes } from 'react';
import { Modal, Form , FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import { observer } from 'mobx-react';

import { Refers } from 'ssc-refer';
import GlobalStore from '../../stores/GlobalStore';
import Config from '../../config';

let title = {'add': '添加新数据', 'edit': '编辑'}

@observer
export default class CurrencyCard extends Component {
  static propTypes = {
    store: PropTypes.object
  }
  constructor(props) {
    super(props)
    this.store = props.store;
    this.state = {
      show : false,
      currency: {},
      value: '',
      index: -1,
      validation: {
        pricedigit: null,
        moneydigit: null
      }
    }

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  componentDidMount() {
  }

  // 卡片展示
  show(param) {
    let { index, flag } = param;
    this.setState({flag, show: true, index: index, validation: {
      pricedigit: null,
      moneydigit: null
    }})
  }

  // 卡片关闭
  close() {
    this.setState({show: false})
  }

  // 文本框改变
  handleChange(field, e) {
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    this.refs[field].innerHTML= '';
    var _val = ""; /*保存上次的值*/
    if(isNaN(val)){
      val = _val;
      this.refs[field].innerHTML= '只能输入数字!';
      setTimeout(function(){
        this.refs[field].innerHTML= '';
      }.bind(this),1000);
    }else{
      val=val.replace(/\s+/g,'');
      _val = val;
    }
    this.store.currency[field] = val;

    if(field == 'pricedigit') {
      this.setState(Object.assign(this.state.validation, {pricedigit: null}))
    }
    else {
      this.setState(Object.assign(this.state.validation, {moneydigit: null}))
    }
  }
  
  // 保存提交
  handleSubmit() {

    if(this.state.flag == 'add') {
      // 币种数据校验
      for(var i = 0,len = this.store.ListData.length;i < len ; i++ ) {
        var val = this.store.currency.code;
        if(this.store.ListData[i].code == val) {
          this.refs.message.innerHTML = "币种已存在！";
          return false;
        }
      }
    }

    if(this.store.currency.code == '') {
      this.refs.message.innerHTML = '币种不能为空！';
    }
    if(this.store.currency.pricedigit == '') {
      this.refs.pricedigit.innerHTML = '单价精度不能为空！';
      this.setState(Object.assign(this.state.validation, {pricedigit: 'error'}))
    }
    if(this.store.currency.moneydigit == '') {
      this.refs.moneydigit.innerHTML = '金额精度不能为空！';
      this.setState(Object.assign(this.state.validation, {moneydigit: 'error'}))
    }
    if(this.store.currency.moneydigit == '' || this.store.currency.pricedigit == '' || this.store.currency.code == '' ) {
      return false;
    }

    
    this.store.handleSubmit(this.state.flag)
      .then(data => {
        if(data.status) {
          GlobalStore.showInfo("保存成功")
          this.store.getCurrencyLst();
          this.close();
        }else{
          GlobalStore.showError(data.msg)
        }
      });

  }

  // 币种参照
  changeCurrency(select) {
    if(select.length<=0)
      return
    let value = select[0];
    Object.assign(this.store.currency, {id:value.id, name:value.name, code:value.code, sign:value.sign});
    this.refs.message.innerHTML = " ";

    // 数据校验
    this.store.ListData.map((value, index) => {
      let val = this.store.currency.code;
      if(value.code == val) {
        this.refs.message.innerHTML = "币种已存在！";
        return;
      }
    });
  }

  // 改变进位规则
  changeRule(field, e) {
    let value = e.target.value;
    this.store.currency[field] = value;
  }

  // 币种参照的code name展示
  _renderMenuItemChildren(option, props, index) {
    return [
      <span key="code">
        {option.code+" "}
      </span>,
      <strong key="name">{option.name} </strong>
    ];
  }

  render() {
    let currency = this.store.currency;
    const filterByFields = ['name', 'code'];

    return (
      <div>
        <Modal {...this.props} show={this.state.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title> {title[this.state.flag]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup controlId="code">
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  <span className="currency-bishu">*</span>币种
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'edit') ?
                      <Refers
                      className="noprint"
                      filterBy={filterByFields}
                      labelKey="code"
                      emptyLabel=""
                      onChange={this.changeCurrency.bind(this)}
                      placeholder="请选择..."
                      referConditions={{"refCode":" ","refType":"list","displayFields":["code","name"]}}
                      referDataUrl={Config.currency.currencyRef}
                      referType="list"
                      ref={"ref-currency"}
                      defaultSelected={[currency]}
                      disabled={true}
                      renderMenuItemChildren={this._renderMenuItemChildren.bind(this)}
                    />
                      :
                      <Refers
                        className="noprint"
                        filterBy={filterByFields}
                        labelKey="code"
                        emptyLabel=""
                        onChange={this.changeCurrency.bind(this)}
                        placeholder="请选择..."
                        referConditions={{"refCode":" ","refType":"list","displayFields":["code","name"]}}
                        referDataUrl={Config.currency.currencyRef}
                        referType="list"
                        ref={"ref-currency"}
                        defaultSelected={[currency]}
                        renderMenuItemChildren={this._renderMenuItemChildren.bind(this)}
                      />
                  }
                </Col>
                <Col sm={3}>
                  <div ref="message" className="currency-error"></div>
                </Col>
              </FormGroup>
              <FormGroup controlId="category">
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  币种简称
                </Col>
                <Col sm={6}>
                  <FormControl type="text" placeholder="币种简称"
                               value={currency.name}
                               disabled={true}
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="sign">
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  币种符号
                </Col>
                <Col sm={6}>
                  <FormControl type="text" placeholder="币种符号"
                               value={currency.sign}
                               disabled={true}
                  />
                </Col>
              </FormGroup>
              <FormGroup controlId="pricedigit" validationState={this.state.validation.pricedigit}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  <span className="currency-bishu">*</span>单价精度
                </Col>
                <Col sm={6}>
                  <input type="text"
                         placeholder="单价精度"
                         value={currency.pricedigit}
                         className="form-control"
                         autocomplete="off"
                         onChange={this.handleChange.bind(this, "pricedigit")}
                  />
                </Col>
                <Col sm={3}>
                  <div ref="pricedigit" className="currency-error"></div>
                </Col>
              </FormGroup>
              <FormGroup controlId="moneydigit" validationState={this.state.validation.moneydigit}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  <span className="currency-bishu">*</span>金额精度
                </Col>
                <Col sm={6}>
                  <input type="text"
                         placeholder="金额精度"
                         value={currency.moneydigit}
                         className="form-control"
                         autocomplete="off"
                         onChange={this.handleChange.bind(this, "moneydigit")}
                  />
                </Col>
                <Col sm={3}>
                  <div ref="moneydigit" className="currency-error"></div>
                </Col>
              </FormGroup>
              <FormGroup controlId="pricerount">
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  单价进价
                </Col>
                <Col sm={6}>
                  <select className="pricerount-select noprint" defaultValue={currency.pricerount} value={currency.pricerount} onChange={this.changeRule.bind(this, "pricerount")}>
                    {this.store.pricerounts.map((item,index)=>{
                      return(<option key={ 'pricerount' + index } value={item.price}>{item.name}</option>)
                    })}
                  </select>
                </Col>
              </FormGroup>
              <FormGroup controlId="moneyrount">
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  金额进价
                </Col>
                <Col sm={6}>
                  <select className="pricerount-select noprint" defaultValue={currency.moneyrount} value={currency.moneyrount} onChange={this.changeRule.bind(this, "moneyrount")}>
                    {this.store.pricerounts.map((item,index)=>{
                      return(<option key={ 'moneyrount' + index } value={item.price}>{item.name}</option>)
                    })}
                  </select>
                </Col>
              </FormGroup>
              <FormGroup>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  备注
                </Col>
                <Col sm={6}>
                  <FormControl onChange={this.handleChange.bind(this, "description")}
                               value={currency.description}
                               componentClass="textarea"
                  />
                  <FormControl.Feedback />
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-right">
              <Button className="mr15" onClick={this.close}>取消</Button>
              <Button className="primary mr20" bsStyle="primary" onClick={this.handleSubmit.bind(this)}>保存</Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
