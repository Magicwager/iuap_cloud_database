/*
* 分级管理 store
* dangwei@yonyou.com
*/
import fetch from 'isomorphic-fetch';
import {observable, computed, action, toJS} from 'mobx';

import Config from '../../config';
import GlobalStore from '../GlobalStore';

//解决浏览器缓存
function timestamp(url) {
  var getTimestamp = new Date().getTime();
  if (url.indexOf("?") > -1) {
    url = url + "×tamp=" + getTimestamp
  } else {
    url = url + "?timestamp=" + getTimestamp
  }
  return url;
}


class ManageStore {
  globalStore= GlobalStore;
  @observable
  datascource = {};  // 树形数据
  @observable
  ismc = '1';        // 是否可管控
  @observable
  isshare = '1';     // 是否共享下级
  @observable
  paramData = {};    //  管控数据
  @observable
  docTypes = [];     // 当前默认的管控数据
  @observable
  docTypeList = {"id":null,"docid":"","docname":"","isshare":"","ismc":"","ts":null};  // 管控中的每一条数据
  @observable
  selectedData = [];        // 存储保存的数据
  @observable
  selectedDataId = '';      // 编辑时数据的id
  @observable
  seletedDataDepth = '';   // 编辑时数据展示的层次数
  @observable
  parentDataSource = [];   // 父节点数据
  @observable
  onClickDataSave = '';    // 点击配置节点时保存的dom结构
  @observable
  selectHasIconData = true; // 选择配置的管控图标显示

  

  // 查询接口
  @action
  doGetManageData(callback) {
    let _this = this;
    _this.globalStore.showWait();

    let opt = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cache-Control': 'no-cache',
        //'mode': "no-cors",
      },
      //body: JSON.stringify(param),
      //credentials: "include"
    }

    return (
      fetch('http://127.0.0.1/webManage/getBillType', opt)
      //fetch(Config.manage.query, opt)
        .then(response => {
          _this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => {
          if (data.flag) {
            callback(data);
          }
          else {
            _this.globalStore.showError(!data.msg ? "查询失败" : data.msg);
          }
        }).catch(function (err) {
        _this.globalStore.hideWait();
        _this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }

  // 添加管控接口
  @action
  doSave() {
    let _this = this;
    _this.globalStore.showWait();

    // 保存的数据
    let param = {
      "id": this.selectedDataId,
      "docTypes": this.docTypes.slice()
    }

    //console.log(Array.isArray(this.docTypes.slice()))
    //console.log(this.docTypes.slice())
    //console.log('修改之后的数据', param);

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cache-Control': 'no-cache',
         //'mode': "no-cors",
      },
      body: JSON.stringify(param),
      //credentials: "include"
    }

    //return fetch(Config.manage.addSave, opt)
    return fetch('http://127.0.0.1/webManage/save', opt)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => data)
  }

/*  // 保存之后的再次查询接口
  doAgainGetManageData(callback) {
    let _this = this;
    let opt = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cache-Control': 'no-cache',
        //'mode': "no-cors",
      },
      //body: JSON.stringify(param),
      //credentials: "include"
    }
    return (
      fetch(Config.manage.query, opt)
        .then(response => {
          return response.ok ? response.json() : {}
        })
        .then(data => {
          if (data.flag) {
            callback(data);
          }
          else {
            _this.globalStore.showError(!data.msg ? "查询失败" : data.msg);
          }
        }).catch(function (err) {
        _this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }*/

}

export default ManageStore;

