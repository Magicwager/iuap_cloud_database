/*
 * 基础数据分级管理配置
 * dangwei@yonyou.com
 */
import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {observer} from 'mobx-react'
import {Checkbox, Radio} from 'tinper-bee';

@observer
class ManageModal extends Component {
  constructor(props) {
    super(props)
    this.store = props.store
    this.state = {
      isShow: false,
      selectedValue: 'apple'
    }
    this.close = this.close.bind(this);
  }

  handleChange(value) {
    this.setState({selectedValue: value});
  }

  // 卡片展示
  show(param) {
    let {index, flag} = param
    this.setState({isShow: true})
  }

  // 关闭
  close() {
    this.setState({isShow: false})
  }


  render() {
    let _this = this;

    return (
      <div>
        <Modal {...this.props} show={_this.state.isShow} onHide={_this.close}>
          <Modal.Header closeButton>
            <Modal.Title className='manage-title'>基础数据管理配置</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <div className="manage-content">
              <table className="table">
                <thead>
                  <tr><th colSpan={2}>管理范围</th></tr>
                </thead>
                <tbody>
                  <tr>
                    <td><div className="manage-checkbox"><Checkbox colors="dark"> 客户</Checkbox></div></td>
                    <td><div className="manage-checkbox"><Radio.RadioGroup
                      name="fruit"
                      onChange={this.handleChange.bind(this)}>
                      <Radio value="apple"> 共享下级</Radio>
                    </Radio.RadioGroup></div></td>
                  </tr>
                  <tr>
                    <td><div className="manage-checkbox"><Checkbox colors="dark"> 供应商</Checkbox></div></td>
                    <td><div className="manage-checkbox"><Radio.RadioGroup
                      name="fruit"
                      onChange={this.handleChange.bind(this)}>
                      <Radio value="apple"> 共享下级</Radio>
                    </Radio.RadioGroup></div></td>
                  </tr>
                  <tr>
                    <td><div className="manage-checkbox"><Checkbox colors="dark"> 物料</Checkbox></div></td>
                    <td><div className="manage-checkbox"><Radio.RadioGroup
                      name="fruit"
                      onChange={this.handleChange.bind(this)}>
                      <Radio value="apple"> 共享下级</Radio>
                    </Radio.RadioGroup></div></td>
                  </tr>
                  <tr>
                    <td><div className="manage-checkbox"><Checkbox colors="dark"> 项目</Checkbox></div></td>
                    <td><div className="manage-checkbox"><Radio.RadioGroup
                      name="fruit"
                      onChange={this.handleChange.bind(this)}>
                      <Radio value="apple"> 共享下级</Radio>
                    </Radio.RadioGroup></div></td>
                  </tr>
                  <tr>
                    <td><div className="manage-checkbox"><Checkbox colors="dark"> 人力</Checkbox></div></td>
                    <td><div className="manage-checkbox"><Radio.RadioGroup
                      name="fruit"
                      onChange={this.handleChange.bind(this)}>
                      <Radio value="apple"> 共享下级</Radio>
                    </Radio.RadioGroup></div></td>
                  </tr>
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none'}}>
            <button className="btn btn-primary-red mr10">保存</button>
            <Button onClick={_this.close}>取消</Button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ManageModal;