/*
 * 分级管理
 * dangwei@yonyou.com
 */
import React from 'react';
import {render} from 'react-dom';
import {observer} from 'mobx-react';

import OrgChart from '../../components/OrgChart.js';
import ManageModal from '../../components/manage/ManageModal';
import ManageStore from '../../stores/manage/ManageStore';


@observer
class Manage extends React.Component {
  constructor(props) {
    super(props);
    this.store = new ManageStore();
    this.state = {
      isShow: false,   // 配置界面显示
    }

    this.initTreeData = this.initTreeData.bind(this);
  }

  componentDidMount() {
    document.title = '分级管理';
    let _this = this;

    // 初始化数据
    _this.initTreeData();

    // 点击配置按钮
    $('body').delegate('.second-menu', 'click', function () {
      var _thisData = $(this).parent()[0];
      var paramData = _thisData.getAttribute('data-source');
      if (typeof paramData === 'string') {
        paramData = JSON.parse(paramData)
      }
      console.log('编辑时的数据', paramData);
      _this.refs.managecard.show({paramData});
    });
  }

  componentWillUnmount() {
    $('body').undelegate('.second-menu', 'click', function () {
      return false;
    });
  }

  // 获取父类节点
  getParent = (pid, elems) => {
    if (!elems) {
      return;
    }
    for (var i = 0, len = elems.length; i < len; i++) {
      var elem = elems[i];
      if (elem.id == pid) {
        return elem;
      } else {
        return getParent(pid, elem.children);
      }
    }
  }

  // 转换tree型数据
  convert = (data) => {
    var result = [];
    for (var i = 0, len = data.length; i < len; i++) {
      var item = data[i];
      if (item.parentid == "") {
        result.push(item);
      } else {
        var pid = item.parentid;
        var elem = this.getParent(pid, result);
        if (elem) {
          elem.children ? elem.children.push(item) : (elem.children = [item]);
        }
      }
    }
    return result;
  }

  // 查询接口封装
  initTreeData() {
    let _this = this;
    _this.store.parentDataSource = [];
    _this.store.doGetManageData((data) => {
      console.log('未处理数据', data.data);
      _this.store.parentDataSource = _this.convert(data.data);
      console.log('已处理数据', _this.convert(data.data));
    })
    .then(() => {
        var orgchart
        _this.store.parentDataSource.map((item, index) => {
          return (

            orgchart = new OrgChart({
              'chartContainer': '#chart-container' + item.id,
              'data': item,
              'depth': 2,
              'nodeContent': 'title',
              'nodeID': 'id',
              'createNode': function (node, data) {
                var str;
                data.existsetting == true ? str = "<i class='cl cl-guanli second-menu-icon'></i>" : str = "<i class='cl cl-guanli second-menu-icon hidden'></i>";
                $(node).append(str + '<div class="second-menu">配置</div>');
              }
            })

          )
        });
      }
    );

  }

  render() {
    return (
      <div className="container-fluid" style={{'height': '100%'}}>
        <div className='chart-container'>
          {this.store.parentDataSource.length > 0 ?
            this.store.parentDataSource.map((value, index) => {
              return (<div key={index} style={{'display':'inline-block'}} id={"chart-container"+ value.id}></div>)
            }) : (<div className="manage-fulltree">暂无数据</div>)}
        </div>
        <ManageModal ref="managecard" initTreeData={this.initTreeData}/>
      </div>
    )
  }
}

export default Manage;