# 🇯🇵 Kana ja (50音练习)

一个现代化的、交互式的日语 50 音记忆训练工具。专为日语初学者设计，旨在通过肌肉记忆和听觉辅助，快速掌握平假名与片假名。

🔗 **在线体验**: [点击这里开始练习](https://daankey.github.io/kana-ja/)



## ✨ 核心功能 (Features)

* **🔀 智能随机抽题**：算法自动去重，避免连续出现重复卡片。
* **🎧 听/看双模式**：
    * **👀 看模式 (Reading Mode)**：隐藏罗马音，专注于记忆字形，点击发音。
    * **🎧 听模式 (Listening Mode)**：自动播放发音，显示答案，适合磨耳朵。
* **🎹 键盘快捷键**：
    * `Space` (空格)：下一个
    * `Q`：重读发音
    * 解放鼠标，极大提升刷题效率。
* **🔊 原生语音合成**：利用浏览器 Web Speech API 实现标准日语发音 (TTS)。
* **⚡️ 范围与语速控制**：
    * 支持自定义练习行（如只练“あ行”+“か行”）。
    * 支持 0.5x ~ 1.5x 语速调节。
* **🔙 历史记录回溯**：随时查看上一个单词，方便复习和纠错。
* **🎨 现代化 UI**：基于 Tailwind CSS 的玻璃拟态 (Glassmorphism) 设计，带平滑动画。

## 🛠 技术栈 (Tech Stack)

* **Core**: React 18 (Hooks: useState, useEffect, useMemo, useCallback)
* **Build Tool**: Vite
* **Styling**: Tailwind CSS 3
* **Language**: JavaScript (ES6+)
* **Deployment**: GitHub Actions & GitHub Pages
* **Web API**: SpeechSynthesis API (Text-to-Speech)

## 🚀 本地运行 (Run Locally)

如果你想在本地运行这个项目：

1.  **克隆仓库**
    ```bash
    git clone [https://github.com/你的GitHub用户名/kana-renshu.git](https://github.com/daankey/kana-ja)
    cd kana-renshu
    ```

2.  **安装依赖**
    ```bash
    npm install
    ```

3.  **启动开发服务器**
    ```bash
    npm run dev
    ```
