// // Learn more https://docs.expo.dev/guides/monorepos
// // Learn more https://docs.expo.io/guides/customizing-metro
// /**
//  * @type {import('expo/metro-config')}
//  */
// const { getDefaultConfig } = require('expo/metro-config')
// const path = require('path')

// const projectRoot = __dirname
// const workspaceRoot = path.resolve(projectRoot, '../..')

// const config = getDefaultConfig(projectRoot)

// config.watchFolders = [workspaceRoot]
// config.resolver.nodeModulesPaths = [
//   path.resolve(projectRoot, 'node_modules'),
//   path.resolve(workspaceRoot, 'node_modules'),
// ]
// config.resolver.disableHierarchicalLookup = true

// config.transformer.getTransformOptions = async () => ({
//   transform: {
//     experimentalImportSupport: false,
//     inlineRequires: true,
//   },
// })

// module.exports = config

const { getDefaultConfig } = require('expo/metro-config')
const path = require('path')

const projectRoot = __dirname
const workspaceRoot = path.resolve(projectRoot, '../..')

const config = getDefaultConfig(projectRoot)

// 1. Указываем Metro следить за всем монорепозиторием
config.watchFolders = [workspaceRoot]

// 2. Помогаем Metro найти node_modules
config.resolver.nodeModulesPaths = [
  path.resolve(projectRoot, 'node_modules'),
  path.resolve(workspaceRoot, 'node_modules'),
]

// 3. Важно для Tamagui: выключаем иерархический поиск
config.resolver.disableHierarchicalLookup = true

module.exports = config
