/*
* 币种卡片
* dangwei@yonyou.com
*/
import React, { Component, PropTypes } from 'react';
import { Modal, Form , FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import { observer } from 'mobx-react';

//import { Refers } from 'ssc-refer';
import GlobalStore from '../../stores/GlobalStore';

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
      index: -1,
      validation: {
        name: null,
        code: null,
        sign: null,
        pricedigit: null,
        moneydigit: null,
        pricerount: null,
        moneyrount: null
      }
    }

    this.show = this.show.bind(this);
    this.close = this.close.bind(this);
  }

  // 卡片展示
  show(param) {
    let { index, flag } = param;
    this.setState({flag, show: true, index: index, validation: {
      name: null,
      code: null,
      sign: null,
      pricedigit: null,
      moneydigit: null,
      pricerount: null,
      moneyrount: null
    }})
  }

  // 卡片关闭
  close() {
    this.setState({show: false})
  }

  // 文本框改变
  handleChange(field, e) {
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    this.store.currency[field] = val;
    if(field !== 'description') {
      this.doValidate(field, val);
    }
  }

  doValidate(field){
    let validate = null
    let val = this.store.currency[field];
    switch (field){
      case 'code':
      case 'name':
      case 'sign':
      case 'pricedigit':
      case 'moneydigit':
      case 'pricerount':
      case 'moneyrount':
        val = $.trim(val)
        break
      default:
        validate = null
        break
    }
    validate = val === '' ? 'error' : 'success'
    this.setState(Object.assign(this.state.validation, {[field]: validate}))
  }

  // 保存提交
  handleSubmit() {
    Object.keys(this.state.validation).forEach((item) => this.doValidate(item))
    let flag = Object.keys(this.state.validation).every((item, index) =>
    this.state.validation[item] === 'success')
    if(!flag)
      return
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


  render() {
    let currency = this.store.currency;

    return (
      <div>
        <Modal {...this.props} show={this.state.show} onHide={this.close}>
          <Modal.Header closeButton>
            <Modal.Title> {title[this.state.flag]}</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form horizontal>
              <FormGroup controlId="code" validationState={this.state.validation.code}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  币种
                </Col>
                <Col sm={6}>
                {
                     (this.state.flag === 'detail') ?
                     <FormControl type="text" placeholder="币种"
                     value={currency.code}
                     onChange={this.handleChange.bind(this, "code")}
                     onBlur={this.doValidate.bind(this, 'code')}
                     readOnly={true}
                     />    :
                     <FormControl type="text" placeholder="币种"
                     value={currency.code}
                     onChange={this.handleChange.bind(this, "code")}
                     onBlur={this.doValidate.bind(this, 'code')}
                     />
                     }

                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup controlId="category" validationState={this.state.validation.name} >
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  币种简称
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl type="text" placeholder="币种简称"
                                   value={currency.name}
                                   onChange={this.handleChange.bind(this, "name")}
                                   onBlur={this.doValidate.bind(this, 'name')}
                                   readOnly={true}
                      /> :
                      <FormControl type="text" placeholder="币种简称"
                                   value={currency.name}
                                   onChange={this.handleChange.bind(this, "name")}
                                   onBlur={this.doValidate.bind(this, 'name')}
                      />
                  }
                  
                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup controlId="symbol" validationState={this.state.validation.sign}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  币种符号
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl type="text" placeholder="币种符号"
                                   value={currency.sign}
                                   onChange={this.handleChange.bind(this, "sign")}
                                   onBlur={this.doValidate.bind(this, 'sign')}
                                   readOnly={true}
                      /> :
                      <FormControl type="text" placeholder="币种符号"
                                   value={currency.sign}
                                   onChange={this.handleChange.bind(this, "sign")}
                                   onBlur={this.doValidate.bind(this, 'sign')}
                      />
                  }
                  
                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup controlId="code" validationState={this.state.validation.pricedigit}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  单价精度
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl type="text" placeholder="单价精度"
                                   value={currency.pricedigit}
                                   onChange={this.handleChange.bind(this, "pricedigit")}
                                   onBlur={this.doValidate.bind(this, 'pricedigit')}
                                   readOnly={true}
                      />    :
                      <FormControl type="text" placeholder="单价精度"
                                   value={currency.pricedigit}
                                   onChange={this.handleChange.bind(this, "pricedigit")}
                                   onBlur={this.doValidate.bind(this, 'pricedigit')}
                      />
                  }

                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup controlId="code" validationState={this.state.validation.moneydigit}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  金额精度
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl type="text" placeholder="金额精度"
                                   value={currency.moneydigit}
                                   onChange={this.handleChange.bind(this, "moneydigit")}
                                   onBlur={this.doValidate.bind(this, 'moneydigit')}
                                   readOnly={true}
                      />    :
                      <FormControl type="text" placeholder="金额精度"
                                   value={currency.moneydigit}
                                   onChange={this.handleChange.bind(this, "moneydigit")}
                                   onBlur={this.doValidate.bind(this, 'moneydigit')}
                      />
                  }

                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup controlId="code" validationState={this.state.validation.pricerount}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  单位进价
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl type="text" placeholder="单位进价"
                                   value={currency.pricerount}
                                   onChange={this.handleChange.bind(this, "pricerount")}
                                   onBlur={this.doValidate.bind(this, 'pricerount')}
                                   readOnly={true}
                      />    :
                      <FormControl type="text" placeholder="单位进价"
                                   value={currency.pricerount}
                                   onChange={this.handleChange.bind(this, "pricerount")}
                                   onBlur={this.doValidate.bind(this, 'pricerount')}
                      />
                  }

                  <FormControl.Feedback />
                </Col>
              </FormGroup>
              <FormGroup controlId="code" validationState={this.state.validation.moneyrount}>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  金额进价
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl type="text" placeholder="金额进价"
                                   value={currency.moneyrount}
                                   onChange={this.handleChange.bind(this, "moneyrount")}
                                   onBlur={this.doValidate.bind(this, 'moneyrount')}
                                   readOnly={true}
                      />    :
                      <FormControl type="text" placeholder="金额进价"
                                   value={currency.moneyrount}
                                   onChange={this.handleChange.bind(this, "moneyrount")}
                                   onBlur={this.doValidate.bind(this, 'moneyrount')}
                      />
                  }

                  <FormControl.Feedback />
                </Col>
              </FormGroup>


              <FormGroup>
                <Col sm={2} componentClass={ControlLabel} smOffset={1}>
                  备注
                </Col>
                <Col sm={6}>
                  {
                    (this.state.flag === 'detail') ?
                      <FormControl onChange={this.handleChange.bind(this, "description")}
                                   value={currency.description}
                                   componentClass="textarea" readOnly={true}
                      /> :
                      <FormControl onChange={this.handleChange.bind(this, "description")}
                                   value={currency.description}
                                   componentClass="textarea"
                      />
                  }

                  <FormControl.Feedback />
                </Col>
              </FormGroup>
            </Form>
            <FormGroup>
              <Col sm={6} smOffset={3}>
                <div ref="message" style={{color: 'red'}}></div>
              </Col>
            </FormGroup>
          </Modal.Body>
          <Modal.Footer>
            <div className="pull-right">
              <Button className="mr15" onClick={this.close}>取消</Button>
              <Button className="primary mr20" bsStyle="primary" onClick={this.handleSubmit.bind(this)}>添加</Button>
            </div>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}
