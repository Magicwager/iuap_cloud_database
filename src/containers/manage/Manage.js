/*
 * 基础数据分级管理
 * dangwei@yonyou.com
 */
import React from 'react';
import { render } from 'react-dom';
import { observer } from 'mobx-react';
import { Link } from 'react-router';

import OrgChart from '../../components/OrgChart.js';
import ManageModal from '../../components/manage/ManageModal';


@observer
class Manage extends React.Component {
  constructor(props) {
    super(props);
    //this.store = new CustomStore();
    this.state = {
      isShow: false,   // 配置界面显示
    }

  }

  componentDidMount() {
    document.title = '分级管控';

    let that = this;

    let datascource = {
        'name': '企业帐号',
        'title': '',
        'children': [
          { 'name': '用友网络科技', 'title': '', 'ismc':'1',
            'children': [
              { 'name': '用友股份', 'title': '','ismc':'1',
                'children': [
                  { 'name': 'NC集团', 'title': '',
                    'children': [
                      { 'name': '111', 'title': '' },
                      { 'name': '222', 'title': '',}
                    ]
                  },
                  { 'name': 'U8Cloud', 'title': '',
                    'children': [
                      { 'name': '333', 'title': '' },
                      { 'name': '444', 'title': '',}
                    ]},
                  { 'name': '用友云平台', 'title': '',
                    'children': [
                      { 'name': '云平台市场部', 'title': '' },
                      { 'name': '云平台市场部', 'title': ''},
                      { 'name': '云平台设计部', 'title': '',
                        'children': [
                          {'name':'设计主管','title': ''},
                          {'name':'UE交互设计师','title': ''},
                          {'name':'视觉设计师','title': ''}
                        ]
                      },
                      { 'name': '云平台技术部', 'title': ''},
                      { 'name': '云平台销售部', 'title': ''},
                    ]
                  },
                ]
              },
              { 'name': '用友北京分公司', 'title': ''},
              { 'name': '用友上海分公司', 'title': '' },
              { 'name': '用友深圳分公司', 'title': '' },
            ]},
          { 'name': '用友政务', 'title': '' ,
            'children': [
              { 'name': 'Tie Hua', 'title': '' },
              { 'name': 'Hei Hei', 'title': '',
                'children': [
                  { 'name': 'Pang Pang', 'title': '' },
                  { 'name': 'Xiang Xiang', 'title': '' }
                ]
              }
            ]
          },
          { 'name': '用友建筑', 'title': '' },
          { 'name': '用友金融', 'title': '',
            'children': [
              { 'name': 'Tie Hua', 'title': '' },
              { 'name': 'Hei Hei', 'title': '',
                'children': [
                  { 'name': 'Pang Pang', 'title': '' },
                  { 'name': 'Xiang Xiang', 'title': '' }
                ]
              }
            ]},
        ]
      };

    let orgchart = new OrgChart({
      'chartContainer': '#chart-container',
      'data' : datascource,
      'depth': 2,
      'nodeContent': 'title',
      //'pan': true,
      //'zoom': true,
      'nodeID': 'id',
      'createNode': function(node, data) {
        //console.log(node, data);

        /*let secondMenuIcon = document.createElement('i'),
            secondMenu = document.createElement('div');
        secondMenuIcon.setAttribute('class', 'cl cl-guanli second-menu-icon manage-peizhi');
        secondMenu.setAttribute('class', 'second-menu');
        secondMenu.innerHTML = `配置`;
        node.appendChild(secondMenuIcon);
        node.appendChild(secondMenu);
         `<div class="second-menu">配置</div>`
        */
        var str;
        data.ismc=='1'?str="<i class='cl cl-guanli second-menu-icon'></i>":str="<i class='cl cl-guanli second-menu-icon hidden'></i>";
        //console.log(11, data, str);

        $(node).append(str+'<div class="second-menu">配置</div>');
      }
    });

    $('body').delegate('.second-menu','click',function(){
      that.refs.managecard.show({index:1});
    });

  }

  render() {
    return (
      <div className="container-fluid" style={{'height':'100%'}}>
        <div id="chart-container" style={{'height':'100%', 'overflow':'auto'}}></div>
        <ManageModal ref="managecard" />
      </div>
    )
  }
}

export default Manage;