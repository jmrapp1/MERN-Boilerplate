function build(env) {
    if (env === 'dev' || env === 'prod') {
        return require('./webpack.config.' + env + '.js');
    }
    console.log('Webpack environment build parameter not provided.');
}

module.exports = build;