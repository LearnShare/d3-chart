LineChart
====

LineChart 继承自 Chart，可以绘制 x/y 坐标轴，以及折线/面积图。

LineChart 可以同时绘制多条线，或者将多条线绘制为堆积图。支持线段、阶梯线和贝赛尔曲线三种类型的线条。

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

是否使用 canvas 绘制折线/面积图（不包含标题区域、坐标轴、图例及 tooltip）。默认为 false。

>开启该选项，将大幅度提高数据量较多时（数千个点及以上）的绘图效率。

### xFormat

设置数据点 x 的格式：

+ 'value' 数值[默认]
+ 'time' 时间（字符串）
+ 'date' 时间（Date 对象）

```js
config.xFormat = 'date';
```

### timeFormat

如果 xFormat = 'time'，则通过该属性配置时间字符串的格式（参考 [d3.time.format](https://github.com/mbostock/d3/wiki/Time-Formatting#format)）。默认为 '%Y-%m-%d %H:%M:%S'('2015-10-30 11:39:47')。

```js
config.timeFormat = '%Y-%m-%d'; // ('2015-10-30')
```

### yFormat

设置数据点 y 的格式：

+ 'value' 数值[默认]
+ 'percentage' 百分数值

如果设置为 'percentage'，则 y 坐标最大值为 100；否则，y 坐标最大值为所有点中最大的 y 值。

```js
config.yFormat = 'percentage';
```

### xTick

设置 x 坐标轴的文本，或通过计算产生该文本。默认为该位置对应数据点的 x 值。

```js
config.xTick = 'OK';
// or
config.xTick = function(d, i) {
	return d3.time.format('%Y-%m')(d);
};
```

如果该值为函数，可以接受两个参数：

+ d 对应数据点的 x 值
+ i 对应的索引

### type

设置图像类型：

+ 'line' 折线图[默认]
+ 'area' 面积图

```js
config.type = 'area';
```

### line

设置线条的类型：

+ 'segment' 折线（线段）[默认]
+ 'curve' 贝赛尔曲线（在 canvas = true 时无效）
+ 'step' 阶梯线

```js
config.line = 'step';
```

### stack

设置多条线是否堆叠显示。默认为 false。

```js
config.stack = true;
```

### tipType

设置 tooltip 的类型：

+ 'separate' 分离（每条线一个）[默认]
+ 'single' 单个

```js
config.tipType = 'single';
```

### tipText

设置 tooltip 的文本，或通过计算产生该文本。默认为该位置对应数据点的 y 值。

```js
config.tipText = 'OK';
// or
config.tipText = function(i, d) {
	return i
			+ '. '
			+ d.toFixed(2);
};
```

如果该值为函数，可以接受两个参数：

+ i 对应的索引
+ d 对应数据点的 y 值
