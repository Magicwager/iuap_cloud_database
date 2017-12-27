/*
 * 管控模式配置
 * dangwei@yonyou.com
 */
import React, {Component} from 'react'
import {Modal, Button} from 'react-bootstrap'
import {observer} from 'mobx-react'
import {Checkbox, Radio} from 'tinper-bee';

import GlobalStore from '../../stores/GlobalStore';
import ManageStore from '../../stores/manage/ManageStore';

@observer
class ManageModal extends Component {
  constructor(props) {
    super(props)
    this.store = new ManageStore();
    this.state = {
      isShow: false,        // 弹出是否显示
      checkedFlag: false,   // 复选框
      isChecked: false,     // 单选框
    }

    this.close = this.close.bind(this);
    this.handleCheck = this.handleCheck.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {

  }

  // 打开
  show(param) {
    let {paramData} = param;
    this.setState({isShow: true});
    Object.assign(this.store.paramData, paramData)
    Object.assign(this.store.docTypes, paramData.docTypes);
    this.store.selectedDataId = paramData.id;
  }

  // 关闭
  close() {
    this.setState({isShow: false});
    this.store.docTypes = [];
    this.store.selectedDataId = "";
  }

  // 是否管控
  handleChange(docid, index, e) {
    if(e == true) {
      Object.assign(this.store.docTypes[index], {'ismc':'1'});
      Object.assign(this.store.docTypeList, this.store.docTypes[index]);
    }
    if(e == false) {
      Object.assign(this.store.docTypes[index], {'ismc':'0','isshare':'0'});
    }
  }

  // 是否共享下级
  handleCheck(docid, index) {
    this.setState({
      isChecked: !this.state.isChecked
    }, () => {
      if(this.store.docTypes[index].ismc == '1') {
        if(this.state.isChecked == true) {
          Object.assign(this.store.docTypes[index], {'isshare':'1'});
        }
        if(this.state.isChecked == false) {
          Object.assign(this.store.docTypes[index], {'isshare':'0'});
        }
      }
      else {
        return false;
      }
    });
  }

   // 保存
   handleSubmit() {
     let _this = this;
     _this.store.doSave()
      .then(data => {
         if (data.flag) {
           GlobalStore.showInfo("保存成功");
           this.close();

           // this.store.doGetManageData((data) => {
           //   let treeData = this.props.convert(data.data);
           //   let that = this;
           //   let datascource = {
           //     'name': '企业帐号',
           //     'title': '',
           //     'children': treeData
           //   }
           //
           //   console.log('保存查询数据', treeData);
           //
           //   let orgchart = new OrgChart({
           //     'chartContainer': '#chart-container',
           //     'data' : datascource,
           //     'depth': 2,
           //     'nodeContent': 'title',
           //     'nodeID': 'id',
           //     'createNode': function(node, data) {
           //       var str;
           //       data.ismc=='1'?str="<i class='cl cl-guanli second-menu-icon'></i>":str="<i class='cl cl-guanli second-menu-icon hidden'></i>";
           //       $(node).append(str+'<div class="second-menu">配置</div>');
           //     }
           //   });
           //
           //   // $('body').delegate('.second-menu','click',function(){
           //   //   var _thisData = $(this).parent()[0];
           //   //   var paramData = _thisData.getAttribute('data-source');
           //   //   if (typeof paramData === 'string') {
           //   //     paramData = JSON.parse(paramData)
           //   //   }
           //   //   console.log('编辑的数据', paramData);
           //   //   that.refs.managecard.show({paramData});
           //   // });
           //
           // });

         } else {
           GlobalStore.showError("保存失败");
         }
       });
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
                  {this.store.docTypes.map((item, index) => {
                    return (
                      <tr key={index}>
                        <td>
                          <div className="manage-checkbox">
                            <Checkbox colors="dark"
                                      checked={item.ismc == '1' ? true : false}
                                      onChange={this.handleChange.bind(this, item.docid, index)}> {item.docname}</Checkbox>
                          </div>
                        </td>
                        <td>
                          <div className="manage-checkbox" onClick={this.handleCheck.bind(this, item.docid, index)}>
                            <div className={item.isshare == '1' ? "manage-radio-checked":"manage-radio"}></div>
                            <span>共享下级</span>
                          </div>
                        </td>
                      </tr>)
                  })}
                </tbody>
              </table>
            </div>
          </Modal.Body>
          <Modal.Footer style={{'borderTop':'none'}}>
            <button className="btn btn-primary-red mr10" onClick={_this.handleSubmit}>保存</button>
            <button className="btn btn-default-red" onClick={_this.close}>取消</button>
          </Modal.Footer>
        </Modal>
      </div>
    )
  }
}

export default ManageModal;