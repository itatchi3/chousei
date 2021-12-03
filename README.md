# チョーセイ

<img width="250" alt="F61B04A9-F5EB-446A-9196-400FFA6F10B1 2" src="https://user-images.githubusercontent.com/72689870/144109556-a70dad78-55b0-4338-806b-88717ff1ffbc.PNG">


## 概要

LINE上で動く，スマホ入力に特化した，時間ごとの調整アプリケーションです．

日程調整の際の負担をなるべく少なくするように努力しています．

↓チョーセイの公式アカウント

![M](https://user-images.githubusercontent.com/72689870/144077950-46a1bc9e-fb2d-4ac0-9371-4a8f409542fd.png)

↓PC用URL(基本はLINE(ios/android)で使うことを想定しています)

https://chousei.vercel.app/








https://user-images.githubusercontent.com/72689870/144118399-3dc24830-9716-4b43-9762-1b3b9a836440.mp4









## なぜ作ったの？
所属していたアカペラサークルでは，グループごとに練習や会議などをよく行うため，時間ごとの日程調整をよく行います．しかし，既存のサービスではスマホでかなり使いづらく，サークル員の不満が募っていました．  

そこでスマホでも入力しやすい時間ごとの日程調整アプリを開発することにしました．

## どんな人を対象にしている？
サークルの人達だけでなく，会議や練習などの日程調整や，バイトのシフト調整をLINEのグループでよく行う全ての人達に使ってほしいです．

## 使った技術は？？
|  技術  |  理由  |
| ---- | ---- |
|  Next.js  |  SSRを行うため，簡易的なAPIを構築するため  |
|Vercel| Next.jsとの相性が良いため|
|  TypeScript  |  静的型付けの恩恵を受けるため  |
|LIFF|LINE上で動くようにするため，ログインを自動的に行うため|
|ChakraUI|ある程度デザインを任せることができ，カスタマイズもかなり可能なため|
|PlanetScale|他のDBaaSと比べて，無料枠がかなり広いため|
|Prisma|型安全にDBを操作できるため|

## ユーザー認証
LINEログインを用いています．LINE（ios/android）でURLを開いた場合は自動的にログインされます．

## セキュリティ
ユーザーのプロフィール情報用いて，データの追加や更新を行う際には，クライアント側で発行したIDトークンをサーバーに送信し，サーバーでIDトークンを検証することで，安全に取得したプロフィール情報を用いるようにしています．

参考URL: https://developers.line.biz/ja/docs/liff/using-user-profile/#use-user-info-on-server

## こだわりのポイントは？
### 日程調整の際の負担を低減
LIFFを用いることで，会員登録やインストールといった手間をなくし使い始めのハードルをなくすことができます．
また，LINE上ですべてが完結するので，他のアプリに移動して調整を行うといった心理的負担も低減しています．

### ユーザー体験の向上
既存のサービスではイベントの作成をテキストベースで行っているなど，かなり入力に時間がかかっていました．そこで，直感的な操作で日程表の作成や予定の入力をできるようにすることでスムーズに日程調整ができるようにしました．

また，LIFFとNext.jsの組み合わせにおいて，LIFFではwindowが使われているので普通にimportしてしまうと，Nextjsのサーバサイド処理でエラーが生じてしまいます．そのため，コンテンツをレンダリングする前に毎回クライアント側でLIFFをimportする必要があるので，コンテンツが見ることができるようになるまで少し時間がかかります．

この時間中にユーザーが不安にならないようにするために，LIFFをimportしている時間はloading中だとわかるようにスピナーを表示するようにしました．

また，loading後にレイアウトシフトを起こしてしまうとユーザー体験が悪くなってしまいます．そのため，SSRを行うことによってloading後にコンテンツが完全に揃っているようにしました．SSRを行うとユーザーがコンテンツを見ることができるようになるまでの時間がかかってしまうのですが，この時間をなるべく短くするために，ホスティングサーバーとDBサーバーのリージョンを近い距離にし，DBへのリクエストを並列に処理するようにしました．

## 使い方
上のQRコードからチョーセイのアカウントを友だち追加します．

<img src="https://user-images.githubusercontent.com/72689870/144100657-a942e261-41ee-46c7-b1ae-d2c5a7fff1e3.jpg" width="200px"> 

画面の下の方にあるイベントを作成するというメニューをタップするとイベント作成画面が表示されるので，候補日と時間帯を入力します．

時間帯を増やす＋ボタンを押すと，一つ前に入力した終わりの時間から同じ時間幅で次の時間帯が自動で入力されています．

また，枠外にある＋ボタンを押すと別の時間帯の組を設定することができます．

始まりの時間が終わりの時間より遅い場合は枠が赤くなり，時間帯を増やす+ボタンが入力できなくなります．

イベント名が空欄，日付が入力されていないものがある，時間帯の枠が赤くなっている場合はイベントを作成するボタンを押すことができません．

<img src="https://user-images.githubusercontent.com/72689870/144100899-798ff181-6f23-4e6a-8011-dc6a15f52dc7.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144102029-4ca33ee2-94de-48ee-9564-cbf97740e9c9.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144102105-b6338fa3-d7a5-4ffc-881c-b21811574ff9.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144102131-6d5b1ae5-d711-4ac5-ba61-b66176b7c73b.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144108921-cbcc91f0-0e1d-4d4c-999a-978783f37166.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144108886-fcfcca67-a66e-4885-86fc-563b3a1d7a7c.jpg" width="200px"> 


候補時間の入力はandroidは左の画像，iosは右の画像のように入力します

<img src="https://user-images.githubusercontent.com/72689870/144102452-d600947d-b64d-49ee-aa0a-371d1b2b7dd5.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144102964-af3dcdb9-0b3c-4bd6-8c95-0d8fc35b3178.jpeg" width="200px">


イベントを作成するを押すと確認画面が表示され，入力した候補時間が整理されて表示されます．

<img src="https://user-images.githubusercontent.com/72689870/144103280-4f5d7d3b-2683-4ab3-8a84-508d7697600f.jpg" width="200px">

確認画面の作成するボタンを押すとチョーセイのトーク上に作成したイベントのリンクが発行されています．

これをクリックするとイベント詳細画面が確認できます．

<img src="https://user-images.githubusercontent.com/72689870/144105815-59e70bd3-44f4-42eb-9653-ebbbd9ad148b.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144106054-deaac618-5ba3-4bf5-ad2f-3d0e4fdf5307.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144103519-a634e75d-007c-402f-a9c2-16ac380ff0b1.jpg" width="200px">

予定を入力するボタンを押すと候補時間ブロックの一覧が表示されます．

画面の下の方にある，○△✗ボタンを選択したあとに，候補時間ブロックをタップすると，色が変わり，参加可能かどうかを入力できます
(赤が○，緑が△，青が☓)

入力したものはイベント詳細画面に反映されます．

また，ボタンが予定を修正するに切り替わるのでこれをタップすると修正することができます．

複数人が入力すると，入力や修正した時間が早い人順に列が追加されていきます．

おすすめの候補時間が緑色にハイライトされます．

アイコンをタップするすると名前がポップアップで表示されます．

<img src="https://user-images.githubusercontent.com/72689870/144104076-50e5adb1-273f-4794-8225-896039180ac7.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144104166-f725cce6-6ebc-4d7a-92f1-e9083c7717c6.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144108045-45183903-9e11-46e9-ac44-b59f63843ed8.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144108065-b39abf58-3d0e-4414-a722-8104042480db.jpg" width="200px">

コメントを入力するボタンを押すとコメントを入力することができます．

入力したものはイベント詳細画面に反映されます．

また，ボタンがコメントを修正するに切り替わるのでこれをタップすると修正することができます．

複数人が入力すると，入力や修正した時間が早い人順に行が追加されていきます．

アイコンをタップするすると名前がポップアップで表示されます．

<img src="https://user-images.githubusercontent.com/72689870/144106847-c81d1bc6-dbf9-4942-97f7-2e6cf4e982ef.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144104580-5040cc3f-ffeb-426e-b2d5-fc19b42a1d3c.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/144108097-2f03e81b-0ff3-44e3-8285-2dae74db4f4d.jpg" width="200px">

友達に共有したい場合は，イベントのリンクをコピーして友達に送信するか，友達に共有するボタンを押して，共有したい友達を選択します．
リンクを踏むとチョーセイと友達登録する確認画面が開き，友達登録をすると，自動的にログインされます．

<img src="https://user-images.githubusercontent.com/72689870/122577529-da844600-d08d-11eb-887a-96190c5da022.jpg" width="200px">
