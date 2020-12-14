# 未来荧黑·未來熒黑·ヒカリ角ゴ·Wêlai Glow Sans

[English](docs/README-en.md) | [繁體中文](docs/README-hant.md) | [日本語](docs/README-ja.md)

![未来荧黑](tests/glow.png)

未来荧黑是一个基于[思源黑体](https://github.com/adobe-fonts/source-han-sans)、[Fira Sans](https://github.com/mozilla/Fira) 和 [Raleway](https://github.com/impallari/Raleway) 的开源字体项目，支持简体中文、繁体中文与日文；思源黑体的 7 字重被扩展为 9 字重，并提供了宽度系列，全家族共 44 款字体。

相比于思源黑体，未来荧黑的造型更加简明现代，版面效果清新轻快。未来荧黑的中宫与字面更加收敛，重心在字重之间经过了重新配置；笔画细节上处理得更加干净，简洁而平直化。您可以下载[样张](tests/family-specimen.pdf)来预览未来荧黑的设计。

未来荧黑的实现介于参数化与轮廓滤镜，使用了图像处理算法对字形建模。字体的制作并没有借助字体设计软件，而是用一个 Web 实现的[可视化调参工具](https://welai.github.io/glow-sans)来确定字体参数。

## 下载

版本更新与下载链接会更新在 [Release 发布页](https://github.com/welai/glow-sans/releases)。如果您使用 `macOS` 操作系统，可以用 [Homebrew](https://brew.sh/) 包管理器来安装未来荧黑，如简体中文版的字体：

```shell
brew tap homebrew/cask-fonts
brew install --cask font-glow-sans-sc-compressed font-glow-sans-sc-condensed font-glow-sans-sc-extended font-glow-sans-sc-normal font-glow-sans-sc-wide
```

## 国内镜像

本仓库[在 Gitee 上有镜像](https://gitee.com/celestialphineas/glow-sans)，以加速国内的访问，特别是[在线演示](https://celestialphineas.gitee.io/glow-sans)的访问体验将极大提升。

## 在线演示

我们为未来荧黑开发了一个[在线演示](https://welai.github.io/glow-sans)，同时它是未来荧黑修改字体参数的可视化交互环境。你可以在这里通过改变各种参数来修改文字样貌，导出的参数可用于字体构建。

## 与思源黑体有何不同？

![未来荧黑](tests/diff.png)

## FAQ

* **Q:** 可以免费商用吗？
* **A:** 可以。
* **Q:** 这是可变字体吗？
* **A:** 不是。未来荧黑是通过在思源黑体上形变来改变字形形态、拓展家族的，思源黑体没有发布可变版本，我们也无从恢复其母版数据。但是不排除在未来有封装成有宽度轴的可变字体的可能性。你可以玩一玩我们的 [demo](https://welai.github.io/glow-sans)，来更加直观地看到形变是如何实现的。
* **Q:** 支持韩文吗？
* **A:** 不支持。以后的版本可能会提供韩文支持。
* **Q:** 曲线质量似乎不高啊？
* **A:** 因为形变算法并不完美。未来荧黑的目标仅仅是提供一个开源替代品，来弥补免费可商用中文字体的一个缺口，提供可用性上的便利。当然，提升输出曲线质量仍然是本项目的一个技术指标。
* **Q:** 某一个字的问题很严重，可以手工修复吗？
* **A:** 没有这个打算，但是如果现象普遍的话，会去修改算法。Pull requests are welcomed.
* **Q:** 有 TTF 版本吗？
* **A:** 目前没有，可能下个版本会有。
* **Q:** 为什么有的思源黑体支持的字在未来荧黑不支持？
* **A:** 这些字符在宽度系列的处理上存在着很大难度，因此被暂时剔除了，例如“Enclosed CJK Letters And Months”。此外，暂时不支持 `ccmp`，并不计划支持中日韩语言的 `locl` 特性。

如果您还有其他问题或反馈，欢迎到 [Issues](https://github.com/welai/glow-sans/issues) 里面提出。

## 构建

未来荧黑的构建完全使用代码来完成，请阅读[构建说明](docs/build-instructions.md)来了解如何构建字体与在线演示。

## 许可证

© 2020 Project Wêlai

开发者：[Celestial Phineas](https://github.com/celestialphineas)

字体文件以 [SIL Open Font License 1.1](OFL.txt) 发布，此仓库中构建字体开发的代码以 [MIT License](LICENSE) 发布。

## 鸣谢

感谢诸位对项目的支持与帮助！（贡献者以 ID 字母序排列）

[@cathree3](https://github.com/cathree3), [@floating-cat](https://github.com/floating-cat), [@khsacc](https://github.com/khsacc), [@merrickluo](https://github.com/merrickluo), [@sgalal](https://github.com/sgalal), [@singularitti](https://github.com/singularitti)

## 链接

欢迎访问[浙江大学科技设计创新创业实验室](http://www.next.zju.edu.cn)。如果你对活字字体设计 (type design)、动态文字设计 (kinetic typography)、汉字书法与篆刻艺术有丰富知识、浓厚兴趣或独到见解，并希望从事与之相关的算法、开发与设计工作，欢迎你加入我们。对汉字历史变迁、设计方法或艺术理论与表现手法有着深入理解，能够去深入思考未来的文字设计，对使用深度学习的计算机视觉领域有所实践，图形学基础扎实，擅长 Web 或 App 开发的同学，都可能会成为我们的伙伴。详情咨询请致信本项目的作者 [Celestial Phineas](https://github.com/celestialphineas): celestialphineas [AT] outlook [DOT] com。
