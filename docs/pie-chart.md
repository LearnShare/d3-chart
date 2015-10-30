PieChart
====

PieChart 继承自 Chart，可以绘制扇形/环形图。支持将数据排序。

配置属性
----

```js
var config = {};
```

>继承 Chart 的所有配置属性。

### radius

设置扇形图的半径比例，或环形图的内外径比例（范围 0~1）。

```js
// 绘制为扇形图
config.radius = 0.8;
// 绘制为环形图
config.radius = [0.6, 0.8];
```

### anglePadding

设置扇形之间的间距（参考 []()）。

```js
config.anglePadding = 0.01;
```

### cornerRadius

设置扇形的圆角半径(px)。

```js
config.cornerRadius = 20;
```

### sortData

通过传入的函数对数据进行排序。

```js
config.sortData = function(a, b) {
	return a.sum - b.sum;
};
```

排序函数可以接受两个参数：a b，它们代表了相邻两个数据。
