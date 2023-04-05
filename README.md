# チョーセイ
<p align="center">
<img width="250" alt="F61B04A9-F5EB-446A-9196-400FFA6F10B1 2" src="https://user-images.githubusercontent.com/72689870/144109556-a70dad78-55b0-4338-806b-88717ff1ffbc.PNG">


## 概要

LINE上で動く，スマホ入力に特化した，時間ごとの調整アプリケーションです．

日程調整の際の負担をなるべく少なくするように努力しています．

↓チョーセイの公式アカウント
  
https://lin.ee/fzOYqzQ

![M](https://user-images.githubusercontent.com/72689870/144077950-46a1bc9e-fb2d-4ac0-9371-4a8f409542fd.png)

↓PC用URL(基本はLINE(ios/android)で使うことを想定しています)

https://chousei.vercel.app/





https://user-images.githubusercontent.com/72689870/154558910-cec17fc0-a0d9-4de2-9835-7acaf0bbede8.mp4















## なぜ作ったの？
所属していたアカペラサークルでは，グループごとに練習や会議などをよく行うため，時間ごとの日程調整をよく行います．しかし，既存のサービスではスマホでかなり使いづらく，サークル員の不満が募っていました．  

そこでスマホでも入力しやすい時間ごとの日程調整アプリを開発することにしました．

## どんな人を対象にしている？
サークルの人達だけでなく，会議や練習などの日程調整や，バイトのシフト調整をLINEのグループでよく行う全ての人達に使ってほしいです．

## 使った技術は？？
|  技術  |  理由  |
| ---- | ---- |
|  Next.js  |  現時点でのベストプラクティスをある程度ラップしてくれているため，簡易的なAPIを構築するため  |
|Vercel| Next.jsとの相性が良いため|
|  TypeScript  |  静的型付けの恩恵を受けるため  |
|Recoil|シンプルな状態管理を行うため|
|LIFF|LINE上で動くようにするため，ログインを自動的に行うため|
|ChakraUI|ある程度デザインを任せることができ，カスタマイズもかなり可能なため|
|PlanetScale|他のDBaaSと比べて，無料枠がかなり広いため|
|Prisma|型安全にDBを操作できるため|
|Storybook|UIテストを行うため|
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

   
### 利用人数（2023/4/5）
日平均 60〜100人
  
## 使い方
### 1. イベントを作成する

上のQRコードからチョーセイのアカウントを友だち追加します．

<img src="https://user-images.githubusercontent.com/72689870/154555067-bd0f8a2e-36d5-4f8a-8661-270c7b2c0802.jpg" width="200px">


画面の下の方にあるイベントを作成するというメニューをタップするとイベント作成画面が表示されます．
この画面で，イベント名，補足・備考，候補日，候補時間を入力します．

この際，枠内の＋ボタンを押すと，候補時間が増え，一つ前に入力した終わりの時間から同じ時間幅で次の候補時間が自動で入力されています．

また，枠外にある＋ボタンを押すと別の候補時間の組を設定することができます．

始まりの時間が終わりの時間より遅い場合は枠が赤くなり，候補時間を増やす+ボタンが入力できなくなります．

イベント名が空欄，日付が入力されていないものがある，時間帯の枠が赤くなっている場合はイベントを作成するボタンを押すことができません．

<img src="https://user-images.githubusercontent.com/72689870/154555149-81289cdb-3785-48d0-932b-c555b7c6de54.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154555159-a81c394e-9a08-4045-a073-9aabfec1ab69.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154555225-e4c0a820-98b5-44ca-8ebb-85513c515276.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154555238-103aaf89-9c21-4d9f-ad65-5055234f0713.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154555267-11ff3202-ed28-460a-ab8e-7ea130510a51.jpgg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154555282-9c0105d1-6994-44e0-89f5-4d9f3b81709b.jpg" width="200px"> 







候補時間の入力はandroidは左の画像，iosは右の画像のように入力します

<img src="https://user-images.githubusercontent.com/72689870/144102452-d600947d-b64d-49ee-aa0a-371d1b2b7dd5.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154556329-c81d0f63-6645-4e77-abda-2958c239466d.jpg" width="200px">


イベントを作成するを押すと確認画面が表示され，入力した候補時間が整理されて表示されます．この際，重複している候補時間があったとしても，2重カウントは行いません．

<img src="https://user-images.githubusercontent.com/72689870/154555293-c830573f-6395-49a1-bf91-6b69577ab175.jpg" width="200px">

確認画面の作成するボタンを押すとチョーセイのトーク上に作成したイベントのリンクが発行されています．

<img src="https://user-images.githubusercontent.com/72689870/154555297-8466b868-3fe8-40a4-ad2a-021e6ad2dbb3.jpg" width="200px">

### 2. イベント詳細を確認する

イベントのリンクをクリックするとイベント詳細画面が確認できます．

<img src="https://user-images.githubusercontent.com/72689870/154556541-2cad8056-282c-4036-bd7e-49056765358b.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154556548-8ba4c059-9523-4989-92ab-665aabeda477.jpg" width="200px">

### 3. 予定を入力する

イベント詳細画面の下部にある予定を入力するボタンを押すと候補時間ブロックの一覧が表示されます．

画面の下の方にある，○△✗ボタンを選択したあとに，候補時間ブロックをタップすると，各候補時間の出欠を入力できます．（初期値は○になっています．）

入力したものはイベント詳細画面に反映されます．
  
複数人が入力すると，入力や修正した時間が早い人順に列が追加されていきます．
  
おすすめの候補時間が緑色にハイライトされます．
  
アイコンをタップするすると名前がポップアップで表示されます．

また，ボタンが予定を修正するに切り替わるのでこれをタップすると修正することができます．

<img src="https://user-images.githubusercontent.com/72689870/154556654-dc7391af-c45d-4586-8b35-348cab0a33b3.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154556719-1d665f0f-0bee-4208-817e-ad0b44ab8d2f.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154556785-6189a656-1630-4bcb-bc8b-3bb0e060ffef.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154557339-1f70d4f8-5f91-481a-85b4-01da9169358e.jpg" width="200px">



### 4. コメントを入力する

コメントを入力するボタンを押すとコメントを入力することができます．

入力したものはイベント詳細画面に反映されます．

また，ボタンがコメントを修正するに切り替わるのでこれをタップすると修正することができます．

複数人が入力すると，入力や修正した時間が早い人順に行が追加されていきます．

アイコンをタップするすると名前がポップアップで表示されます．

<img src="https://user-images.githubusercontent.com/72689870/154557096-8600e758-9c08-4c09-bb72-ca1a0d7bb800.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154557112-6b674ce4-d078-4328-87d0-029da4b89482.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154557325-98aa984e-7dd7-41d6-a8f7-c5ca9ea06a9f.jpg" width="200px">

### 5. 友達にイベントを共有する

友達に共有するボタンを押すと，LINEの友達一覧が表示され，共有する友達を選択します．
  
（PCで友達に共有するボタンを押すと共有リンクが表示されます．）
  
リンクを踏むとチョーセイと友達登録する確認画面が開き，友達登録をすると，自動的にログインされます．
  
おすすめの候補時間がある場合は，メッセージに追加されます．

<img src="https://user-images.githubusercontent.com/72689870/122577529-da844600-d08d-11eb-887a-96190c5da022.jpg" width="200px">
  
<img width="200px" alt="スクリーンショット 2022-02-18 4 46 39" src="https://user-images.githubusercontent.com/72689870/154559154-ca6467b2-25b7-4f62-a37e-123c7e5606ac.png">
  
<img src="https://user-images.githubusercontent.com/72689870/154557629-6258218a-a1bd-40f6-a6a0-f7c02d17240d.jpg" width="200px">


### 6. 今までに閲覧したイベントを確認する

公式アカウントのトーク画面下部にある，閲覧したイベントを確認するボタンをタップします．
  
直近閲覧したイベント5件が表示されます．
  
イベントをタップするとそのイベントに飛ぶことができます．

<img src="https://user-images.githubusercontent.com/72689870/154557705-08c1af1b-91c7-4ecb-8c46-fa32925f089c.jpg" width="200px">

### 7. イベントを編集する

自分が作成したイベントには，出欠表の右上に編集ボタンが表示されます．
このボタンをタップするとイベント編集画面に飛ぶことができます．

イベント編集画面は，１ブロックに１候補日が入力されています．

元々存在していた候補時間を消すと，回答されていた予定は削除されます．
  
イベントを追加したとき，すでに予定を回答している人の回答は空白になります．この予定は予定入力画面に移動しても自動で入力はされず，グレー色で表示されています．（タップすると回答できます）
  
<img src="https://user-images.githubusercontent.com/72689870/154557838-733c2895-4905-4415-a99c-4baa1398f2f8.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154557886-e8f8bbd6-2e0f-4f30-aee3-6ba342ebac24.jpg" width="200px"> <img src="https://user-images.githubusercontent.com/72689870/154557952-58b74039-c891-47a0-96f6-ba970485af87.jpg" width="200px">
  

