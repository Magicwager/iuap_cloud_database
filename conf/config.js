module.exports = {
    publishConfig: {
        command: "mvn --settings C:/Users/Dangwei/.maven/apache-maven-3.5.0/conf/settings.xml",
        repositoryId: "iUAP-Snapshots",
        repositoryURL: "http://172.16.51.12:8081/nexus/content/repositories/iUAP-Snapshots/",
        artifactId: "iuap_currency_fe",
        groupId: "com.yonyou.iuap",
        version: "1.0.0-SNAPSHOT"
    },
    serverConfig: {
        serverport: 8888,
        context: '/bd', //当前应用对应的上下文
        isProxyFirst: true, // isProxyFirst : 是否后端代理优先     //true -> 优先使用代理服务器数据，false -> 使用本地模拟数据
        proxyList: [
            /*{
                host: 'http://172.20.18.11:8080',
                context: '/iuap-org-web'
            },
            {
                host: 'http://172.20.18.11:8080',
                context: '/uitemplate_web'
            }*/
            {
                host: 'http://127.0.0.1:8080',
                context: ''
            },
            {
                host: 'http://workbenchdev.yyuap.com',
                context: '/uitemplate_web'
            }
        ], //代理服务器列表
        proxyIgnore: [

        ], //代理忽略的URL列表
        mockList: [
            {
                type: "get",
                url: "/uitemplate_web/uitemplate_rt/rt_ctr/parsetemplate",
                json: ".nc/nc.json"
            }
        ] //模拟请求列表
    }
};
