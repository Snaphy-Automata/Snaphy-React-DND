module.exports = {
    // simple config from http://webpack.github.io/docs/configuration.html
    entry: "./index",
    output: { path: __dirname + "/dist", filename: "bundle.js" },

    // using webpack loader
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                loader: "babel-loader", // or just "babel"
                query: {
                    presets: ['es2015', 'stage-0', 'react']
                }
            }
        ]
    }
};