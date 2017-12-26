/*
 *  定义自定义项 列表页
 *  dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Pagination} from 'react-bootstrap';

import CustomListAddOrEdit from '../../components/custom/CustomListAddOrEdit';
import Utils from '../../components/utils';
import moment from 'moment';

import GlobalStore from '../../stores/GlobalStore';
import CustomStore from '../../stores/custom/CustomStore';

@observer
class CustomList extends React.Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {
      isHasData: this.store.tableDataTitle,   // 列表没有数据时显示内容
      activePage: 1,  // 分页当前页
      totalPage: 1,   // 分页总页数
    }

    this.handlePagination = this.handlePagination.bind(this);
    this.onChangeDoctype = this.onChangeDoctype.bind(this);
    this.onChangeType = this.onChangeType.bind(this);
  }

  componentWillMount() {
    const itemPerPage = this.store.pageNumber;
    let _this = this;

    // 自定义下的查询类型
    let queryType = this.props.routeParams.id;

    // 初始化查询
    _this.store.getCustomList({startIndex:1, itemPerPage: itemPerPage, queryType: queryType}, (data) => {
      // 存储当前页的值
      _this.store.activePageSize = 1;

      _this.setState({
        totalPage: data.totalPages,
        activePage: 1
      });
    });

  }

  componentDidMount() {
    document.title = "自定义项";
  }

  // 分页
  handlePagination(nextPage, event) {
    event.preventDefault();
    let _this = this;
    const itemPerPage = _this.store.pageNumber;
    // 自定义下的查询类型
    let queryType = this.props.routeParams.id;

    _this.store.getCustomList({startIndex:nextPage, itemPerPage: itemPerPage, queryType: queryType}, () => {
      _this.store.activePageSize = nextPage;
      _this.setState({
        activePage: nextPage
      });
    });
  }

  // 新增、编辑
  handleAdd(index, flag) {
    if (flag === 'add') {
      Object.assign(this.store.custom,{"name":"","type":"","doctype":"","attrlength":"","attrprecision":"","creator":"","creationtime":"","modifier":"","modifiedtime":""});
      Object.assign(this.store.custom, {'attrlength': '256', 'attrprecision': '0'});
      this.store.precisionNULL = true;
      this.store.lengthNull = false;
    }
    if (flag === 'edit') {
      let currentData = this.store.customs[index];
      Object.assign(this.store.custom,{"id":currentData.id,"name":currentData.name,"type":currentData.type,"doctype":currentData.doctype,"attrlength":currentData.attrlength,"attrprecision":currentData.attrprecision,"creator":currentData.creator,"creationtime":moment(currentData.creationtime).format("YYYY-MM-DD"),"modifier":currentData.modifier,"modifiedtime":moment(currentData.modifiedtime).format("YYYY-MM-DD")});
      this.onChangeDoctype(currentData.doctype);
      this.onChangeType(currentData.type);
    }
    
    this.refs.customcard.show({index, store: this.store, flag});
    this.store.page = 2;
  }

  // 引用档案类型 切换事件
  onChangeDoctype(param) {
    switch (param) {
      case "adminorg":
        return Object.assign(this.store.instancefileValue,{'code':'adminorg','name':'行政组织'});
        break;
      case "staff":
        return Object.assign(this.store.instancefileValue,{ 'code':'staff','name':'员工'});
        break;
      case "supplier":
        return Object.assign(this.store.instancefileValue,{'code':'supplier','name':'供应商'});
        break;
      case "supplierbkAccount":
        return Object.assign(this.store.instancefileValue,{'code':'supplierbkAccount','name':'供应商银行账号'});
        break;
      case "customer":
        return Object.assign(this.store.instancefileValue,{'code':'customer','name':'客户'});
        break;
      case "customerbkAccount":
        return Object.assign(this.store.instancefileValue,{'code':'customerbkAccount','name':'客户银行账号'});
        break;
      case "materials":
        return Object.assign(this.store.instancefileValue,{'code':'materials','name':'物料'});
        break;
      case "project":
        return Object.assign(this.store.instancefileValue,{'code':'project','name':'项目'});
        break;
      default:
        break;
    }
  }

  // 数据类型 切换事件
  onChangeType(value) {
    switch (value) {
      case '字符串':
        Object.assign(this.store.custom, {'attrlength': '256', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = false;
        break;
      case '整数':
        Object.assign(this.store.custom, {'attrlength': '8', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = false;
        break;
      case '数值':
        Object.assign(this.store.custom, {'attrlength': '8', 'attrprecision': '2'});
        this.store.precisionNULL = false;
        this.store.lengthNull = false;
        break;
      case '布尔类型':
        Object.assign(this.store.custom, {'attrlength': '1', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case '日期':
        Object.assign(this.store.custom, {'attrlength': '0', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case '日期时间':
        Object.assign(this.store.custom, {'attrlength': '0', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case '自定义档案':
        Object.assign(this.store.custom, {'attrlength': '36', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      case '基本档案':
        Object.assign(this.store.custom, {'attrlength': '36', 'attrprecision': '0'});
        this.store.precisionNULL = true;
        this.store.lengthNull = true;
        break;
      default:
        break;
    }
  }
  
  // 删除
  doDelete(index, event) {
    GlobalStore.showCancelModel('确定要删除这条信息吗？', () => { },() => {
      this.store.handleDelete(index, () => {
        this.handlePagination(this.store.activePageSize, event);
      });
    });
  }

  render() {
    return (
      <div className="container-fluid" style={{'height':'100%'}}>
        <div className={this.store.page=='1'?'database-container':'hidden'} style={{'height':'100%'}}>
          <div className="head">
            <div className="head-r fr">
              <button className="btn btn-primary mr15" onClick={this.handleAdd.bind(this, -1, 'add')}>添加</button>
              <button className="btn btn-primary">配置显示</button>
            </div>
          </div>
          <div className="currency-content container-fluid">
            <div className="currency-grid" style={{'marginLeft':'-15px','marginRight':'-15px'}}>
              <table className="table" style={{'borderTop': 'none', 'borderLeft': 'none', 'borderRight':'none'}}>
                <thead>
                <tr>
                  <th style={{'width':'9%'}}>名称</th>
                  <th style={{'width':'9%'}}>数据类型</th>
                  <th style={{'width':'9%'}}>引用档案</th>
                  <th style={{'width':'9%'}}>输入长度</th>
                  <th style={{'width':'9%'}}>精度</th>
                  <th style={{'width':'9%'}}>创建人</th>
                  <th style={{'width':'9%'}}>创建日期</th>
                  <th style={{'width':'9%'}}>最后修改人</th>
                  <th style={{'width':'9%'}}>最后修改日期</th>
                  <th style={{'width':'19%'}}>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                  this.store.customs.length > 0 ?
                    this.store.customs.map((value, index) =>
                      (<tr key={'custom-'+index}>
                        <td title={value.name}>{value.name}</td>
                        <td title={value.type}>{value.type}</td>
                        <td title={value.doctype}>{value.doctype}</td>
                        <td title={value.attrlength}>{value.attrlength}</td>
                        <td title={value.attrprecision}>{value.attrprecision}</td>
                        <td title={value.creator}>{value.creator}</td>
                        <td title={Utils.formatDate(value.creationtime)}>{Utils.formatDate(value.creationtime)}</td>
                        <td title={value.modifier}>{value.modifier}</td>
                        <td title={Utils.formatDate(value.modifiedtime)}>{Utils.formatDate(value.modifiedtime)}</td>
                        <td>
                          <button className="btn btn-operate mr10" onClick={this.doDelete.bind(this, index)}>删除</button>
                          <button className="btn btn-operate" onClick={this.handleAdd.bind(this, index, 'edit')}>编辑</button>
                        </td>
                      </tr>)
                    )
                    : (<tr><td colSpan="10" style={{textAlign:"center"}}>{this.state.isHasData}</td></tr>)
                }
                </tbody>
              </table>
              <div className='database-pagination'>
                {this.store.customs.length > 0 ?  <Pagination
                  prev
                  next
                  first={false}
                  last={false}
                  boundaryLinks
                  ellipsis
                  items={this.state.totalPage}
                  maxButtons={5}
                  activePage={this.state.activePage}
                  onSelect={this.handlePagination}
                />:''}
              </div>
            </div>
          </div>
        </div>
        <div className={this.store.page == 2 ? '':'hidden'}>
          <CustomListAddOrEdit ref='customcard' store={this.store} handlePagination={this.handlePagination} onChangeType={this.onChangeType}/>
        </div>
      </div>
    )
  }
}

export default CustomList;
