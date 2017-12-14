/*
 * 定义自定义store
 * dangwei@yonyou.com
 */
import fetch from 'isomorphic-fetch';
import {observable, computed, action, toJS} from 'mobx';

import Config from '../../config';
import GlobalStore from '../GlobalStore';


class CustomStore {
  globalStore = GlobalStore;
  @observable
  customs = [];
  @observable
  custom = {"name":"","type":"","doctype":"","attrlength":"","precision":"","creator":"","creationtime":"","modifier":"","modifiedtime":""};
  @observable
  tableDataTitle = '暂无数据';
  @observable
  page = 1;     // 显示当前页
  @observable
  dataTypes = [{'code':'0','name':'日期'},{'code':'1','name':'布尔'},{'code':'2','name':'数字'},{'code':'3','name':'字符'},{'code':'4','name':'自定义档案'},{'code':'5','name':'基本档案'}]; // 数据类型
  @observable
  datatypeVale = {'code':'0','name':'日期'};  // 数据类型的默认value
  @observable
  pageNumber = 20; // 每一页显示的数据条数
  @observable
  activePageSize = 1; // 记录当前显示的页码数



  // 查询接口
  @action
  getCustomList(data, callback) {
    let _this = this;
    let param = {"orders":[{"direction":"ASC","property":"code"}],"conditions":[{"conditionList":[],"datatype":"string","extendSql":{},"field":"doctype","logic":false,"logicsymbol":"and","operator":"=","value":"staff"}],"pageIndex":data.startIndex,"pageSize":data.itemPerPage};
    _this.globalStore.showWait();

    let opt = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        //'Cache-Control': 'no-cache',
        'mode': "no-cors",
      },
      body: JSON.stringify(param),
      //credentials: "include"
    }

    return (
      fetch('/basedoc/bd/attr/extendFields'+'?tenantId=owzp1n95', opt)
      //fetch('http://127.0.0.1/WebCustom/getBillType', opt)
      //fetch(timestamp(Config.currency.query), opt)
        .then(response => {
          _this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => {
          if (data.status) {
            _this.customs.replace(data.data.content);
            callback(data.data);
          } else {
            _this.globalStore.showError(!data.msg ? "列表数据查询失败" : data.msg);
          }
        }).catch(function (err) {
        _this.globalStore.hideWait();
        _this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }

  // 新增、编辑接口
  @action
  handleSubmit(flag) {
    let _this = this;
    this.globalStore.showWait();

    let option = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        'Cache-Control': 'no-cache'
      },
      body: JSON.stringify(this.custom),
      //credentials: "include"
    }

    if (flag === 'add') {
      return fetch('/basedoc/bd/attr/extendField', option)
      //return fetch(Config.currency.add, option)
        .then(response => {
          _this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => data)
    }

    if (flag === 'edit') {
      return fetch('/extendField', option)
      //return fetch(Config.currency.edit, option)
        .then(response => {
          _this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => data)
    }
  }

  // 删除接口
  // @action
  // handleDelete(index, callback) {
  //   let _this = this;
  //
  //   let params = {
  //     id: _this.customs[index].id
  //   }
  //
  //   let option = {
  //     method: 'post',
  //     headers: {
  //       'Content-Type': 'application/json',
  //       'Accept': 'application/json',
  //       'Cache-Control': 'no-cache'
  //     },
  //     body: JSON.stringify(params),
  //     credentials: "include"
  //   }
  //
  //   _this.globalStore.showWait();
  //
  //   //return fetch('http://127.0.0.1/webCurrency/getDelType', option)
  //   return fetch(Config.currency.delete, option)
  //     .then(response => {
  //       _this.globalStore.hideWait();
  //       return response.ok ? response.json() : {}
  //     })
  //     .then(data => {
  //       if (data.status) {
  //         callback();
  //         GlobalStore.showInfo("删除成功");
  //       } else {
  //         GlobalStore.showError(data.msg);
  //       }
  //     })
  // }



}

export default CustomStore;