const { withTamagui } = require("@tamagui/next-plugin")
const path = require('path')
const stubPath = './stub.js'

/**
 * @type {import('next').NextConfig}
 */
const WithTamagui = {
  config: "../../packages/ui/src/tamagui.config.ts",
  components: ["tamagui", "@app/ui"],
  outputCSS: process.env.NODE_ENV === "production" ? './public/tamagui.css' : "null"
}
/**
 * @type {import('next').NextConfig}
 */

const withWebpack = {
  webpack(config) {
    if (!config.resolve) {
      config.resolve = {}
    }

    config.resolve.alias = {
      ...(config.resolve.alias || {}),
      // Основные подмены
      'react-native$': path.resolve(__dirname, stubPath),
      'react-native': path.resolve(__dirname, stubPath),
      'react-native-svg$': 'react-native-svg-web',
      'react-native-svg': 'react-native-svg-web',

      // Дедупликация (используем path.resolve для стабильности Webpack)
      'tamagui$': path.resolve(__dirname, '../../node_modules/tamagui'),
      '@tamagui/core$': path.resolve(__dirname, '../../node_modules/@tamagui/core'),
      'react$': path.resolve(__dirname, '../../node_modules/react'),
      'react-dom$': path.resolve(__dirname, '../../node_modules/react-dom'),

      // Внутренние библиотеки React Native
      'react-native/Libraries/TurboModule/TurboModuleRegistry': path.resolve(__dirname, stubPath),
      'react-native/Libraries/Utilities/codegenNativeComponent': path.resolve(__dirname, stubPath),
      
      'react-native/Libraries/EventEmitter/RCTDeviceEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter/RCTDeviceEventEmitter',
      'react-native/Libraries/vendor/emitter/EventEmitter$':
        'react-native-web/dist/vendor/react-native/emitter/EventEmitter',
      'react-native/Libraries/EventEmitter/NativeEventEmitter$':
        'react-native-web/dist/vendor/react-native/NativeEventEmitter',
    }

    config.resolve.extensions = [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      ...(config.resolve?.extensions ?? []),
    ]

    return config
  },
}


/**
 * @type {import('next').NextConfig}
 */
const withTurpopack = {
  turbopack: {
    resolveAlias: {
      'react-native': stubPath,
      'react-native-svg': 'react-native-svg-web',

      // Используем относительные пути к общему node_modules
      'expo-haptics': stubPath,
      'tamagui': '../../node_modules/tamagui',
      '@tamagui/core': '../../node_modules/@tamagui/core',
      'react': '../../node_modules/react',
      'react-dom': '../../node_modules/react-dom',
      
      // Остальные ваши алиасы
      'react-native/Libraries/Utilities/codegenNativeComponent': stubPath,
      'react-native/Libraries/TurboModule/TurboModuleRegistry': stubPath,
      'react-native/Libraries/Image/AssetRegistry$': 'react-native-web/dist/modules/AssetRegistry/index.js',
    },
    resolveExtensions: [
      '.web.js',
      '.web.jsx',
      '.web.ts',
      '.web.tsx',
      '.js',
      '.mjs',
      '.tsx',
      '.ts',
      '.jsx',
      '.json',
      '.wasm',
    ],
    root: path.resolve(__dirname, '../..'),
  },
}

/**
 * @type {import('next').NextConfig}
 */
const nextConfig = {
  allowedDevOrigins: ['10.1.30.203',"*"],
  transpilePackages: [
    'solito',
    'expo-haptics',
    'react-native',
    'react-native-web',
    'react-native-reanimated',
    'react-native-gesture-handler',
    'moti',
    "@app/ui",
    "@app/db",
    'react-native-worklets-core',
    'react-native-svg-web',
    '@tamagui/lucide-icons',
  ],

  compiler: {
    define: {
      __DEV__: JSON.stringify(process.env.NODE_ENV !== 'production'),
    },
  },
  reactStrictMode: false, // reanimated doesn't support this on web

  ...withWebpack,
  ...withTurpopack,
}
module.exports = withTamagui(WithTamagui)(nextConfig)