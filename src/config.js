// 常量
function GetQueryString(name) {
    let reg = new RegExp(`(^|&)${name}=([^&]*)(&|$)`);
    let r = window.location.search.substr(1).match(reg);
    if (r != null) return unescape(r[2]);
    return null;
}

// 版本号,每次正式发版,需要手动增加此版本号,要不IFrame里会产生页面缓存
const VERSION = `0.1.107${__webpack_hash__}` ? __webpack_hash__ : '';
let dotest = GetQueryString('dotest');
dotest = dotest == null ? '' : `&dotest=${dotest}`;


//const serverUrl = 'http://127.0.0.1:8080';

//  iuap
let Config = {
    VERSION,
    // 币种
    currency: {
        query: '/bd/currencys/list',             // 查询
        add: '/bd/currencys/save',               // 新增
        edit: '/bd/currencys/update',            // 编辑
        delete: '/bd/currencys/delete',          // 删除
        search: '/bd/currencys/search',          // 模糊搜索
        setDefault: '/bd/currencys/setDefault',  // 设为默认
        currencyRef: '/bd/currencys/refData'     // 币种参照
    }
};

export default Config;
