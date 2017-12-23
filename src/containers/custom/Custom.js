/*
 * 定义自定义项
 * dangwei@yonyou.com
 */
import React from 'react';
import {observer} from 'mobx-react';
import {Link} from 'react-router';

//import GlobalStore from '../../stores/GlobalStore';
//import CustomList from './CustomList';
import CustomStore from '../../stores/custom/CustomStore';


@observer
class Custom extends React.Component {
  constructor(props) {
    super(props);
    this.store = new CustomStore();
    this.state = {}
  }

  componentDidMount() {
    document.title = "自定义项";
    this.store.getDocs();
  }



  render() {
    return (
      <div className="currency-content container-fluid" style={{'paddingBottom': '0'}}>
        <div className="currency-title custom-title">
          定义自定义项的项目
        </div>
        <div className="custom-row">
          {this.store.docustoms.map((item, index) => {
            return (
              <div key={index} className="col-5">
                <div className="custom-co">
                  <div className="cusom-t"><img src={item.src} alt=""/></div>
                  <Link to={"/customlist/"+item.doctype}
                        className={item.subDoccustom.length>0 ? 'btn-custom custom-pc1':"btn-custom custom-pc"}>{item.name}</Link>
                  {item.subDoccustom.length > 0 ? item.subDoccustom.map((value, index) => {
                    return ( <Link key={index} to={"/customlist/"+value.doctype}
                                   className="btn-custom custom-pt1">{value.name}</Link>)
                  }) : ''}
                  <button
                    className={item.subDoccustom.length>0 ? "btn btn-primary custom-btop" :"btn btn-primary custom-bto"}>
                    配置显示
                  </button>
                </div>
              </div>)
          })}
        </div>
      </div>
    )
  }
}

export default Custom;