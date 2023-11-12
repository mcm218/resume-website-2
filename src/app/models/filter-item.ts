export enum FilterItem {
  Null = 0,
  CSharp = 0b1,
  Unity = 0b1 << 1,
  Xamarin = 0b1 << 2,
  Salesforce = 0b1 << 3,
  Angular = 0b1 << 4,
  HTML = 0b1 << 5,
  CSS = 0b1 << 6,
  JavaScript = 0b1 << 7,
  TypeScript = 0b1 << 8,
  NodeJS = 0b1 << 9,
  React = 0b1 << 10,
  Flutter = 0b1 << 11,
  CPlusPlus = 0b1 << 12,
  ElasticSearch = 0b1 << 13,
  ReactNative = 0b1 << 14,
  RabbitMQ = 0b1 << 15,
}

// HTML | CSS | JavaScript | TypeScript | ElasticSearch | React | React Native =
// 0b1110011111110000