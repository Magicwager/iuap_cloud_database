/*
* 分级管控模式 store
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
  ismc = '1';      // 是否可管控
  @observable
  isshare = '1';   // 是否共享下级

  // 查询接口
  @action
  getCustomList(data, callback) {
    let _this = this;
    _this.globalStore.showWait();

    let param = {"orders":[{"direction":"ASC","property":"code"}],"conditions":[{"conditionList":[],"datatype":"string","extendSql":{},"field":"doctype","logic":false,"logicsymbol":"and","operator":"=","value":"staff"}],"pageIndex":data.startIndex,"pageSize":data.itemPerPage};

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cache-Control': 'no-cache',
        'mode': "no-cors",
        'tenantId':'owzp1n95',                        // 查询接口使用
      },
      body: JSON.stringify(param),
      //credentials: "include"
    }

    return (
      fetch(timestamp(Config.manage.query), opt)
        .then(response => {
          _this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => {
          if (data.status) {
            _this.customs.replace(data.data.content);
            callback(data.data);
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
  onAdd() {
    let _this = this;
    _this.globalStore.showWait();

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cache-Control': 'no-cache',
        'mode': "no-cors",
        'tenantId':'owzp1n95',                        // 查询接口使用
      },
      body: JSON.stringify(param),
      //credentials: "include"
    }

    return fetch(Config.custom.edit+`${this.custom.id}`+'?tenantId=owzp1n95', opt)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => data)
  }

}

export default ManageStore;

