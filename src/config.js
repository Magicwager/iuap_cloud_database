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


const serverUrl = '127.0.0.1:80'

//  iuap
let Config = {
    VERSION,
    serverUrl,
    // 币种
    currency: {
        query: `${serverUrl}/webCurrency/getBillType`,  // 查询
        add: `${serverUrl}/webCurrency/getAddType`,     // 新增
        edit: `${serverUrl}/webCurrency/getEditType`,   // 编辑
        delete: `${serverUrl}/webCurrency/getDelType`  // 删除
    }
};

export default Config;
