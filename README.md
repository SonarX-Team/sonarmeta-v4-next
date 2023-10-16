本工程由Next.js框架实现。

## 如何安装
```bash
$ git clone ...
$ yarn install

根目录下添加.env.local文件和所有需要的相关环境变量

$ yarn build
$ yarn start (pm2 start yarn)
```

## 如何调试

```bash
$ yarn dev
```

## 如何打包
```bash
$ yarn build
```

## 如何运行
```bash
$ yarn start
```

在本地打开浏览器中访问网址： [http://localhost:3000](http://localhost:3000) 即可看到结果。

## 技术栈

- 继承自Next.js的SSR前端技术
- 继承自Next.js的Server Action后端技术
- 使用Ali OSS的对象存储，深圳节点
- 使用MongoDB和Mongoose的DBMS，MongoDB Atlas
- 部署在腾讯云轻量应用型服务器上海节点上
- IP地址：[101.43.33.37](http://101.43.33.37)
- 域名：en.sonarmeta.com
- 网站地址：[https://en.sonarmeta.com](https://en.sonarmeta.com)


## Next.js官方文档

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
