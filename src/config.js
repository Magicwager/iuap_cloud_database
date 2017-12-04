
// 基础数据
let Config = {
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
