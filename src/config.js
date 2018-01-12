// 不同的环境对应不同的接口
const serverURL01 = '/bd';             // 币种
const serverURL02 = '/ext';            // 自定义项
const serverURL03 = '/basedoc-mc';     // 管控模式

// 基础数据
let Config = {
  // 币种
  currency: {
    query: `${serverURL01}/currencys/list`,             // 查询
    add: `${serverURL01}/currencys/save`,               // 新增
    edit: `${serverURL01}/currencys/update`,            // 编辑
    delete: `${serverURL01}/currencys/delete`,          // 删除
    search: `${serverURL01}/currencys/search`,          // 模糊搜索
    setDefault: `${serverURL01}/currencys/setDefault`,  // 设为默认
    currencyRef: `${serverURL01}/currencys/refData`     // 币种参照
  },
  // 自定义项
  custom: {
    query: `${serverURL02}/bd/attr/extendFields`,             // 查询
    add: `${serverURL02}/bd/attr/extendField`,                // 新增
    edit: `${serverURL02}/bd/attr/extendField/`,              // 编辑
    delete: `${serverURL02}/bd/attr/extendField/`,            // 删除
    queryDocs: `${serverURL02}/bd/attr/doccustoms`,           // 查询所有的自定义项目
  },
  // 管控模式
  manage: {
    query: `${serverURL03}/manage/listorgsettings`,           // 获取所有行政组织管控设置
    addSave: `${serverURL03}/manage/save`,                    // 添加管控
  }
}

export default Config;
