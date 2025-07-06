/* eslint-disable @typescript-eslint/no-explicit-any */

declare module '@fractal-solutions/xgboost-js' {
  export const XGBoost: XGBoost;
}

interface XGBoost {
  learningRate: number;
  trees: any[];

  _predict(x: number[], tree: any): number;
  fromJSON(json: any): XGBoost;
  predictSingle(x: number[]): number;
}