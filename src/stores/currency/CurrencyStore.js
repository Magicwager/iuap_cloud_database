/*
* 币种store
* dangwei@yonyou.com
*/
import fetch from 'isomorphic-fetch';
import { observable, computed, action, toJS } from 'mobx';

import Config from '../../config';
import GlobalStore from '../GlobalStore'

class CurrencyStore {
  globalStore = GlobalStore;
  @observable
  currencys = [];
  @observable
  currency = {code:'',name:'',sign:'',pricedigit:6,moneydigit:2,pricerount:5,moneyrount:5,description:'',isdefault:0};
  @observable
  tableDataTitle='暂无数据！';
  @observable
  pricerounts=[{'price':"5",name:"四舍五入"},{'price':"0",name:"全部舍位"},{'price':"1",name:"全部进位"}]; // 单价舍入规则


  // 查询接口
  @action
  getCurrencyLst() {
    this.globalStore.showWait();
    let opt = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      //credentials: "include"
    }

    return (
      //fetch('http://127.0.0.1/webCurrency/getBillType', opt)
      fetch(Config.currency.query, opt)
        .then(response => {
          this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => {
          if (data.status) {
            this.currencys.replace(data.data);
          } else {
            this.globalStore.showError(!data.msg ? "币种列表数据查询失败" : data.msg);
          }
        }).catch(function(err) {
            this.globalStore.hideWait();
            this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
       })
    )
  }


  // 新增、编辑接口
  @action
  handleSubmit(flag) {
    this.globalStore.showWait();
    let option = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(this.currency),
      //credentials: "include"
    }
    if(flag === 'add'){
      //return fetch('http://127.0.0.1/webCurrency/getAddType', option)
      return fetch(Config.currency.add, option)
        .then(response => {
          this.globalStore.hideWait();
          return  response.ok ? response.json() : {}
        })
        .then(data => data)
    }
    if(flag==='edit') {
      //return fetch('http://127.0.0.1/webCurrency/getEditType', option)
      return fetch(Config.currency.edit, option)
        .then(response => {
          this.globalStore.hideWait();
          return  response.ok ? response.json() : {}
        })
        .then(data => data)
    }
  }
  
  
  // 删除接口
  @action
  hdDelete(index, callback) {
    let _this = this;
    let params = {
      id: _this.currencys[index].id
    }

    let option = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(params),
      //credentials: "include"
    }

    _this.globalStore.showWait();
    //return fetch('http://127.0.0.1/webCurrency/getDelType', option)
    return fetch(Config.currency.delete, option)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => {
        if(data.status){
          callback();
          GlobalStore.showInfo("删除成功")
        }else{
          GlobalStore.showError(data.msg)
        }
      })
  }

  // 模糊查询接口
  @action
  handleSearch(param) {
    this.globalStore.showWait();
    let opt = {
      method: 'get',
      headers: {
        'Content-Type': 'application/json'
      },
      //credentials: "include"
    }

    //let url = encodeURI('http://127.0.0.1/webCurrency/getSearch?keyword='+param);
    let url = encodeURI(Config.currency.search+'?keyword='+param);
    url = encodeURI(url);

    return (
      fetch(url, opt)
        .then(response => {
          this.globalStore.hideWait();
          return response.ok ? response.json() : {}
        })
        .then(data => {
          if (data.status) {
            if(!data.data && typeof data.data != "undefined" && data.data != 0) {
              this.currencys.replace([]);
            } else {
              this.currencys.replace(data.data);
            }
          } else {
            this.globalStore.showError(!data.msg ? "暂无数据" : data.msg);
          }
        }).catch(function(err) {
        this.globalStore.hideWait();
        this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      })
    )
  }
  
  // 设为默认接口
  @action
  hdDefault(index, callback) {
    let _this = this;

    let option = {
      method: 'post',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(_this.currency),
      //credentials: "include"
    }

    _this.globalStore.showWait();
    //return fetch('http://127.0.0.1/webCurrency/getDelType', option)
    return fetch(Config.currency.setDefault, option)
      .then(response => {
        _this.globalStore.hideWait();
        return response.ok ? response.json() : {}
      })
      .then(data => {
        if(data.status){
          callback();
          GlobalStore.showInfo("设为默认成功")
        }else{
          GlobalStore.showError(data.msg)
        }
      })
  }
}

export default CurrencyStore;

