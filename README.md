# cloneNodeDeep

深度 clone Dom 节点，支持对 Web Compoent 的兼容处理（不会造成样式的全局污染）

## Goal

目前主流的，将一个HTML页面转化为图片的方式，多利用 svg 的 foreignobject 特性。然后将生成的 svg 序列化后（XMLSerializer），丢到`new Image` 进行处理。

但存在一个问题，XMLSerializer 会造成 Web Component 的 `shadowRoot` 丢失

## How It Work

遇到 WebComponent 节点时，将其转化为普通的 div 节点，同时为 `shadowRoot` 下的 `style` 的样式选择器添加`名空间`，防止造成全局的样式污染

## API

```ts
export declare function cloneNodeDeep(node: HTMLElement): Node | null | undefined;
```
