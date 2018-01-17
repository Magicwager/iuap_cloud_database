/*
 * 定义自定义项 查看更多弹框组件
 * dangwei@yonyou.com
 */
import React, {Component, PropTypes} from 'react';
import {observer} from 'mobx-react';
import {Modal, Form, FormGroup, FormControl, ControlLabel, Col, Button, Checkbox} from 'react-bootstrap';
import {Link} from 'react-router';
import {Scrollbars} from 'react-custom-scrollbars';

import StaffAddModal from '../../components/custom/StaffAddModal';
import CustomStore from '../../stores/custom/CustomStore';


@observer
class CustomViewMoreModal extends Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {
      isShow: false,
      viewMoreData: [],
      extendFlag: 0,
      id:''
    }

    this.close = this.close.bind(this);
    this.openCard = this.openCard.bind(this);
    this.addData = this.addData.bind(this);
  }

  // 打开
  show(param) {
    this.setState({
      isShow: true,
      viewMoreData: param.param,
      extendFlag: param.extendFlag,
      id: param.id
    });
    this.store.queryViewMoreData = param.param;
  }

  // 关闭
  close() {
    this.setState({
      isShow: false
    });
    this.props.refreshPage();
  }

  // 打开新增卡片
  openCard() {
    this.close();
    this.refs.staffAdd.show({});
  }

  // 拼接数据
  addData(param) {
    const addData = JSON.parse(param);
    this.setState({isShow: true});
    this.store.queryViewMoreData.push(addData);
  }


  render() {
    let _this = this;
    const queryViewMoreData = _this.store.queryViewMoreData.slice();
    
    return (
      <div>
        <Modal {...this.props} show={_this.state.isShow} onHide={_this.close} className="viewmore-modal manage-modal">
          <Modal.Header closeButton>
            <Modal.Title className='manage-title'>员工</Modal.Title>
          </Modal.Header>
          <Modal.Body>
            <Scrollbars
              universal={true}
              autoHeight
              autoHeightMax={350}>
                <div className="row clearfix" style={{'height':'350px'}}>
                  {queryViewMoreData.map((item, index) => {
                    return (<div key={'view'+index} className={item.extendStatus == 0 ?"viewmore":"viewmore-green"}>
                      <Link to={"/customlist/"+item.doctype}>{item.name}</Link>
                    </div>)
                  })}
                  {_this.state.extendFlag == 0 ?  <div className="custom-add" onClick={_this.openCard}></div>:''}
                </div>
              </Scrollbars>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none'}}>
            <button className="btn btn-default-red mr30" onClick={_this.close}>取消</button>
          </Modal.Footer>
        </Modal>

        <StaffAddModal ref='staffAdd' id={_this.state.id} addData={_this.addData} queryViewMoreData={this.store.queryViewMoreData}/>

      </div>
    )
  }
}


export default CustomViewMoreModal;
