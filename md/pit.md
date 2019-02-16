# 踩坑

## 普通坑
1.awesome-typescript-loader 可以让webpack的entry设置为tsx入口，ts-loader不行
2.node-sass问题 npm rebuild node-sass --force
3.nodeExternals 只能用于服务端渲染时，客户端渲染会报require is not defined
4.服务端渲染要用Koa or Express记得use dist目录
5.服务端渲染慎用 HtmlWebpackPlugin 可能会出现首屏会报require is not defined
6.git config --global core.autocrlf false 关闭git自动转换成crlf
7.npm i npm@latest -g更新最新的npm  npm view xxx versions
8.moment.unix(xxx.created_date)format('YYYY-MM-DD')
9.IE9 只支持256KB左右的CSS文件  bless-webpack-plugin

## antd坑
  1.getFieldDecorator InputNumber小数转科学运算   initValue=>setFormValue  
  2.antd pro 1.0环境变量打包问题
  3.antd pro 2.0设置环境变量需要创建一个env文件，然后在配置里面define环境变量

## 环境坑
  1.windows包管理工具https://chocolatey.org/install
  2.windows安装 python2.7.9+vs2010 express 管理员权限运行npm install --global --production windows-build-tools