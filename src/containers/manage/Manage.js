/*
 * 管控模式
 * dangwei@yonyou.com
 */
import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

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
      treeData: [],    // tree数据
    }

    this.isInArray = this.isInArray.bind(this);
    this.convert = this.convert.bind(this);
    this.getChildren = this.getChildren.bind(this);
  }

  componentDidMount() {
    document.title = '管控模式';

    this.store.doGetManageData((data) => {
      let treeData = this.convert(data.data);
      let that = this;
      let datascource = {
        'name': '企业帐号',
        'title': '',
        'children': treeData
      }

      let orgchart = new OrgChart({
        'chartContainer': '#chart-container',
        'data' : datascource,
        'depth': 2,
        'nodeContent': 'title',
        'nodeID': 'id',
        'createNode': function(node, data) {
          var str;
          data.ismc=='1'?str="<i class='cl cl-guanli second-menu-icon'></i>":str="<i class='cl cl-guanli second-menu-icon hidden'></i>";
          $(node).append(str+'<div class="second-menu">配置</div>');
        }
      });

      $('body').delegate('.second-menu','click',function(){
        var _thisData = $(this).parent()[0];
        var paramData = _thisData.getAttribute('data-source');
        if (typeof paramData === 'string') {
          paramData = JSON.parse(paramData)
        }
        that.refs.managecard.show({paramData});
      });

    });

  }

  // 树结构转换方法
  isInArray(arrays, current) {
    const isIn = arrays.find((prod, i) => {
    if (prod.id === current.parentid) {
      return true;
    }
      return false;
    });
    return isIn;
  }

  // 树结构转换方法
  convert(root) {
    var resultRoot = []
    root.map((val)=> {
      val.children = null
    });
    for (var i = 0; i < root.length; i++) {
      var ri = root[i];
      if (ri.parentid == '' || ri.parentid == null || (!this.isInArray(root, ri))) {
        resultRoot.push(ri);
      }
      else {
        for (let j = 0; j < root.length; j++) {
          let rj = root[j];
          if (rj.id == ri.parentid) {
            rj.children = !rj.children ? [] : rj.children;
            rj.children.push(ri);
            break;
          }
        }
      }
    }
    return resultRoot;
  }

  // 树结构转换方法
  getChildren(item)  {
    var result = [];
    if (item.children) {
      item.children.map((sub, index) => {
        if (sub.children) {
          result.push({
            id: sub.id,
            name: sub.name,
            parentid:sub.parentid,
            docTypes:sub.docTypes,
            children: this.getChildren(sub)
          })
        } else {
          result.push({
            id: sub.id,
            name: sub.name,
            parentid:sub.parentid,
            docTypes:sub.docTypes
          })
        }
      });
    }
    return result;
  }

  // 查询接口
  handleSearch() {
    this.store.doGetManageData((data) => {

    });
  }

  render() {
    return (
      <div className="container-fluid" style={{'height': 'calc(100% - 20px)'}}>
        <div id="chart-container" style={{'height':'100%', 'overflow':'auto'}}></div>
        <ManageModal ref="managecard" />
      </div>
    )
  }
}

export default Manage;