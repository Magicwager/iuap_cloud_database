/*
 *  定义自定义项 列表页
 *  dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Pagination} from 'react-bootstrap';

import CustomListAddOrEdit from '../../components/custom/CustomListAddOrEdit';
import Utils from '../../components/utils';

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
      totalPage:'',   // 分页总页数
    }

    this.handlePagination = this.handlePagination.bind(this);
  }

  componentWillMount() {
    const itemPerPage = this.store.pageNumber;
    let _this = this;

    // 初始化查询
    _this.store.getCustomList({startIndex:1, itemPerPage: itemPerPage}, (data) => {
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

    _this.store.getCustomList({startIndex:nextPage, itemPerPage: itemPerPage}, () => {
      _this.store.activePageSize = nextPage;

      _this.setState({
        activePage: nextPage
      });
    });

  }

  // 新增、编辑
  handleAdd(index, flag) {
    if (flag === 'add') {
      Object.assign(this.store.custom,{"name":"","type":"String","doctype":"staff","attrlength":"","attrprecision":"","creator":"","creationtime":"","modifier":"","modifiedtime":""})
    }
    if (flag === 'edit') {
      let currentData = this.store.customs[index];
      Object.assign(this.store.custom,{"id":currentData.id,"name":currentData.name,"type":currentData.type,"doctype":currentData.doctype,"attrlength":currentData.attrlength,"attrprecision":currentData.attrprecision,"creator":currentData.creator,"creationtime":currentData.creationtime,"modifier":currentData.modifier,"modifiedtime":currentData.modifiedtime});
    }
    
    this.refs.customcard.show({index, store: this.store, flag});
    this.store.page = 2;
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
      <div>
        <div className={this.store.page=='1'?'u-container':'hidden'}>
          <div className="head">
            <div className="head-r fr">
              <button className="btn btn-primary mr15" onClick={this.handleAdd.bind(this, -1, 'add')}>添加</button>
              <button className="btn btn-primary">配置显示</button>
            </div>
          </div>
          <div className="currency-content container-fluid">
            <div className="currency-grid" style={{'marginLeft':'-15px','marginRight':'-15px'}}>
              <table className="table">
                <thead>
                <tr>
                  <th>名称</th>
                  <th>数据类型</th>
                  <th>引用档案</th>
                  <th>输入长度</th>
                  <th>精度</th>
                  <th>创建人</th>
                  <th>创建日期</th>
                  <th>最后修改人</th>
                  <th>最后修改日期</th>
                  <th>操作</th>
                </tr>
                </thead>
                <tbody>
                {
                  this.store.customs.length > 0 ?
                    this.store.customs.map((value, index) =>
                      (<tr key={'custom-'+index}>
                        <td style={{'width':'9%'}} title={value.name}>{value.name}</td>
                        <td style={{'width':'9%'}} title={value.type}>{value.type}</td>
                        <td style={{'width':'9%'}} title={value.doctype}>{value.doctype}</td>
                        <td style={{'width':'9%'}} title={value.attrlength}>{value.attrlength}</td>
                        <td style={{'width':'9%'}} title={value.attrprecision}>{value.attrprecision}</td>
                        <td style={{'width':'9%'}} title={value.creator}>{value.creator}</td>
                        <td style={{'width':'9%'}} title={Utils.formatDate(value.creationtime)}>{Utils.formatDate(value.creationtime)}</td>
                        <td style={{'width':'9%'}} title={value.modifier}>{value.modifier}</td>
                        <td style={{'width':'9%'}} title={Utils.formatDate(value.modifiedtime)}>{Utils.formatDate(value.modifiedtime)}</td>
                        <td style={{'width':'19%'}}>
                          <button className="btn btn-operate mr10" onClick={this.doDelete.bind(this, index)}>删除</button>
                          <button className="btn btn-operate" onClick={this.handleAdd.bind(this, index, 'edit')}>编辑</button>
                        </td>
                      </tr>)
                    )
                    : (<tr><td colSpan="10" style={{textAlign:"center"}}>{this.state.isHasData}</td></tr>)
                }
                </tbody>
              </table>
              <div className='u-pagination'>
                <Pagination
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
                />
              </div>
            </div>
          </div>
        </div>
        <div className={this.store.page == 2 ? '':'hidden'}>
          <CustomListAddOrEdit ref='customcard' store={this.store} handlePagination={this.handlePagination}/>
        </div>
      </div>
    )
  }
}

export default CustomList;
