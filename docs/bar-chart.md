BarChart
====

BarChart 继承自 Chart，可以绘制 x/y 坐标轴，以及柱状图。

BarChart 可以同时绘制多组数据，或者将多组数据绘制为堆积图。支持将数据排序。

配置属性
----

```js
var config = {};
```

>继承 Chart 的所有配置属性。

### chartMarginX

绘图区域的左右边距(px)，主要用来配合 y 轴文字的宽度。默认为 30。

```js
config.chartMarginX = 50;
```

### chartMarginY

绘图区域的上下边距(px)，主要用来配合 x 轴文字的高度。默认为 20。

```js
config.chartMarginY = 30;
```

### canvas

是否使用 canvas 绘制柱状图（不包含标题区域、坐标轴及图例）。默认为 false。

>开启该选项，将在一定程度上提高绘图效率。

```js
config.canvas = true;
```

### type

设置柱状图的类型：

+ 'group' 分组[默认]
+ 'stack' 堆积

```js
config.type = 'stack';
```

### tiltXText

是否倾斜 x 轴文字（用于解决文字过长的问题）。默认为 false。

```js
config.tiltXText = true;
```

### sortData

通过传入的函数对柱状图进行排序。默认不排序。

```js
config.sortData = function(a, b) {
	return a.sum - b.sum;
};
```

排序函数可以接受两个参数：a b，它们代表了相邻两个组的数据。
