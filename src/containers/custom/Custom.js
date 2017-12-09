/*
* 定义自定义
* dangwei@yonyou.com
*/

import React from 'react';
import {observer} from 'mobx-react';

import GlobalStore from '../../stores/GlobalStore';
import CurrencyList from './CurrencyList';
import CurrencyStore from '../../stores/currency/CurrencyStore';


@observer
class Custom extends React.Component {
    constructor(props) {
        super(props);
        this.store = new CurrencyStore();
        this.state = {
            isHasData: this.store.tableDataTitle,   // 列表没有数据时显示内容
            value: '',     // 模糊搜索value
            focus: false
        }

    }

    render() {
        return(
            <div>

            </div>
        )
    }
}

export default Custom;