# かぞえ島 · Kazoe Island · 数数岛

島をめぐって、算数・社会・理科・ことばを「なぜそうなるか」から学ぶ、子ども向けの学習ゲーム（日本語 / English / 中文）。
A learning game for kids (ja / en / zh): maths, social studies, science and words — always starting from *why*.
给孩子的学习游戏（日/英/中）：数学、社会、理科、词语，每样都从“为什么”学起。

**あそぶ / Play / 玩：https://faithpricejp-source.github.io/kazoe-island/**

## アプリとして入れる / Install as an app / 装成 App
- **iPhone・iPad**：Safari で上のリンクを開く →「共有」→「ホーム画面に追加」。アイコンから全画面で開き、オフラインでも遊べます。
  Open the link in Safari → Share → Add to Home Screen. 用 Safari 打开 → 分享 →「添加到主屏幕」。
- **Android**：Chrome で開く → メニュー →「アプリをインストール」/ Install app / 安装应用。
- **Mac**：Releases の `kazoe-island-mac.zip` を解凍して「かぞえ島.app」を開く。署名していないので、はじめて開くときは「システム設定 → プライバシーとセキュリティ → このまま開く」。
  Unzip and open; it is not notarized, so the first time use System Settings → Privacy & Security → Open Anyway. 未公证，首次打开需在“系统设置 → 隐私与安全性 → 仍要打开”。

## 中身 / What’s inside / 内容
| 島 | 内容 |
|---|---|
| 場合の数の島 | かける? たす? を線路で組み立てる・P / C / nʳ・場合分け・余事象・くばる表（Twelvefold Way の6マス）・まとめる/すきま/定序/優先 |
| とっくんの島 | サイコロの表・コインの払い方・リーグ戦とトーナメント戦・選挙の当選ライン（数字は毎回かわる） |
| 図形の島 | 角度のルールカードと補助線・面積（分ける/かこんで引く/等積変形）・図形を数える・展開図（11種類）と塗られた立方体 |
| 分数の島 | 分数のいみ・約分と通分・たし算ひき算・テープ図の文章題 |
| 確率の島 | あたり÷ぜんぶ・2つのサイコロ表・少なくとも1回・実験と大数の法則 |
| 無限の島 | 1/2+1/4+…=1・0.999…=1・ヒルベルトのホテル・1対1対応・カントールの対角線 |
| しゃかいの島 | 地図の読み方（方位・地図記号・縮尺・等高線）・国土・気候と雨温図・地方と人口・米/野菜/くだもの/魚・寒い土地のくらし。7つの「しくみ」カードと、知らない場所に使う問題 |
| りかの島 | 電気・磁石・光・太陽とかげ・地面と空気のあたたまり方・月・星・川。傾いて自転する3Dの地球と月の満ち欠け |
| 白地図の島 | 都道府県と県庁所在地・山地と山・平野と盆地・川・半島と湾・湖と島・都市を、本物の形の地図で |
| ことばの島 | ことわざ・慣用句・故事成語と、読むときによく出ることば。意味だけでなく、由来や漢字の分け方で「なぜその意味か」 |
| こうぼう | 画板・えのぐ研究所・九連環・ひみつ箱・はんが・きりがみ・ひかりのランプ・とびだすカード・組木（ほかの島で学んだことがカギになる） |

## あそびかた / Game layer / 玩法
- 🌾 のはら：島のなかまが あそびに来る。いっしょに問題をとくと、なかよしゲージがたまって ともだちになれる。
- 🧺 はたけ：まちがえた問題やヒントを使った問題が たねになる。1日1回 水やり（にた問題をとく）、3回でしゅうかく。お休みしても かれない。
- 🏪 どんぐり商店・🪴 島をかざる・📮 ポスト・🏠 おうち：どんぐりで家具を買って島におく。島のなかまから手紙がとどく。島は本当の時間で朝・夕方・夜、月ごとに季節がかわる。
- Island friends come to play in the meadow — solve problems together to become friends; a farm where missed problems grow back as daily practice; an acorn shop, decorating, letters, a house, real-time day/night and seasons.
- 草地上岛民来玩，一起解题交朋友；错题农田（每天浇水=复习）；橡果商店、装饰小岛、岛民来信、小屋，真实时间的昼夜与季节。

## 方針 / Principles / 原则
- 答えはすべて、問題とは別のプログラムで確かめています（`tests/`。全探索・座標からの実測・物理の再計算・県界の内外判定など）。`node tests/verify.mjs` のように実行できます。
- 時間制限・ランキング・広告・データ収集はありません。進みぐあいはその端末の中だけに保存されます。
  No timers, rankings, ads or data collection; progress stays on the device. 没有计时、排名、广告，也不收集数据，进度只存在本机。
- 問題文・解説・キャラクターはすべてオリジナルです。特定の教材・塾・出版社とは関係ありません。
  All problems, explanations and characters are original; the game is not affiliated with any publisher, school or cram school.
  题目、讲解和角色均为原创，与任何教材、补习班或出版社无关。

## Third-party code and data
Full license texts: [`THIRD_PARTY_LICENSES.md`](THIRD_PARTY_LICENSES.md).
- `vendor/three.min.js` — three.js r128, © 2010–2021 three.js authors, MIT License.
- `vendor/spectral.js` — spectral.js 3.0.0, © 2025 Ronald van Wijnen, MIT License.
- `worlds/data/jp_prefs.js` — prefecture outlines extracted from svg-japan 1.1.2, © 2020 ka2, MIT License.
- 雨温図：気象庁「過去の気象データ」の平年値（1991–2020年）を加工して作成（出典：気象庁ホームページ）。
- 地図記号：国土地理院「地図記号一覧」をもとに かき直したもの（出典：国土地理院ウェブサイト）。
- ことばの島の章分け：文部科学省「学年別漢字配当表」。
- 場合の数の参考：L. Lovász, *Combinatorial Problems and Exercises* §1（考え方のみ。問題文と数字は自作）。
