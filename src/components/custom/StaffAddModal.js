/*
 * 定义自定义项 查看更多弹框组件
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';

import GlobalStore from '../../stores/GlobalStore';
import CustomStore from '../../stores/custom/CustomStore';

@observer
class StaffAddModal extends Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {
      isShow: false,
      viewMoreData: []
    }

    this.close = this.close.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  // 打开
  show(param) {
    this.setState({
      isShow: true,
      viewMoreData: param.param
    });
    this.store.staffViewSaveData.parentid = this.props.id;
  }

  // 关闭
  close() {
    this.setState({
      isShow: false
    });
    Object.assign(this.store.staffViewSaveData, {'parentid':'','name':'','doctype':''});
  }

  handleChange(field, e) {
    let val = e.target.type == 'checkbox' ? e.target.checked : e.target.value;
    this.refs[field].innerHTML = '';
    this.store.staffViewSaveData[field] = val;
  }

  // 保存
  onSubmit(event) {
    event.preventDefault();

    if(this.store.staffViewSaveData.name=='') {
      this.refs.name.innerHTML = "档案名称不能为空！";
      return false;
    }

    if(this.store.staffViewSaveData.doctype=='') {
      this.refs.doctype.innerHTML = "档案编码不能为空！";
      return false;
    }

    // 校验
    let queryViewMore = this.props.queryViewMoreData.slice();
    for (var i = 0, len = queryViewMore.length; i < len; i++) {
      var val = this.store.staffViewSaveData.name;
      var type =  this.store.staffViewSaveData.doctype;
      if (queryViewMore[i].name == val) {
        this.refs.name.innerHTML = "档案名称已存在！";
        return false;
      }
      if (queryViewMore[i].doctype == type) {
        this.refs.doctype.innerHTML = "档案编码已存在！";
        return false;
      }
    }


    this.store.viewMoreSave()
    .then(data => {
      if (data.status) {
        GlobalStore.showInfo("保存成功");
        this.props.addData(JSON.stringify(this.store.staffViewSaveData));
        this.close();
      } else {
        GlobalStore.showError(data.data);
      }
    });
  }
  
  render() {
    let _this = this;
    const staffViewSaveData = _this.store.staffViewSaveData;

    return (
      <div>
        <Modal {...this.props} show={_this.state.isShow} onHide={_this.close} className="manage-modal">
          <Modal.Header closeButton>
            <Modal.Title className='manage-title'>新增</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Form className="currency-form">
              <FormGroup className="custom-formgroup" controlId="name">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={3} sm={3} xs={3}>
                  名称：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <div className="pr" style={{'width':'260px'}}>
                    <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="名称"
                      value={staffViewSaveData.name}
                      onChange={_this.handleChange.bind(this, 'name')}
                    />
                    <div ref="name" style={{'top':'40px','left':'0'}} className="currency-error"></div>
                  </div>
                </Col>
              </FormGroup>

              <FormGroup className="custom-formgroup" controlId="doctype">
                <Col componentClass={ControlLabel} className="text-right currency-lh" md={3} sm={3} xs={3}>
                  编码：
                </Col>
                <Col md={6} sm={6} xs={6}>
                  <div className="pr" style={{'width':'260px'}}>
                    <FormControl autoComplete='off' className="currency-ref" type="text" placeholder="编码"
                                 value={staffViewSaveData.code}
                                 onChange={_this.handleChange.bind(this, 'doctype')}
                    />
                    <div ref="doctype" style={{'top':'40px','left':'0'}} className="currency-error"></div>
                  </div>
                </Col>
              </FormGroup>
            </Form>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none','marginBottom':'20px'}}>
            <button className="btn btn-default-red mr15" onClick={_this.close}>取消</button>
            <button className="btn btn-primary-red mr30" onClick={_this.onSubmit}>保存</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default StaffAddModal;

