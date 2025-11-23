export type RootStackParamList = {
  '(tabs)': undefined;
  '(tabs)/index': undefined;
  '(tabs)/detalhes': {
    modelo: string;
    placa: string;
  };
  '(tabs)/formulario': undefined;
  '(tabs)/configuracoes': undefined;
};

declare global {
  namespace ReactNavigation {
    interface RootParamList extends RootStackParamList {}
  }
}

// Nota: este arquivo contém apenas tipos TypeScript. Mantemos um default export
// que renderiza `null` para satisfazer o expo-router em builds web.
import React from 'react';

export default function _TypesPlaceholder() {
  return null;
}
