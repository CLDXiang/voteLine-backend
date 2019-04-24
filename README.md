# voteLine backend

这是一个《数据库引论》课程项目的后端部分。前端部分在[这里](https://github.com/CLDXiang/voteLine-frontend)。

voteLine backend是一个使用[Node.js](https://nodejs.org/)编写的后端服务器，用于接受前端请求并对数据库进行相应操作。其中数据库交互部分基于[Sequelize](https://github.com/sequelize/sequelize)实现。

## 快速开始

在开始之前，你可能需要安装[Node.js](https://nodejs.org/)。

首先进入你准备存放项目文件的根目录，如`repo`：

```
cd repo
```

下载项目源码：

```
git clone https://github.com/CLDXiang/voteLine-backend.git
cd voteLine-backend
```

配置：

使用VIM或你喜欢的编辑器打开`voteLine-backend/config.js`，修改其中的项目并保存（如果你只是在本地测试，可以直接使用默认配置）：

* port_back: 后端服务器端口号
* port_front: 前端端口号
* port_db: Mysql服务端口号
* schema: 数据库Schema名称
* username: 操作数据库的系统用户名

前端的配置与启动见[voteLine-frontend](https://github.com/CLDXiang/voteLine-frontend)。

安装依赖：

```
npm install
```

开始运行：

```
npm start
```

启动后输入系统用户的密码用于连接数据库。