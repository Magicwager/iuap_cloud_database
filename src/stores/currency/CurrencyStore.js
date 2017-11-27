/*
* 币种store
* dangwei@yonyou.com
*/
//import fetch from 'isomorphic-fetch';
import { observable, computed, action, toJS } from 'mobx';
//import Config from '../../config';
import GlobalStore from '../GlobalStore'

class CurrencyStore {
  globalStore = GlobalStore;
  @observable
  currencys = [];
  @observable
  currency = { };
  @observable
  tableDataTitle='暂无数据！'



  // 查询接口
  @action
  getCurrencys() {
    this.globalStore.showWait();
    $.ajax({
      type: "POST",
      //url: Config.currency.query,
      url:'http://127.0.0.1/webCurrency/getBillType',
      dataType: "json",
      data: {},
      success: data => {
        this.globalStore.hideWait();
        if (data.success) {
          this.currencys.replace(data.data);
        } else {
          this.globalStore.showError(!data.message ? "币种列表数据查询失败" : data.message);
        }
      },
      error: (xhr, status, err) => {
        this.globalStore.hideWait();
        this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      }
    });
  }

  // 新增、编辑接口
  @action
  handleSubmit() {
    this.globalStore.showWait();
    $.ajax({
      type: "POST",
      //url: Config.currency.query,
      url:'http://127.0.0.1/webCurrency/getAddType',
      dataType: "json",
      data: {},
      success: data =>  {
        this.globalStore.hideWait();
        if (data.success) {
          //this.currencys.replace(data.data);
        } else {
          this.globalStore.showError(!data.message ? "币种列表数据查询失败" : data.message);
        }
      },
      error: (xhr, status, err) => {
        this.globalStore.hideWait();
        this.globalStore.showError('数据请求失败,错误信息:' + err.toString());
      }
    })
  }
  
  
  // 删除接口
  hdDelete() {

  }

}

export default CurrencyStore;

