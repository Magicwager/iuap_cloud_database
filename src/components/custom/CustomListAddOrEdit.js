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
      makeTime:moment(),
      clearable: false,
      searchable: false,
      selectOneValue: this.store.datatypeVale,
    }

    //this.handleChange = this.handleChange.bind(this);
    this.close = this.close.bind(this)
    this.onSubmit = this.onSubmit.bind(this);
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
  handleChangeDate(param, date) {
    if(param=='startData') {
      this.setState({
        startDate: date
      });
      this.store.custom.creationtime = date;
    }

    if(param=='endData') {
      this.setState({
        endDate: date
      });
      this.store.custom.modifiedtime = date;
    }

  }

  setChangeData = (field, value) => {
    if (field == "maketime") {
      let formattedValue = moment(value).format("YYYY-MM-DD HH:mm:ss");
      this.setState({makeTime:value});
      this.voucherEditStore.changeSaveData(field,formattedValue)
    } else{
      value = value.target.value;
      this.voucherEditStore.changeSaveData(field,value)
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

  // 输入框变化事件
  handleChange(field, e) {
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    this.store.custom[field] = val;
  }

  // 保存
  onSubmit(event) {
    event.preventDefault();
    this.store.handleSubmit(this.state.flag)
      .then(data =>{
        if (data.status) {
          GlobalStore.showInfo("保存成功");
          if(this.state.page == 'add') {
            this.props.handlePagination(1, event);
          } else {
            this.props.handlePagination(this.store.activePageSize, event);
          }
          this.close();
        } else {
          GlobalStore.showError("保存失败");
        }
      });
  }


  render() {
    let custom = this.store.custom;

    return (
      <div className="u-container">
        <div className="head">
          <div className="head-r fr">
            <button className="btn btn-default mr15" onClick={this.close}>取消</button>
            <button className="btn btn-primary" onClick={this.onSubmit}>保存</button>
          </div>
        </div>
        <div className="currency-content container-fluid" style={{'paddingBottom': '160px'}}>
          <div className="currency-title">
            {title[this.state.flag]}
          </div>
          <Form inline className="currency-form">
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="name">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} >
                  名称：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="名称" value={custom.name} onChange={this.handleChange.bind(this, 'name')}/>
                </Col>
              </FormGroup>
            </Col>
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="attrlength">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} >
                  输入长度：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="输入长度" value={custom.attrlength} onChange={this.handleChange.bind(this, 'attrlength')}/>
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="type">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} >
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
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="attrprecision">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} >
                  精度：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="精度" value={custom.attrprecision} onChange={this.handleChange.bind(this, 'attrprecision')}/>
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form" style={{'borderBottom': '1px dashed #E4E4E4','paddingBottom': '60px'}}>
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="doctype">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} >
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
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="creator">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4}>
                  创建人：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="创建人" value={custom.creator} onChange={this.handleChange.bind(this, 'creator')}/>
                </Col>
              </FormGroup>
            </Col>
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="modifier">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} >
                  最后修改人：
                </Col>
                <Col md={6}>
                  <FormControl className="currency-ref" type="text" placeholder="最后修改人" value={custom.modifier}  onChange={this.handleChange.bind(this, 'modifier')}/>
                </Col>
              </FormGroup>
            </Col>
          </Form>

          <Form inline className="currency-form">
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="formInlineName">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} mdOffset={1} sm={4} >
                  创建时间：
                </Col>
                <Col md={6}>
                  <div className="v-table-inputdate">
                    <DatePicker
                      minDate={this.state.startDate}
                      selected={this.state.makeTime}
                      selected={this.state.startDate}
                      onChange={this.handleChangeDate.bind(this, 'startData')}
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
            <Col md={6} sm={12}>
              <FormGroup className="custom-formgroup" controlId="formInlineEmail">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={4} sm={4} >
                  最后修改时间：
                </Col>
                <Col md={6}>
                  <div className="v-table-inputdate">
                    <DatePicker
                      selected={this.state.endDate}
                      onChange={this.handleChangeDate.bind(this, 'endData')}
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
