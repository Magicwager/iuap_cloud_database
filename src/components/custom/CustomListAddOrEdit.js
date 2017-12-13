/*
 * 定义自定义项 新增、编辑组件
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import DatePicker  from "react-datepicker";
import moment from 'moment';
import Select from 'react-select';
import 'react-select/dist/react-select.css';

import GlobalStore from '../../stores/GlobalStore';

let title = {'add': '添加自定义', 'edit': '编辑自定义'}



@observer
class CustomListAddOrEdit extends Component {
  constructor(props) {
    super(props)
    this.store = props.store;
    this.state = {
      value: '',
      index: -1,
      validation: {
        pricedigit: null,
        moneydigit: null
      },
      startDate: moment(),  // 创建时间
      endDate: moment(),    // 最后修改时间
      clearable: false,
      searchable: false,
      selectOneValue: this.store.datatypeVale,
    }

    this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this);
  }

  // 展示
  show(param) {
    let {index, flag} = param;
    this.setState({
      flag, index: index, validation: {
        pricedigit: null,
        moneydigit: null
      }
    })
  }

  // 日期事件
  handleChange(param, date) {
    if(param=='startData') {
      this.setState({
        startDate: date
      });
    }

    if(param=='endData') {
      this.setState({
        endDate: date
      });
    }
  }

  // 取消
  close() {
    this.store.page = 1;
  }

  // 单价、金额枚举
  updateChangeValue(field, value) {
    //this.store.currency[field] = Number(value.price);
    if(field=='pricerount') {
      this.setState({selectOneValue:value})
    }
    if(field=='moneyrount') {
      this.setState({selectTwoValue:value})
    }
  }


  render() {
    return (
      <div className="u-container">
        <div className="head">
          <div className="head-r fr">
            <button className="btn btn-default mr15" onClick={this.close}>取消</button>
            <button className="btn btn-primary">保存</button>
          </div>
        </div>
        <div className="currency-content container-fluid" style={{'paddingBottom': '160px'}}>
          <div className="currency-title">
            {title[this.state.flag]}
          </div>
          <Form inline className="currency-form">
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={2}>
                  名称：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="名称"/>
                </Col>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineEmail">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4}>
                  输入长度：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="输入长度"/>
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={2}>
                  数据类型：
                </Col>
                <Col md={6}>
                  <Select
                    className="currency-ref"
                    name="form-field-name"
                    value={this.state.selectOneValue}
                    onChange={this.updateChangeValue.bind(this, 'pricerount')}
                    options={this.store.dataTypes}
                    clearable={this.state.clearable}
                    searchable={this.state.searchable}
                    valueKey="code"
                    labelKey="name"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineEmail">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4}>
                  精度：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="精度"/>
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form" style={{'borderBottom': '1px dashed #E4E4E4','paddingBottom': '60px'}}>
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={2}>
                  引用档案：
                </Col>
                <Col md={6}>
                  <Select
                    className="currency-ref"
                    name="form-field-name"
                    value={this.state.selectOneValue}
                    onChange={this.updateChangeValue.bind(this, 'pricerount')}
                    options={this.store.dataTypes}
                    clearable={this.state.clearable}
                    searchable={this.state.searchable}
                    valueKey="code"
                    labelKey="name"
                  />
                </Col>
              </FormGroup>
            </Col>
            <Col md={6}>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={2}>
                  创建人：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="创建人"/>
                </Col>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineEmail">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4}>
                  最后修改人：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="最后修改人"/>
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={2}>
                  创建时间：
                </Col>
                <Col md={6}>
                  <div className="v-table-inputdate">
                    <DatePicker
                      selected={this.state.startDate}
                      onChange={this.handleChange.bind(this, 'startData')}
                      locale="zh-CN"
                      dateFormat="YYYY-MM-DD"
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      todayButton={"今天"}
                      className="form-control currency-ref"
                      readOnly="readOnly"
                    />
                  </div>
                </Col>
              </FormGroup>
            </Col>
            <Col md={6}>
              <FormGroup className="custom-formgroup" controlId="formInlineEmail">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4}>
                  最后修改时间：
                </Col>
                <Col md={6}>
                  <div className="v-table-inputdate">
                    <DatePicker
                      selected={this.state.endDate}
                      onChange={this.handleChange.bind(this, 'endData')}
                      locale="zh-CN"
                      dateFormat="YYYY-MM-DD"
                      peekNextMonth
                      showYearDropdown
                      showMonthDropdown
                      todayButton={"今天"}
                      className="form-control currency-ref"
                      readOnly="readOnly"
                    />
                  </div>
                </Col>
              </FormGroup>
            </Col>
          </Form>

        </div>
      </div>
    )
  }
}

export default CustomListAddOrEdit;
