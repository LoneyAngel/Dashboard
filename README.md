# 定位
作为next开发的尝试性质的项目
高可定义的个人/群体账单管理服务网站
这个项目让我介绍我怎么介绍？

## 正在进行的工作
- 性能优化


## 架构
为了避免组件重名，这里的client组件末尾同意加上Interactive
- ui
 - page1
    - page1(1)
      - zujian1.tsx
      - zujian1.client.tsx
      - zujian2.tsx
      - zujian2.client.tsx
    - index(2)
### 规范
- 组件命名必须大写字母开头
- 数据获取在server组件完成



## 待处理的其他问题
- 其他登陆模式比如谷歌登录 出现不明错误

## 已经处理的问题
- 状态管理
- 完善的错误处理
- 逻辑绝对完善的“组件”
- 参数类型校验（数据库）
- 搞清楚react页面的重渲染的因素
- 授权和校验
- 数据缓存和预取


### 字体
推荐使用next/font，字体优先使用next/font/google
在global.css中进行定义
通常下载的字体会提供几种不同的文件，比如normal、bold、italic、bolditalic,我们定义对应的字体时也只能与之对应，否则显示效果不太好
所以下次的话可以直接把对应的字体的所有文件以及对应的文件夹直接导进来放在/public/fonts下，因为有tree-shaking的存在，最后不会影响最后的打包的体积，所以随便用

## 确定技术栈
ts 最新稳定版
tailwindcss ^3
next 稳定版
目前没有使用组件库

# tailwindcss
## 文本类
truncate 是 Tailwind CSS 中一个非常实用的工具类（Utility Class），主要用于处理文本过长的问题。
过长显示冒号

# 实践

## 服务器组件的使用不是必须的，使用是为了更快的加载和更安全的数据处理

## 使用url实现输入框和数据table的同步

## 给输入框添加防抖机制

## "use client"的组件的加载和错误状态的处理

## 登录验证
Neon Auth 是一个为 Next.js 应用提供身份验证（Authentication，简称 Auth）功能的服务或库。它旨在简化用户注册、登录、会话管理等复杂的安全相关任务。

## 分小组件的意义
是哲学意义呢还是
小组件不参杂任何的请求操作，尽量只是一个ui组件


## 开发阶段
对于开发阶段中遇到的问题，如果有解决方法先用着，问题可以提出，之后解决
暂时不做错误处理，后续进行统一添加

## "use server" 和 "use client" 的区别
尽可能将数据操作放在服务器组件中
不可避免的通过useAction包装后可以在客户端组件使用
只要这样做了，基本没有问题，有的使用server或者client没有区别
一切为了更好的服务和减少不必要的代码
- next支持服务器组件直接读取路由
"use server" 表单对应的server action,服务器一方的api
"use client" 使用表单的组件，使用浏览器的api的时候，比如usePathname

## key不唯一

解决方案：
- 对于一定会重复的部分，进行字符串拼接，比如简单的直接和index进行拼接
✅ 核心原则：React 的 key 只在「同一个父元素的直接子元素」中要求唯一

## 关于w-full
div默认w-full,但是flex-item默认是w-auto

## 其他建议

- 组件的命名必须是大写字母开头的
- 异步函数必须进行await
- 错误即使打印也必须进行抛出
- 常量和useState创建的变量的使用场景的区别


## 犯错

对于use client需要将异步函数放置在useEffect

### key不唯一

✅ 核心原则：React 的 key 只在「同一个父元素的直接子元素」中要求唯一


# git

## 远程同步开发流程

⭐这套流程能保证远程最新提交和本地开发的冲突问题在本地解决

1.创建功能分支

2.功能分支同步远程 master 的更新（避免落后）
在功能分支
git fetch my-app master
git merge my-app/master

上面的两条命令可以换成
git pull my-app master

3.开发功能分支

4.功能任务完成后，先保证本地 master最新
切换回 master
git checkout master
git pull origin master

5.合并你的功能分支和master到master
git merge feature/login

6. 推送 master 到远程
git push origin master

## 重置本地和远程git历史
以下步骤将帮助你重置本地和远程 Git 仓库的历史记录。请注意，这将永久删除所有现有的提交历史，因此请确保你已经备份了任何重要的数据或代码。
### 1. 备份当前仓库！（重要！）
cp -r ./my-repo ./my-repo-backup

### 2. 切换到主分支（假设是 master）
git checkout master

### 3. 创建一个无历史的新分支
git checkout --orphan fresh-start

### 4. 添加当前所有文件（和你现在的状态一致）
git add .
git commit -m "Initial commit"

### 5. 强制替换原分支（⚠️ 永久丢弃旧历史！）
git branch -D master        # 删除旧 master
git branch -m master        # 将 fresh-start 重命名为 master

### 6. 强制推送到远程（⚠️ 会覆盖远程！所有协作者需重新 clone）
git push -f origin master