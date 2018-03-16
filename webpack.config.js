const {
    resolve
} = require('path')
const path = require('path')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
const ExtractTextPlugin = require('extract-text-webpack-plugin')
const CleanWebpackPlugin = require('clean-webpack-plugin')
// webpack 模块分析插件
// var BundleAnalyzerPlugin = require('webpack-bundle-analyzer').BundleAnalyzerPlugin;

function resolveFile(dir) {
    return path.join(__dirname, '..', dir)
}
// 配置请求接口
const api = require('./src/assets/config');
var env;
if (process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'dev') {
    env = api.dev;
} else if (process.env.NODE_ENV == 'production') {
    env = api.build;
} else {
    env = api.beiji;
}
const date = new Date();
const fillzero = function (num) {
    return num > 9 ? num : '0' + num
}
const month = fillzero(date.getMonth() + 1);
const day = fillzero(date.getDate());
const hour = fillzero(date.getHours());
const minute = fillzero(date.getMinutes());
const second = fillzero(date.getSeconds());
const timeStamp = `${date.getFullYear()}${month}${day}${hour}${minute}${second}`
module.exports = {
    // 配置页面入口js文件
    entry: {
        index: './src/app.js',
        // commons:['vue','element-ui']
    },
    // 配置打包输出相关
    output: {
        // 打包输出目录
        path: resolve(__dirname, './dist'),
        // 入口js的打包输出文件名
        // filename: 'build.js'
        filename: '[name]_v' + timeStamp + '.js',
        // publicPath: process.env.NODE_ENV === 'production' ? '/mposmsNew' : '/'
        publicPath: '',

    },
    module: {
        /*
         配置各种类型文件的加载器, 称之为loader
         webpack当遇到import ... 时, 会调用这里配置的loader对引用的文件进行编译
         */
        rules: [
            // 用来解析vue后缀的文件

            {
                test: /\.vue$/,
                use: [{
                    loader: 'vue-loader',
                }]

            },
            // js文件es6转es5
            {
                test: /\.js$/,
                use: 'babel-loader',
                exclude: /node_modules/ // 排除node_modules目录
            },
            // 处理在js中引用css文件
            {
                test: /\.css$/,
                use: ['style-loader', 'css-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
                //也可以写成 loader："style-loader!css-loader!postcss-loader"
            },
            // 处理在js中引用less文件
            {
                test: /\.less$/,
                use: ['style-loader', 'css-loader', 'less-loader']
            },
            // 处理在js中引用scss文件
            {
                test: /\.scss$/,
                use: ['style-loader', 'css-loader', 'sass-loader'],
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader', 'postcss-loader']
                })

            },


            {
                test: /\.(png|jpg|jpeg|gif)$/,
                // use: 'url-loader?limit=25000&name=images/[name].[ext]'
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'images/[name].[ext]?[hash]'
                }
                // 小于limit的数值，会被改写成base64填入url里面，
                // 不然会输出到dist/images目录下，[name]原文件名，[ext]原后缀，[hash]在url上加上一点哈希值避免缓存。
            },

            {
                test: /\.(eot|woff|ttf|woff2|svg)$/,
                use: 'url-loader?limit=2500&name=fonts/[name].[ext]?[hash]'
            }

        ]
    },
    /*
     配置webpack插件
     */
    plugins: [
        new HtmlWebpackPlugin({
            filename: 'index.html',
            template: resolve(__dirname, 'index.html'),
            inject: 'true',
            favicon: resolve(__dirname, 'src/assets/images/favicon.ico')
        }),
        new ExtractTextPlugin({
            filename: 'style.css',
            allChunks: true
        }),
        new webpack.HotModuleReplacementPlugin(),
        // new BundleAnalyzerPlugin() // 分析打包模块
        new webpack.DefinePlugin({
            'server': env.env
        }),
        new CleanWebpackPlugin('./dist'),
        new webpack.optimize.CommonsChunkPlugin({
            name: 'lib',
            filename: 'lib.js',
            minChunks: function (module, count) {
                // If module has a path, and inside of the path exists the name "somelib",
                // and it is used in 3 separate chunks/entries, then break it out into
                // a separate chunk with chunk keyname "my-single-lib-chunk", and filename "my-single-lib-chunk.js"
                if (module.resource && (/^.*\.(css|scss)$/).test(module.resource)) {
                    return false;
                }
                return module.context && module.context.includes("node_modules")
            }
        })
        // new webpack.optimize.UglifyJsPlugin({
        //     compress: {
        //         warnings: false
        //     }
        // })

    ],

    resolve: {
        extensions: ['.js', '.vue', '.css'],
        alias: {
            // 'assets':resolveFile('src/assets'),
            'assets': resolve(__dirname, 'src/assets')
        }
    },
    // eval-source-map is faster for development
    // devtool: false
    devtool: process.env.NODE_ENV === 'production' || process.env.NODE_ENV == 'development' || process.env.NODE_ENV == 'beiji' ? false : '#eval-source-map'


}