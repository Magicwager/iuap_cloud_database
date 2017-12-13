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
    this.state = {
      customs: [
        {'id':'organ','src': './images/xingzhengzuzhi.png', 'btnOneName': '行政组织', 'btnTwoName': '', 'btnThreeName': '配置显示'},
        {'id':'staff','src': './images/yuangong.png', 'btnOneName': '员工', 'btnTwoName': '', 'btnThreeName': '配置显示'},
        {'id':'supplier','src': './images/gongyingsahng.png', 'btnOneName': '供应商', 'btnTwoName': '银行账号', 'btnThreeName': '配置显示'},
        {'id':'customer','src': './images/kehu.png', 'btnOneName': '客户', 'btnTwoName': '银行账号', 'btnThreeName': '配置显示'},
        {'id':'materiel','src': './images/wuliao.png', 'btnOneName': '物料', 'btnTwoName': '', 'btnThreeName': '配置显示'},
        {'id':'project','src': './images/xiangmu.png', 'btnOneName': '项目', 'btnTwoName': '', 'btnThreeName': '配置显示'}
      ]
    }

  }

  componentDidMount() {
    document.title = "自定义";
  }

  render() {
    return (
      <div className="currency-content container-fluid">
        <div className="currency-title custom-title">
          定义自定义项的项目
        </div>
        <div className="custom-row">
          {this.state.customs.map((item, index) => {
            return (
              <div key={index} className="col-5">
                <div className="custom-co">
                  <div className="cusom-t"><img src={item.src} alt=""/></div>
                  <Link to={"/customlist/"+item.id} className={item.btnTwoName ? 'btn-custom custom-pc1':"btn-custom custom-pc"}>{item.btnOneName}</Link>
                  {item.btnTwoName ? <button className="btn-custom custom-pt1">{item.btnTwoName}</button> : ''}
                  <button className={item.btnTwoName ? "btn btn-primary custom-btop" :"btn btn-primary custom-bto"}>{item.btnThreeName}</button>
                </div>
              </div>)
          })}
        </div>
      </div>
    )
  }
}

export default Custom;