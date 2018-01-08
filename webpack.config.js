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
                loader: 'vue-loader',
                options: {
                    loaders: {
                        sass: ExtractTextPlugin.extract({
                            use: ['css-loader', 'sass-loader', 'postcss-loader'],
                            fallback: 'vue-style-loader'
                        }),
                        css: ExtractTextPlugin.extract({
                            use: ['css-loader', 'postcss-loader'],
                            fallback: 'vue-style-loader'
                        })
                    },
                    // postcss配置浏览器前缀
                    postcss: [require('autoprefixer')({
                        browsers: ['last 5 versions', 'android >= 4.2', 'ios >= 7']
                    })]
                }
            },
            {
                /*
                 使用babel编译ES6/ES7/ES8为ES5代码
                 */
                test: /\.js$/,
                // 排除node_modules目录下的文件, npm安装的包不需要编译
                exclude: [/node_modules/, resolve(__dirname, './src/libs')],
                /*
                 use指定该文件的loader, 值可以是字符串或者数组.
                 这里先使用eslint-loader处理, 返回的结果交给babel-loader处理.
                 eslint-loader用来检查代码, 如果有错误, 编译的时候会报错.
                 babel-loader用来编译js文件.
                 */
                // use: ['babel-loader', 'eslint-loader'] // eslint js 语法检查 暂时没用先注释了
                use: ['babel-loader']
            },
            {
                // 匹配.css文件
                test: /\.css$/,
                /*
                 先使用css-loader处理, 返回的结果交给style-loader处理.
                 */
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: 'css-loader'
                })
            },
            {
                // 匹配scss文件
                test: /\.scss$/,
                /*
                 先使用sass-loader处理, 返回的结果交给css-loader处理
                 */
                use: ExtractTextPlugin.extract({
                    fallback: 'style-loader',
                    use: ['css-loader', 'sass-loader', 'postcss-loader']
                })
            },
            // {
            //     /*
            //      匹配各种格式的图片和字体文件
            //      */
            //     test: /\.(png|jpg|jpeg|ico|gif|eot|ttf|woff|woff2|svg|svgz)(\?.+)?$/,
            //     /*
            //      使用url-loader, 它接受一个limit参数, 单位为字节(byte)
            //      当文件体积小于limit时, url-loader把文件转为Data URI的格式内联到引用的地方
            //      */
            //     use: [{
            //         loader: 'url-loader',
            //         options: {
            //             //limit: 10000,
            //             limit: 10000,
            //             name: 'img/[name].[hash:7].[ext]'
            //         }
            //     }]
            // },
            {
                test: /\.(png|jpg|gif|svg|ico)(\?.*)?$/,
                loader: 'file-loader',
                options: {
                    name: 'img/[name].[ext]?[hash]',
                    limit: 10000
                }
            },
            {
                test: /\.(eot|svg|ttf|woff|woff2)(\?\S*)?$/,
                loader: 'url-loader',
                options: {
                    limit: 10000,
                    name: 'img/[name].[hash:7].[ext]'
                }
            },
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
        // new webpack.optimize.CommonsChunkPlugin(
        //     {names:['index','commons']}
        // )

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
    /*
     配置开发时用的服务器, 让你可以用 http://127.0.0.1:8100/ 这样的url打开页面来调试
    //  */
    // devServer: {
    //     // 配置监听端口, 因为8080很常用, 为了避免和其他程序冲突, 我们配个其他的端口号
    //     port: 8100,
    //     /*
    //      historyApiFallback用来配置页面的重定向
    //      */
    //     historyApiFallback: true
    // },
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