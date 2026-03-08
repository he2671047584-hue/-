
# 本草智库 (BenCao AI)

这是一个基于 Node.js, React 和 Google Gemini API 的中医药知识科普平台。

## 📂 项目结构

*   `root/` (根目录)
    *   `.env`: **[必须新建]** 存放 API Key
    *   `package.json`: 前端依赖
    *   `tsconfig.json`: TypeScript 配置
    *   `vite.config.ts`: 前端配置 (含代理)
    *   `index.html`: 网页入口
    *   `src/`: 前端源代码
    *   `server/`: 后端源代码
        *   `index.js`: 后端入口
        *   `data.js`: 数据文件

## 🛠 第一次运行前的安装

请确保已安装 [Node.js](https://nodejs.org/).

1.  **配置 API Key**:
    在项目**根目录**下新建 `.env` 文件，内容如下：
    ```env
    API_KEY=你的_GEMINI_API_KEY
    ```

2.  **安装依赖**:
    打开终端（命令行），分别安装前端和后端的依赖。

    *   **根目录依赖 (前端)**:
        ```bash
        npm install
        ```
    *   **后端依赖**:
        ```bash
        cd server
        npm install
        cd ..  # 回到根目录
        ```

## 🚀 启动项目 (开发模式)

你需要打开两个终端窗口，分别启动后端和前端。

### 1. 启动后端 (Terminal 1)
```bash
cd server
npm start
```
> 成功时显示: `✅ 本草智库后端服务器已启动`

### 2. 启动前端 (Terminal 2)
确保在根目录：
```bash
npm run dev
```
> 按住 Ctrl 点击终端显示的链接 (例如 http://localhost:5173) 即可打开网页。

## ✨ 主要功能

1.  **本草检索**: 查找中药材的详细信息、性味归经。
2.  **体质检测**: 简单的问卷测试，判断中医体质类型，并保存记录到后端。
3.  **智能问诊**: 基于 Gemini AI，模拟老中医进行对话。
4.  **用户管理**: 登录用户名为 `admin` 时，可进入后台管理用户。
