export type RootStackParamList = {
  '(tabs)': undefined;
  '(tabs)/index': undefined;
  '(tabs)/motos': undefined;
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
