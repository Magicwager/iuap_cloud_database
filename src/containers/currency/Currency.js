/*
 *  币种
 *  dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';

import GlobalStore from '../../stores/GlobalStore';

import CurrencyCard from './CurrencyCard';
import CurrencyList from './CurrencyList';
import CurrencyStore from '../../stores/currency/CurrencyStore';

@observer
class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.store = new CurrencyStore();
    this.state = {
      isHasData: this.store.tableDataTitle,   // 列表没有数据时显示内容
      value: '',     // 模糊搜索value
      focus: false,
      page: this.store.page,       // 显示当前的页面
    }

    this.handleChange = this.handleChange.bind(this);
    this.inputOnBlur = this.inputOnBlur.bind(this);
    this.inputOnFocus = this.inputOnFocus.bind(this);
    this.handleRule = this.handleRule.bind(this);
    this.handleKeydown = this.handleKeydown.bind(this);
    this.handleChangeSearch = this.handleChangeSearch.bind(this);
  }

  componentDidMount() {
    //document.title="币种";
    // 初始化查询列表
    this.store.getCurrencyLst();
  }

  // 新增、编辑
  handleAdd(index, flag) {
    if (flag === 'add') { Object.assign(this.store.currency, {code:'',name:'',sign:'',pricedigit:6,moneydigit:2,pricerount:5,moneyrount:5,description:'',isdefault:0}) }
    if (flag === 'edit') { Object.assign(this.store.currency, this.store.currencys[index]) }
    this.refs.card.show({ index, store: this.store, flag });
    this.store.page = 2;
  }

  // 删除
  handleDelete(index) {
    GlobalStore.showCancelModel('确定删除？', () => {}, this.store.hdDelete.bind(this.store,index, () => {
      this.store.getCurrencyLst();
    }));
  }

  // 设为默认
  handleDefault(index, e) {
    e.preventDefault();
    let _this = this;
    Object.assign(this.store.currency, this.store.currencys[index]);
    GlobalStore.showCancelModel('确定设为默认？', () => {}, _this.store.hdDefault.bind(_this.store,index, () => {
      _this.store.getCurrencyLst();
    }));
  }

  // 模糊搜索
  handleChangeSearch(e) {
    e.preventDefault();
    let val = this.state.value;
    const str = val.toString();
    this.store.handleSearch($.trim(str));
  }

  // 获得焦点
  inputOnFocus(){
    this.setState({ focus: true });
  }

  // 失去焦点
  inputOnBlur(){
    this.setState({ focus: false });
  }

  // 文本框变化事件
  handleChange(e) {
    e.preventDefault();
    this.setState({value:e.target.value});
  }

  // 回车事件
  handleKeydown(event) {
    if(event.keyCode==13) {
      this.handleChangeSearch(event);
    }
  }

  // 前端转换规则
  handleRule(param) {
    switch(param){
      case 0:
       return  param = '全部舍位';
        break;
      case 1:
        return param = '全部进位';
        break;
      default:
        return param = '四舍五入';
    }
  }


  render() {
    return(
        <div>


      <div className={this.store.page == 1 ? 'ledger' :'hidden'}>
        <div className="head">
          <div className="head-l fl">
            <div className="currency-input">
              <input type="text"
                     className="form-control"
                     placeholder="请输入搜索内容"
                     onBlur={ ::this.inputOnBlur }
                     onFocus={ ::this.inputOnFocus }
                     onChange={this.handleChange}
                     onKeyDown={this.handleKeydown}
                     value={this.state.value}/>
              <span className="search-icon" onClick={this.handleChangeSearch}></span>
            </div>
          </div>
          <div className="head-r fr noprint">
            <button className="btn btn-primary" onClick={this.handleAdd.bind(this, -1, 'add')}>添加</button>
          </div>
        </div>

        <div className="currency-grid">
          <table className="table">
            <thead>
            <tr>
              <th>币种</th>
              <th>币种简称</th>
              <th>币种符号</th>
              <th>单价精度</th>
              <th>金额精度</th>
              <th>单价进价</th>
              <th>金额进价</th>
              <th>操作</th>
            </tr>
            </thead>
            <tbody>
            {
              this.store.currencys.length > 0 ?
              this.store.currencys.map((value, index) =>
                (<tr key={index}>
                  <td>{value.code}</td>
                  <td>{value.name}</td>
                  <td>{value.sign}</td>
                  <td>{value.pricedigit}</td>
                  <td>{value.moneydigit}</td>
                  <td>{this.handleRule(value.pricerount)}</td>
                  <td>{this.handleRule(value.moneyrount)}</td>
                  <td>
                    <button className="btn btn-operate mr10" onClick={this.handleDelete.bind(this, index)}>删除</button>
                    <button className="btn btn-operate mr10" onClick={this.handleAdd.bind(this, index, 'edit')}>编辑</button>
                    {
                      /*value.isdefault==1 ? '': <button className="btn btn-operate" onClick={this.handleDefault.bind(this, index)}>设为默认</button>*/
                    }

                    {
                      /* <span title="编辑" className="iconfont icon-edit" onClick={this.handleAdd.bind(this, index, 'edit')} aria-hidden="true" />
                       <span title="删除" className="iconfont icon-delete" onClick={this.handleDelete.bind(this, index)} aria-hidden="true" />
                       <span title="设为默认" className="iconfont icon-copy"onClick={this.handleDelete.bind(this, index)} aria-hidden="true" />*/
                    }
                  </td>
                </tr>)
              )
            : (<tr><td colSpan="8" style={{textAlign:"center"}}>{this.state.isHasData}</td></tr>)
            }
            </tbody>
          </table>
        </div>

        {
          // <CurrencyCard ref="card" store={this.store} />
        }

      </div>
      <div className={this.store.page == 2 ? '':'hidden'}>
         <CurrencyList  ref="card" store={this.store} />
      </div>
        </div>
    )
  }
}

export default Currency;
