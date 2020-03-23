# 未來熒黑·未来荧黑·ヒカリ角ゴ·Wêlai Glow Sans

![未來熒黑](../tests/glow.png)

未來熒黑是一個基於[思源黑體](https://github.com/adobe-fonts/source-han-sans)、[Fira Sans](https://github.com/mozilla/Fira)和[Raleway](https://github.com/impallari/Raleway)的開源字體專案，支持簡體中文、繁體中文與日文；思源黑體的7字重被擴展為9字重，並提供了寬度系列，全家族共44款字型。未來熒黑繁體中文版的漢字部分係改造自思源黑體韓文版，以更接近傳統印刷習慣。

相比於思源黑體，未來熒黑的造型更加簡明現代，版面效果清新輕快。未來熒黑的中宮與字面更加收斂，重心在字重之間經過了重新配置；筆畫細節上處理得更加幹練，簡潔而平直化。您可以下載[樣張](../tests/family-specimen.pdf)來預覽未來熒黑的設計。

未來熒黑的實現介於參數化與輪廓濾鏡，使用了圖像處理算法對字形建模。字體的製作並沒有借助字型設計軟件，而是用一個Web實現的[可視化調參工具](https://welai.github.io/glow-sans)來確定字型參數。

## 下載

版本更新與下載鏈接會更新在[Release發佈頁](https://github.com/welai/glow-sans/releases)。

## 線上演示

我們為未來熒黑開發了一個[線上演示](https://welai.github.io/glow-sans)，同時它是未來熒黑修改字型參數的可視化交互環境。你可以在這里透過改變各種參數來修改文字樣貌，導出的參數可用於字型構建。

## 與思源黑體有何不同？

![未來熒黑](../tests/diff.png)

## FAQ

* **Q:** 可以商用嗎？
* **A:** 可以。
* **Q:** 這是可變字體嗎？
* **A:** 不是。未來熒黑是透過在思源黑體上形變來改變字形形態、拓展家族的，思源黑體沒有發佈可變版本，我們也無從恢復其母版數據。但是不排除在未來有封裝成有寬度軸的可變字體的可能性。你可以玩一玩我們的[demo](https://welai.github.io/glow-sans)，來更加直觀地看到形變是如何實現的。
* **Q:** 支持韓文嗎？
* **A:** 不支持。以後的版本可能會提供韓文支持。
* **Q:** 曲線質量似乎不高啊？
* **A:** 因為形變算法並不完美。未來熒黑的目標僅僅是提供一個開源替代品，來彌補免費可商用中文字形中的一個缺口，提供可用性上的便利。當然，提升輸出曲線質量是本專案的一個技術目標。
* **Q:** 某一個字的問題很嚴重，可以手工修復嗎？
* **A:** 沒有這個打算，但是如果現象普遍的話，會去修改算法。 Pull requests are welcomed.

## 構建

未來熒黑的構建完全使用代碼來完成，請閱讀[構建說明](build-instructions.md)來了解如何構建字型與demo。

## 許可證

© 2020 Project Wêlai

開發者：[Celestial Phineas](https://github.com/celestialphineas)

字型文件以[SIL Open Font License 1.1](../OFL.txt)發佈，此repo中構建字型開發的代碼以[MIT License](../LICENSE)發佈。

## 鏈接

* 歡迎訪問[浙江大學科技設計創新創業實驗室](http://www.next.zju.edu.cn)。如果你對字型設計（type design）、動態文字設計（kinetic typography）、漢字書法與篆刻藝術有豐富知識、濃厚興趣或獨到見解，並希望從事與之相關的算法、開發與設計工作，歡迎你加入我們。對漢字歷史變遷、設計方法或藝術理論與表現手法有著深入理解，能夠去深入思考未來的文字設計，對使用深度學習的計算機視覺領域有所實踐，圖形學基礎紮實，擅長Web或App開發的同學，都可能會成為我們的夥伴。詳情諮詢請致信本專案作者[Celestial Phineas](https://github.com/celestialphineas)：celestialphineas [AT] outlook [DOT] com
