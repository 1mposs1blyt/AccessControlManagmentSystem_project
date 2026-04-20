module.exports = function (api) {
  api.cache(true)
  return {
    presets: [['babel-preset-expo', { jsxRuntime: 'automatic' }]],
    plugins: [
      [
        '@tamagui/babel-plugin',
        {
          components: ['tamagui', '@app/ui'],
          config: '../../packages/ui/src/tamagui.config.ts',
          disableExtraction: true, // <--- Это отключит проблемный парсинг для нативки
        },
      ],
      'react-native-reanimated/plugin',
      'react-native-worklets-core/plugin',
      'transform-inline-environment-variables',
    ],
  }
}
