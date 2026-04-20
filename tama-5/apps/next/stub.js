// apps/next/stub.js
import * as RNWeb from 'react-native-web';
import React from 'react';

// --- Заглушки для expo-haptics ---
export const impactAsync = async () => {};
export const notificationAsync = async () => {};
export const selectionAsync = async () => {};
export const ImpactFeedbackStyle = {
  Light: 'light',
  Medium: 'medium',
  Heavy: 'heavy',
};
export const NotificationFeedbackType = {
  Success: 'success',
  Error: 'error',
  Warning: 'warning',
};
// --------------------------------

export const createParam = () => ({
  useParam: () => [undefined, () => {}],
});

export const TurboModuleRegistry = {
  getEnforcing: () => ({}),
  get: () => ({}),
};

export const codegenNativeComponent = (name) => {
  return function StubComponent(props) {
    return React.createElement('div', { 'data-native-name': name, ...props });
  };
};

export const UIManager = RNWeb.UIManager || {};
export const NativeModules = RNWeb.NativeModules || {};

export * from 'react-native-web';

const ReactNativeMock = {
  ...RNWeb,
  createParam,
  codegenNativeComponent,
  TurboModuleRegistry,
  UIManager,
  NativeModules,
  // Добавляем и сюда на случай импорта всем объектом
  ...ImpactFeedbackStyle, 
  impactAsync,
};

export default ReactNativeMock;
