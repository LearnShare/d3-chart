Chart
====

Chart 仅包含了标题、图例等基本视觉元素，并负责计算相关元素的尺寸，实现尺寸的自适应（响应式）。任何类型的绘图插件都应该继承自 Chart，并扩展配置属性，重写绘图部分。

配置属性
----

```js
var config = {};
```

### target

用来绘图的容器元素（父元素）。

```html
<div id="target">chart will be here</div>
```

```js
config.target = document.getElementById('target');
```

### width

绘图区域的宽度(px)。如果未设置，则使用容器元素的宽度。

```js
config.width = 640;
```

### height

绘图区域的高度(px)。如果未设置，则使用容器元素的高度。

```js
config.height = 480;
```

### padding

绘图区域的内边距(px)。最小值为 1，默认为 10。

```js
config.height = 20;
```

### autoResize

图表是否跟随容器自适应宽高。默认为 true。

```js
config.autoResize = true;
```

### title

设置图表的主标题。如果为空，则隐藏标题区域（包含副标题）。

```js
config.title = 'D3 Chart';
```

### titleSize

设置主标题的字号(px)。默认为 20。

```js
config.titleSize = 24;
```

### subTitle

设置图表的副标题。如果为空，则隐藏副标题区域。

```js
config.subTitle = 'by Tag.Hu';
```

### subTitleSize

设置副标题的字号(px)。默认为 12。

```js
config.subTitleSize = 14;
```

### titleAlign

设置标题的位置：

+ 'left' 居左
+ 'center' 居中[默认]
+ 'right' 居右

```js
config.titleAlign = 'left';
```

### legend

是否显示图例。默认为 false。

```js
config.legend = true;
```

### legendData

设置图例数据（需要是数组）。

```js
config.legendData = [
	'A',
	'B',
	'C',
	'D'
];
```

### legendDirection

设置图例方向：

+ 'horizontal' 横向[默认]
+ 'vertical' 纵向

```js
config.legendDirection = 'vertical';
```

### legendAlign

设置图例的横向位置：

+ 'left' 居左
+ 'center' 居中[默认]
+ 'right' 居右

```js
config.legendAlign = 'right';
```

### legendVerticalAlign

设置图例的纵向位置：

+ 'top' 顶部
+ 'bottom' 底部[默认]

```js
config.legendVerticalAlign = 'bottom';
```

### legendItemWidth

图例色块的宽度(px)。默认为 18。

```js
config.legendItemWidth = 24;
```

### legendItemHeight

图例色块的高度(px)。默认为 16。

```js
config.legendItemHeight = 20;
```

### legendItemMargin

图例色块的间距(px)。默认为 4。

```js
config.legendItemMargin = 6;
```

### legendText

设置图例文本，或通过计算产生该文本。

```js
config.legendText = 'OK';
// or
config.legendText = function(d, i) {
	return d;
};
```

如果该值为函数，可以接受两个参数：

+ d 对应的 legendData[i]
+ i 对应的索引

### mouseEvent

设置图表是否允许鼠标事件。默认为 false。

```js
config.mouseEvent = true;
```
