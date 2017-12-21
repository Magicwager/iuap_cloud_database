// 不同的环境对应不同的接口
const serverURL = '/basedoc';
//const serverURL = '/bd';

// 基础数据
let Config = {
  // 币种
  currency: {
    query: `${serverURL}/currencys/list`,             // 查询
    add: `${serverURL}/currencys/save`,               // 新增
    edit: `${serverURL}/currencys/update`,            // 编辑
    delete: `${serverURL}/currencys/delete`,          // 删除
    search: `${serverURL}/currencys/search`,          // 模糊搜索
    setDefault: `${serverURL}/currencys/setDefault`,  // 设为默认
    currencyRef: `${serverURL}/currencys/refData`     // 币种参照
  },
  // 定义自定义项
  custom: {
    query: `${serverURL}/basedoc/bd/attr/extendFields`,             // 查询
    add: `${serverURL}/basedoc/bd/attr/extendField`,                // 新增
    edit: `${serverURL}/basedoc/bd/attr/extendField/`,              // 编辑
    delete: `${serverURL}/basedoc/bd/attr/extendField/`,            // 删除
    queryDocs: `${serverURL}/basedoc/bd/attr/doccustoms`,           // 查询所有的自定义项目
  }
};

export default Config;
