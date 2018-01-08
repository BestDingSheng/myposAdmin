

关于熟悉MPOS运营管理系统：

	1.SVN拉取代码版本V1.0；

	2.相关知识技术：node、vue、elementUI、sass、JavaScript、Ajax等；

	3.安装所需环境及文件：
		a.安装nodejs环境；
		b.安装淘宝镜像；
		c.安装vue；node安装好之后 npm install vue；
		d.安装elementUI：npm i element-ui -S 参考：http://element.eleme.io/#/zh-CN/component/installation；
		e.安装sass：基于Ruby，先下载安装Ruby，gem install sass、gem install compass
			gem install sass这一步出错：ERROR:  Could not find a valid gem 'sass' (>= 0) in any repository
			解决方法 cmd ： 运行gem sources --add http://gems.ruby-china.org/ --remove https://rubygems.org/  然后再gem install sass 。

	4.项目目录下安装项目所需依赖：npm install；
		vue项目安装依赖npm install  报错：npm ERR! code EINTEGRITY ，原因：缓存问题
		解决办法 ：npm cache verify ；

	5.依赖安装完成之后启动本地服务 ：npm run dev
		报错及解决方案：
		a.cross-env跨平台设置NODE_ENV的问题：报错'NODE_ENV' 不是内部或外部命令，也不是可运行的程序
		或批处理文件。解决方法：安装cross-env:npm install cross-env --save-dev；
		b.常见错误：Error: Cannot find module 'XXX' ，缺少依赖包XXX ，安装就可以了；

	6.服务起完后127.0.0.1:8088连接服务器登录熟悉代码、调试；router.js找到对应的vue文件，common.js配置相关URL的公共server地址；
	熟悉vue实例的生命周期，相关函数；elementUI 的dialog、table等

	