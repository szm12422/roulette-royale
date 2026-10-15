# ルーレットのDiscord設定

このリポジトリーにはスマホ・PC対応のアクティビティ版を反映しています。

## 接続先

| 項目 | 値 |
| --- | --- |
| Application ID | `1560075138634874890` |
| 公開予定URL | <https://szm12422.github.io/roulette-royale/> |
| URL Mapping Prefix | `/` |
| URL Mapping Target | `szm12422.github.io/roulette-royale` |

Application IDは公開情報です。Client SecretやBot Tokenは不要です。

## 初回公開

リポジトリーの **Settings → Pages → Build and deployment → Source** を **GitHub Actions** に設定してください。Actionsが無効の場合は有効化してください。その後 **Actions → Deploy Roulette Royale to GitHub Pages → Run workflow** を実行します。以降はmainへの反映時に自動公開します。

Developer Portalの該当ApplicationでActivitiesを有効にし、上表のURL Mappingを設定します。Targetには `https://` や `index.html` を入れません。PC・iOS・Androidを有効にして、テスト可能なメンバーで起動を確認してください。

## ローカル確認

```bash
npm ci
npm run build
npm run preview
```

`.env.production` とActionsにApplication IDを設定済みです。独立したゲームとして遊べ、保存は端末内です。参加者間の台・残高共有や端末間同期はありません。

## 操作

- 盤面タップ・クリックでベット。チップを長押し・右クリックで取り消し。
- スピンボタンまたはスペース／Enterで回転。
- メニューは上下にスクロールできます。

実Discord内でのPC・Android・iOSの確認は公開後に必要です。ブラウザー検証は実機検証を代替しません。

## 別Applicationに変更する場合

`.env.production.local` に別IDを設定するか、付属のビルドスクリプトにIDを渡してください。`.env.local` より `.env.production` が優先されるため、`.env.local` のみを変更しても本番IDは変わりません。ActionsのIDも変更してください。
