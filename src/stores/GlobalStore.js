/**
 * 全局store, 在整个App的生命周期生存
 */
import { observable, computed, action } from 'mobx';
import AlertDialog from '../components/models/AlertDialog';

class GlobalStore {
  

  // 全局缓存对象, 放置科目,参照等信息
  // cache = {
  //   subjectTree: null,
  //   accSubjectType: [],
  //   accbookAll: [],
  //   accBalance: ''// 期初余额页面的已选中的账簿
  // }

  // 设置缓存
  // setCache = (key, value) => {
  //   this.cache[key] = value;
  // }

  // 获取缓存
  //getCache = key => this.cache[key]


  /**
   * 规范化localStorage中的key，请不要使用自定义的key
   * @type {Object}
   */
  // storageConfig = {
  //   currentVoucherList: 'currentVoucherList',
  // }
  // getStorage(key) {
  //   return JSON.parse(localStorage.getItem(key));
  // }
  // setStorage(key, value) {
  //   return localStorage.setItem(key, JSON.stringify(value));
  // }
  /**
   * 判断key是否存在
   * @param  {string}  key [description]
   * @return {Boolean}     true表明存在
   */
  // isStorage(key) {
  //   return localStorage.getItem(key) !== null;
  // }

  // 判断缓存是否存在
  //isCache = key => this.cache[key] != undefined

  // 当前凭证查询结果, 不需要绑定
  //currentVoucherList = [];

  @observable alertDialog = new AlertDialog(3000);

  // 提示信息
  @observable alertMsg = {
    message: '',
    alertVisible: false,
    type: 'danger', // "success", "warning", "danger", "info"
    autoClose: false,
  };
  // 提示信息
  @observable modelMsg = {
    message: '',
    modelVisible: false,
    hasCancel: false,
    cancelFn: null,
    sureFn: null
  };
  // 提示信息
  @observable fixedMsg = {
    message: '',
    alertVisible: false,
    type: 'success', // "success", "warning", "danger", "info"
    autoClose: true,
  };
  @observable showWaiting = {
    show: false,
    text: '加载中...'
  };

  // 权限信息
  // @observable authInfo = {
  //   accbook_setup: null,
  //   accsubjectchart_setup: null,
  //   voucher_setup: null
  // }


  // 用弹窗的方式显示提示信息
  @action showModel(msg) {
    this.modelMsg = Object.assign(this.modelMsg, { message: msg, modelVisible: true, hasCancel: false, cancelFn: null, sureFn: null });
  }
  // 用弹窗的方式显示提示信息
  @action showCancelModel(msg, cancelFn, sureFn) {
    this.modelMsg = Object.assign(this.modelMsg, { message: msg, modelVisible: true, hasCancel: true, cancelFn, sureFn });
  }

  // 显示成功提示信息
  @action showInfo(msg) {
    this.alertMsg = Object.assign(this.alertMsg, {
      message: msg,
      type: 'success',
      autoClose: true,
      alertVisible: true
    });
    if (this.alertMsg.autoClose) {
      setTimeout(() => {
        this.alertMsg = Object.assign(this.alertMsg, { message: '', alertVisible: false });
      }, 3000);
    }
  }
  // 显示普通提示信息
  @action showWarning(msg) {
    this.alertMsg = Object.assign(this.alertMsg, {
      message: msg,
      type: 'info',
      autoClose: true,
      alertVisible: true
    });
    if (this.alertMsg.autoClose) {
      setTimeout(() => {
        this.alertMsg = Object.assign(this.alertMsg, { message: '', alertVisible: false });
      }, 3000);
    }
  }
  // 显示错误提示信息
  @action showError(msg) {
    this.alertMsg = Object.assign(this.alertMsg, {
      message: msg,
      type: 'danger',
      autoClose: false,
      alertVisible: true
    });
  }
  // 隐藏提示信息
  @action hideAlert() {
    this.alertMsg = Object.assign(this.alertMsg, { message: '', alertVisible: false });
  }
// 显示不被路由删除的信息
  @action showFixed(msg) {
    this.fixedMsg = Object.assign(this.fixedMsg, {
      message: msg,
      alertVisible: true
    });
    if (this.fixedMsg.autoClose) {
      setTimeout(() => {
        this.fixedMsg = Object.assign(this.fixedMsg, { message: '', alertVisible: false });
      }, 3000);
    }
  }
  // 隐藏不被路由删除的信息
  @action hideFixed() {
    this.fixedMsg = Object.assign(this.fixedMsg, { message: '', alertVisible: false });
  }
  // 显示等待遮罩
  @action showWait() {
    this.showWaiting = Object.assign(this.showWaiting, { show: true });
    // 超时自动关闭
    // setTimeout(() => {
    //     this.showWaiting = Object.assign(this.showWaiting, {show:false});
    // }, 20000);
  }
// 隐藏等待遮罩
  @action hideWait() {
    this.showWaiting = Object.assign(this.showWaiting, { show: false });
  }


  // 账簿
  accBookData = [];
  accBook = '';

  // 全局参数, 通过地址栏传入的

  params = {};

  @observable
  accBookType = [];

  get getAllAcc() {
    this.accBookData = JSON.parse(localStorage.getItem('accBookData'));
    return this.accBookData;
  }

  // 获取账簿, 所有使用者通过这个接口调用
  get getAccBook() {
    return this.accBook;
  }

  // 获取参数, 所有使用者通过这个接口调用
  get getParams() {
    return this.params;
  }

  get getAllAccType() {
    return this.accBookType;
  }
  // @action
  // getDefaultAccObj(id) {
  //   let obj,
  //     index = 0;
  //   const targetData = this.getAllAcc.find((prod, i) => {
  //     if (prod.id == id) {
  //       index = i;
  //       return true;
  //     }
  //     return false;
  //   });
  //   if (targetData) {
  //     obj = {
  //       id: targetData.id,
  //       name: targetData.name,
  //       code: targetData.code
  //     };
  //   }
  //   return obj;
  // }
  // @action
  // getPeriodCurrency(id) {
  //   let obj,
  //     index = 0;
  //   const targetData = this.getAllAcc.find((prod, i) => {
  //     if (prod.id == id) {
  //       index = i;
  //       return true;
  //     }
  //     return false;
  //   });
  //   if (targetData) {
  //     // console.log(targetData)
  //     obj = {
  //       period: typeof (targetData.accperiod) === 'string' ? targetData.accperiod : (targetData.accperiod && targetData.accperiod.code ? targetData.accperiod.code : moment().format('YYYY-MM')),
  //       currency: targetData.currency,
  //       enable: targetData.enable,
  //       currentAcc: {
  //         id: targetData.id,
  //         name: targetData.name,
  //         code: targetData.code
  //       },
  //       subjectchart: targetData.subjectchart && targetData.subjectchart.id ? targetData.subjectchart.id : ''
  //     };
  //   } else {
  //     obj = {
  //       period: moment().format('YYYY-MM'), currency: ''
  //     };
  //   }
  //   return obj;
  // }

  // 获取权限信息
  // @action
  // queryAuthInfo(callback) {
  //   let that = this;
  //   $.ajax({
  //     type: 'GET',
  //     url: Config.auth + "?" + Date.now(),
  //     dataType: 'json',
  //     async: false,
  //     contentType: 'application/json',
  //     success: (data) => {
  //       if (data.success) {
  //         that.authInfo = Object.assign(that.authInfo, data.data);
  //       } else {
  //         // this.showError(!data.message ? "查询失败" : data.message);
  //       }
  //     },
  //     error: (xhr, status, err) => {
  //       this.showError(`数据请求失败,错误信息:${err.toString()}`);
  //     }
  //   });
  // }

  // 查询所有账簿数据
  // @action
  // queryAllAcc(callback) {
  //   let that = this;
  //   $.ajax({
  //     type: 'GET',
  //     url: Config.accbook.getAll + "?" + Date.now(),
  //     dataType: 'json',
  //     async: false,
  //     contentType: 'application/json',
  //     success: (data) => {
  //       if (data.success) {
  //         that.accBookData = Object.assign(that.accBookData, data.data);
  //       } else {
  //         // this.showError(!data.message ? "查询失败" : data.message);
  //       }
  //     },
  //     error: (xhr, status, err) => {
  //       this.showError(`数据请求失败,错误信息:${err.toString()}`);
  //     }
  //   });
  // }

  // 查询默认账簿数据
  // @action
  // queryDefaultAcc(callback) {
  //   let that = this;
  //   $.ajax({
  //     type: 'GET',
  //     url: Config.accbook.getDefault + "?" + Date.now(),
  //     dataType: 'json',
  //     async: false,
  //     contentType: 'application/json',
  //     success: (data) => {
  //       let defaultAcc;
  //       if (data.data != null && data.data.id) {
  //         let target = this.accBookData.find((prod, i) => {
  //           if (prod.id === data.data.id) {
  //             return true;
  //           }
  //           return false;
  //         });
  //         if (target) {
  //           defaultAcc = data.data.id;
  //         }
  //       }
  //       that.accBook = defaultAcc || (that.accBookData[0] && that.accBookData[0].id ? that.accBookData[0].id : '');
  //       console.log(`params default acc:${that.accBookDefault}`);
  //     },
  //     error: (xhr, status, err) => {
  //       this.showError(`数据请求失败,错误信息:${err.toString()}`);
  //     }
  //   });
  // }
  // 查询科目大类
  // 需求变更，需要增加参数，科目表id
  // @action
  // queryAllAccType(callback, accelement) {
  //   if (!accelement) { accelement = this.getPeriodCurrency(this.accBook).subjectchart; }
  //   $.ajax({
  //     type: 'GET',
  //     url: `${Config.basedoc.getAccElementFirstLevel}?accelement=${accelement}`,
  //     dataType: 'json',
  //     async: false,
  //     contentType: 'application/json',
  //     success: (data) => {
  //       if (data.success) {
  //         this.accBookType = data.data;
  //         if (typeof callback === 'function') {
  //           callback();
  //         }
  //       }
  //     },
  //     error: (xhr, status, err) => {
  //       this.showError(`数据请求失败,错误信息:${err.toString()}`);
  //     }
  //   });
  // }

  constructor() {
    // 初始化时加载权限信息到缓存
    if (process.env.NODE_ENV !== 'development') {
      this.queryAuthInfo();
    }

    // 获取默认账簿, 如果从其它页签传参数就取,没有就从后端查
    // if (GetQueryString('accbook') != null) {
    //   this.accBook = GetQueryString('accbook');
    //   console.log(`params default acc:${this.accBook}`);
    // } else {
    //   // this.queryDefaultAcc();
    // }

    // 获取地址栏传过来的参数
    // if (GetQueryString('params') != null) {
    //   this.params = JSON.parse(GetQueryString('params'));
    //   console.log(`params:${this.accBook}`);
    // }

    // this.queryAllAccType();
  }

  @observable subjectLevel = 4;
  // 获取账簿的科目级次
  // @action
  // getSubjectLevel () {
  //   let that = this;
  //   that.showWait();
  //   $.ajax({
  //     type: "POST",
  //     url: Config.report.subjectlevel,
  //     dataType: "json",
  //     contentType: "application/x-www-form-urlencoded",
  //     data: {"accBook":that.accBook},
  //     success: data => {
  //       that.hideWait();
  //       if (data.success) {
  //         that.subjectLevel = data.data;
  //       }else{
  //         that.showError(data.message?data.message:"查询失败")
  //       }
  //     },
  //     error: (xhr, status, err) => {
  //       that.hideWait();
  //       that.showError('数据请求失败,错误信息:' + err.toString());
  //     }
  //   });
  // }

}

export default new GlobalStore();
