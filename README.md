

# 概要
楽曲の情報の記録・共有サイト。

https://diglog.onrender.com/

<br>

## 動機
1. プラットフォームを横断して好きな楽曲を管理したい
2. 新しい楽曲に出会う・探すことを促進する仕組みがほしい

<br>
<br>

# プロジェクト情報

## 使用言語等
 <table>
    <tr>
      <td>フロントエンド</td>
      <td>javascript (React)
      <br>
      TailwindCSS
      </td>
    </tr>
    <tr>
      <td>バックエンド</td>
      <td>javascript (Node.js)</td>
    </tr>
    <tr>
      <td>データベース</td>
      <td>PostgreSQL</td>
    </tr>
    <tr>
      <td>外部API</td>
      <td>
      <a href="https://developers.google.com/youtube/iframe_api_reference">
      YouTube IFrame Player API
      </a>
      <br>
      <a href="https://developers.soundcloud.com/docs/api/html5-widget">
      SoundCloud Widget API
      </a>
      </td>
    </tr>
    <tr>
      <td>APIテスト</td>
      <td>Postman</td>
    </tr>
    <tr>
      <td>コード管理</td>
      <td>Git/GitHub</td>
    </tr>
 </table>

<br>

## 選定理由

### React
1. SPAを作ってみたかった
2. チュートリアル等の初学者向けの資料が充実している(ように感じられた)

ため。
 
### PostgreSQL

無料で使えるデプロイ先がrender.comしかなく、render.comではPostgreSQLしかサポートされていないため。

<br>
<br>


## 開発期間
 <table>
    <tr>
        <td>勉強・企画・設計</td>
        <td>2週間</td>
    </tr>
    <tr>
        <td>実装</td>
        <td>1ヶ月</td>
    </tr>
 </table>

<br>
<br>


# 機能
## ゲストユーザー
- 楽曲情報の閲覧・検索
- 再生プレーヤー(後述)
- ランダム再生

<br>

## 登録ユーザー

ゲストユーザーの機能に加えて以下の機能が利用できる。
- 楽曲情報の投稿
- 自身が投稿した楽曲情報へのタグ付け
- プレイリストの投稿
- 投稿ノルマの設定

<br>

## 再生プレーヤー
投稿に含まれるYouTube・SoundCloudのURLから埋め込みプレーヤーを画面外に生成し、再生する。
複数の楽曲が同時に再生されることがないように再生状態を制御する。
- 再生・停止
- 開始・終了時点へのスキップ
- 再生位置のシーク
- 再生待機キューの先頭・末尾への楽曲追加

<br>
<br>

# 改修案
- SQLインジェクション対策
- レスポンシブ対応
- 投稿時の入力支援(URLから投稿者名とタイトルを自動で取得する)
- 検索機能の強化(属性ごとの検索・部分一致・完全一致指定)
- [アーティスト名, 楽曲タイトル]と楽曲URLを複合テーブルで紐づけることで検索での同一楽曲の重複を防ぐ(要DB・API再設計)
- レコメンド機能

<br>

# 今後の課題
 ## コードの保守性

具体的には以下の要素の改善。

 - ログ
 - 可読性の高いコード
 - コメント

今回はサイトを作って動かすことが第一目標だったため、保守性についてはあまり考慮できていなかったが、実務ではチームで開発することもあり優先度の高い課題。

他の人のソースコードを読むなどして学んでいきたい。

 ## Typescriptの導入
 TypescriptはJavascriptよりも保守性が高く、実務で一般的に使われる言語のため習得は必須と考える。
