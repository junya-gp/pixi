const path = require('path');

module.exports = {
  // 出力モード
  mode: 'production',
  // mode: 'development',
  
  // エントリーポイント
  entry: {
    // エントリーポイントのファイル名をキーにする
    common: './html/pixi/assets/js/src/common.js', // サイト共通
    pixi02: './html/pixi/assets/js/src/pages/pixi02/index.js', // TOPページ
  },

  // ファイルの出力設定
  output: {
    // 出力ディレクトリ
    path: path.resolve(__dirname, 'html'),
    // 出力ファイル名
    filename: 'pixi/assets/js/dist/[name].bundle.js' // エントリーポイントのキーを[name]に設定し、distディレクトリに出力
  },

  // ローカル開発用環境設定
  devServer: {
    // ルートディレクトリの指定
    static: {
      directory: path.join(__dirname, 'html'),
    },
    // すべてのファイルを監視する
    watchFiles: ['**/*'],
  },

  // module: {
  //   rules: [
  //     {
  //       // test: /node_modules\/(.+)\.css$/,
  //       test: /\.css$/, // すべてのCSSファイルに適用
  //       use: [
  //         {
  //           loader: 'style-loader',
  //         },
  //         {
  //           loader: 'css-loader',
  //           options: { url: false },
  //         },
  //       ],
  //     },
  //   ]
  // }
};