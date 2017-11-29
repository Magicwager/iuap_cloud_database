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
  currency = {code:'',name:'',sign:'',pricedigit:'',moneydigit:'',pricerount:'',moneyrount:'',description:'',isdefault:0};
  @observable
  tableDataTitle='暂无数据！'


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
            console.log('查询成功', data.data);
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
    console.log('新增1111', this.currency);
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

}

export default CurrencyStore;

