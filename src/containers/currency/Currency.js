/*
 *  币种
 *  dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import numeral  from 'numeraljs';
import GlobalStore from '../../stores/GlobalStore';

import CurrencyCard from './CurrencyCard';
import CurrencyStore from '../../stores/currency/CurrencyStore';

@observer
class Currency extends React.Component {
  constructor(props) {
    super(props);
    this.store = new CurrencyStore();
    this.state = {
      isEdit: true,  // 操作列是否显示
      isHasData: this.store.tableDataTitle
    }
  }

  componentDidMount() {
    document.title="币种";
    // 初始化查询列表
    this.store.getCurrencys();
  }

  // 新增、编辑
  handleAdd(index, flag) {
    if (flag === 'add') { Object.assign(this.store.currency, { code: '', name: '', parent: { id: '', code: '', name: '' }, system: false, description: ''}) }
    if (flag === 'edit') { Object.assign(this.store.currency, this.store.currencys[index]) }
    this.refs.card.show({ index, store: this.store, flag });
  }

  // 删除
  handleDelete(index) {
    GlobalStore.showCancelModel('确定删除？', () => {}, this.store.hdDelete.bind(this.store,index, () => {
      this.store.getCurrencys();
    }));
  }


  render() {
    return(
      <div className="ledger">
        <div className="header">
          <div className="header-title">
            <span>币种</span>
          </div>
        </div>
        <div className="head">
          <div className="head-l fl">
            <div className="currency-input">
              <input type="text" placeholder="请输入搜索内容" className="form-control"/>
              <span className="search-icon"></span>
            </div>
          </div>
          <div className="head-r fr noprint">
            <button className="btn btn-primary" onClick={this.handleAdd.bind(this, -1, 'add')}>添加</button>
          </div>
        </div>

        <div className="ssc-grid">
          <table className="table">
            <thead>
            <tr>
              <th>币种</th>
              <th>币种简称</th>
              <th>币种符号</th>
              <th>单价精度</th>
              <th>金额精度</th>
              <th>单位进价</th>
              <th>金额进价</th>
              <th className="noprint" >操作</th>
            </tr>
            </thead>
            <tbody>
            {
              this.store.currencys.length > 0 ?

              this.store.currencys.map((value, index) =>
                (<tr key={index}>
                  <td>{numeral(value.code).format('0,0.00')}</td>
                  <td>{value.name}</td>
                  <td>{value.parentid ? value.parentid.name : ''}</td>
                  <td>{value.system == true ? '是' : '否'}</td>
                  <td>{value.parentid ? value.parentid.name : ''}</td>
                  <td>{value.system == true ? '是' : '否'}</td>
                  <td>{value.description}</td>

                  {
                    this.state.isEdit ?
                      <td className="noprint" >
                        <span title="编辑" className="iconfont icon-edit" onClick={this.handleAdd.bind(this, index, 'edit')} aria-hidden="true" />
                        <span title="删除" className="iconfont icon-delete"  onClick={this.handleDelete.bind(this, index)} aria-hidden="true" />
                        <span title="设为默认" onClick={this.handleDelete.bind(this, index)} aria-hidden="true">设为默认</span>
                      </td> :
                      <td className="noprint">
                      </td>
                  }
                </tr>)
              )
            : (<tr><td colSpan="8" style={{textAlign:"center"}}>{this.state.isHasData}</td></tr>)
            }
            </tbody>
          </table>
        </div>

        <CurrencyCard ref="card" store={this.store} />
       </div>
    )
  }
}

export default Currency;
