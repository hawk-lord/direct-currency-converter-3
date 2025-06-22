const path = require('path');
const CopyWebpackPlugin = require('copy-webpack-plugin');

module.exports = {
    entry: {
        'content-bundle': [
            './content/dcc-functions.js',
            './content/dcc-content.js',
            './gc-content-adapter.js'
        ],
        //'gc-main': './common/dcc-main.js',
        'dragdroptouch': 'drag-drop-touch',
        'dompurify': 'dompurify'
    },
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    resolve: {
        extensions: ['.js', '.mjs'],
        mainFields: ['browser', 'main']
    },
    module: {
        rules: [
            {
                test: /\.js$/,
                exclude: /node_modules/,
                use: {
                    loader: 'babel-loader',
                    options: {
                        presets: ['@babel/preset-env']
                    }
                }
            }
        ]
    },
    plugins: [
        new CopyWebpackPlugin({
            patterns: [
                {from: 'manifest.json', to: 'manifest.json'},
                {from: 'common/help.html', to: 'common/help.html'},
                {from: 'quotes.html', to: 'quotes.html'},
                {from: 'panel.html', to: 'panel.html'},
                {from: 'prices.html', to: 'prices.html'},
                {from: 'settings.html', to: 'settings.html'},
                {from: 'title.css', to: 'title.css'},
                {from: 'settings.css', to: 'settings.css'},
                {from: 'panel-style.css', to: 'panel-style.css'},
                {from: 'images', to: 'images'},
                // Root JavaScript files
                {from: 'gc-chromeInterface.js', to: 'gc-chromeInterface.js'},
                {from: 'gc-contentInterface.js', to: 'gc-contentInterface.js'},
                {from: 'gc-quotes-adapter.js', to: 'gc-quotes-adapter.js'},
                {from: 'gc-storage-service.js', to: 'gc-storage-service.js'},
                {from: 'gc-l10n.js', to: 'gc-l10n.js'},
                {from: 'gc-panel.js', to: 'gc-panel.js'},
                {from: 'gc-settings-adapter.js', to: 'gc-settings-adapter.js'},
                {from: 'gc-main.js', to: 'gc-main.js'},
                // Common JavaScript files
                {from: 'common/currencylayer-quotes.js', to: 'common/currencylayer-quotes.js'},
                {from: 'common/dcc-main.js', to: 'common/dcc-main.js'},
                {from: 'common/ecb-quotes.js', to: 'common/ecb-quotes.js'},
                {from: 'common/informationHolder.js', to: 'common/informationHolder.js'},
                {from: 'common/parseSettings.js', to: 'common/parseSettings.js'},
                {from: 'common/quotes-service.js', to: 'common/quotes-service.js'},
                {from: 'common/eventAggregator.js', to: 'common/eventAggregator.js'},
                {from: 'common/functions.js', to: 'common/functions.js'},
                {from: 'common/settings.js', to: 'common/settings.js'},
                {from: 'common/tab-state.js', to: 'common/tab-state.js'},
                // Content JavaScript files
                {from: 'content/dcc-quotes.js', to: 'content/dcc-quotes.js'},
                {from: 'content/dcc-settings.js', to: 'content/dcc-settings.js'},
                // Common JSON files
                {from: 'common/regexes1.json', to: 'common/regexes1.json'},
                {from: 'common/regexes2.json', to: 'common/regexes2.json'},
                {from: 'common/iso4217Currencies.json', to: 'common/iso4217Currencies.json'},
                {from: 'common/currencyData.json', to: 'common/currencyData.json'},
                // Localization JSON files
                {from: '_locales', to: '_locales'}
            ]
        })
    ],
    // Custom output for each entry point
    output: {
        path: path.resolve(__dirname, 'dist'),
        filename: '[name].js',
        clean: true
    },
    entry: {
        'content-bundle': {
            import: [
                './content/dcc-functions.js',
                './content/dcc-content.js',
                './gc-content-adapter.js'
            ],
            library: {
                type: 'window',
                name: 'DirectCurrencyConverter'
            }
        },
//        'gc-main': {
//            import: './common/dcc-main.js' // Updated path
        // No library export for service worker
        //       },
        'dragdroptouch': {
            import: 'drag-drop-touch',
            library: {
                type: 'window',
                name: 'DragDropTouch'
            }
        },
        'dompurify': {
            import: 'dompurify',
            library: {
                type: 'window',
                name: 'DOMPurify'
            }
        }
    }
};
