# 【BUI实战篇】BUI数据驱动做的拼图游戏 Webapp移动适配版，基于vuejs拼图游戏改造

原文链接： https://segmentfault.com/a/1190000019865515


## 前言
`bui.store`几乎完全参照 `vuejs`的api设计，基于DOM的数据驱动。刚好看到一个有意思的基于vuejs设计的拼图游戏，于是动手转换，把整个开发过程记录下来，并做了移动端适配，优化，拼图源码的创意归原作者所有。

## 玩一玩

![拼图游戏](images/效果图.jpg)

[在线拼图玩一玩](https://imouou.github.io/bui-puzzle/dist/#main)

## 代码分析

### vuejs版核心

该拼图游戏项目来源于：https://github.com/luozhihao/vue-puzzle/

App.vue 核心代码：具体的实现可以查看源码，这里只保留基本的结构。

```html
<template>
    <div class="box">
        <ul class="puzzle-wrap">
            <li 
                :class="{'puzzle': true, 'puzzle-empty': !puzzle}" 
                v-for="puzzle in puzzles" 
                v-text="puzzle"
                @click="moveFn($index)"
            ></li>
        </ul>
        <button class="btn btn-warning btn-block btn-reset" @click="render">重置游戏</button>
    </div>
</template>

<script>
export default {
    data () {
        return {
            puzzles: []
        }
    },
    methods: {
        // 重置渲染
        render () {
            //部分省略
            this.puzzles = puzzleArr
            this.puzzles.push('')
        },

        // 点击方块
        moveFn (index) {
            //省略
        },

        // 校验是否过关
        passFn () {
            //省略
        }
    },
    mounted () {
        this.render()
    }
}
</script>

```

> 样式部分代码暂时去掉

## 从零开始，基于bui.store改造过程

### 1. 新建BUI工程，工程名：`bui-puzzle`

```bash
# 创建工程
buijs create bui-puzzle
```

![工程预览](images/gongchenghua.png)

> 如果没有安装 `buijs构建工具`, 可以直接[点击下载单页工程包](http://www.easybui.com/downloads/source/bui/bui_router_dev_latest.zip)

### 2. 运行预览效果

```bash
# 进入文件夹
cd bui-puzzle

# 安装依赖
npm install

# 起服务预览效果
npm run dev 
```

> 这些是工程化的处理，这个游戏只有一个页面，也没有数据请求那些，所以直接打开 index.html 就可以了。

![预览](images/preview.png)

### 3. 修改模板 main.html

> 了解bui的都知道，单页工程里面，打开`index.html` 默认会加载 `pages/main/main.html` ,`pages/main/main.js` 模板，所以我们接下来要更改这2个文件，一个是模板，一个是逻辑。

**main.html**

我们把它改成这样，去掉顶部图标，修改标题，去掉footer标签，把vuejs版的内容复制过来，放在main标签里面，做以下修改。

```html
<div class="bui-page">
    <header class="bui-bar">
        <div class="bui-bar-left"> </div>
        <div class="bui-bar-main">BUI拼图游戏-数据驱动</div>
        <div class="bui-bar-right"> </div>
    </header>
    <main>
        <div class="box">

            <ul class="puzzle-wrap" b-template="page.tplGame(page.puzzles)"></ul>

            <button class="bui-btn" b-click="page.render">重置游戏</button>
        </div>
    </main>
</div>
```

> 说明：bui-page是标准的页面结构，main标签是滚动的内容容器；`b-`开头的是 `bui.store`的行为属性，`b-template`为模板，`b-click`为事件。值为 `page.xxx` page可以理解为自定义的作用域，初始化的时候的 scope参数。

### 4. 修改模块 main.js

![初始化bui.store](images/bui-store.gif)

main.js  输入`bui-store`，生成初始化，需要安装 `bui-fast`（vscode直接搜索插件`bui-fast`安装），把刚刚导出的模块里面的方法，复制到 `methods`, `templates` 为 `main.html` 指向的模板名`tplGame`。


```js
loader.define(function(require, exports, module) {

    // 初始化数据行为存储， this 指向当前模块, bs 为 Behavior Store 简称。
    let bs = bui.store({
        //el: ".bui-page",
        scope: "page",
        data: {
            puzzles: []
        },
        methods: {
            // 重置渲染
            render() {
                //部分省略
                puzzleArr.push('');
                // 这里不能直接采用赋值，需要使用数组提供的方法才能触发视图更新
	            this.puzzles.$replace(puzzleArr)
            },

            // 点击方块
            moveFn(index) {
                //省略
            },

            // 校验是否过关
            passFn() {
                //省略
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplGame(data) {
                // b-template指向当前模板
                var html = "";
                
                // 返回结构
                return html;
            }
        },
        mounted: function() {
            // 数据解析后执行
            this.render();
        }
    })
})
```

**参数说明**
- el:".bui-page" 默认指向 `.bui-page` ,使用标准结构则不用管这个参数；
- scope:"page" 默认可以都写`page`, 这个可以理解为作用域，写模板的时候，需要以这样 `page.xxx` 指向对应的方法或者数据；
- templates:{} 为 `b-template` 指向的模板方法名，需要返回对应的结构；

其它基本跟vuejs保持一致。初始化必须写在 `loader.define` 里面。

## 最终代码

main.html

```html
<style>
@import url('css/bootstrap.min.css');

body {
    font-family: Arial, "Microsoft YaHei"; 
}

.box {
    width: 400px;
    margin: 50px auto 0;
}

.puzzle-wrap {
    width: 400px;
    height: 400px;
    margin-bottom: 40px;
    padding: 0;
    background: #ccc;
    list-style: none;
}

.puzzle {
    float: left;
    width: 100px;
    height: 100px;
    font-size: 20px;
    background: #f90;
    text-align: center;
    line-height: 100px;
    border: 1px solid #ccc;
    box-shadow: 1px 1px 4px;
    text-shadow: 1px 1px 1px #B9B4B4;
    cursor: pointer;
}

.puzzle-empty {
    background: #ccc;
    box-shadow: inset 2px 2px 18px;
}

.btn-reset {
    box-shadow: inset 2px 2px 18px;
}
</style>
<div class="bui-page">
    <header class="bui-bar">
        <div class="bui-bar-left"> </div>
        <div class="bui-bar-main">BUI拼图游戏-数据驱动</div>
        <div class="bui-bar-right"> </div>
    </header>
    <main>
        <div class="box">

            <ul class="puzzle-wrap bui-fluid-4" b-template="page.tplGame(page.puzzles)"></ul>

            <button class="bui-btn warning round" b-click="page.render">重置游戏</button>
        </div>
    </main>
</div>
```


main.js

```js
/**
 * 拼图游戏
 * 默认模块名: main
 */
loader.define(function(require, exports, module) {

    // 初始化数据行为存储
    var bs = bui.store({
        scope: "page",
        data: {
            puzzles: []
        },
        methods: {
        	// 重置渲染
	        render:function() {
	            let puzzleArr = [],
	                i = 1

	            // 生成包含1 ~ 15数字的数组
	            for (i; i < 16; i++) {
	                puzzleArr.push(i)
	            }

	            // 随机打乱数组
	            puzzleArr = puzzleArr.sort(() => {
	                return Math.random() - 0.5
	            });

	            // 页面显示,前面声明是数组以后，不能使用赋值监听到变更,先处理再替换，这样只触发一次视图变更
	            puzzleArr.push('');
	            this.puzzles.$replace(puzzleArr)
	        },

	        // 点击方块
	        moveFn:function (index) {

	            // 获取点击位置及其上下左右的值
	            let curNum = this.puzzles[index],
	                leftNum = this.puzzles[index - 1],
	                rightNum = this.puzzles[index + 1],
	                topNum = this.puzzles[index - 4],
	                bottomNum = this.puzzles[index + 4]

	            // 和为空的位置交换数值
	            if (leftNum === '' && index % 4) {
	                this.puzzles.$set(index - 1, curNum)
	                this.puzzles.$set(index, '')
	            } else if (rightNum === '' && 3 !== index % 4) {
	                this.puzzles.$set(index + 1, curNum)
	                this.puzzles.$set(index, '')
	            } else if (topNum === '') {
	                this.puzzles.$set(index - 4, curNum)
	                this.puzzles.$set(index, '')
	            } else if (bottomNum === '') {
	                this.puzzles.$set(index + 4, curNum)
	                this.puzzles.$set(index, '')
	            }

	            this.passFn()
	        },

	        // 校验是否过关
	        passFn:function () {
	            if (this.$data.puzzles[15] === '') {
	                const newPuzzles = this.puzzles.slice(0, 15)

	                const isPass = newPuzzles.every((e, i) => e === i + 1)

	                if (isPass) {
	                    alert ('恭喜，闯关成功！')
	                }
	            }
	        }
        },
        watch: {},
        computed: {},
        templates: {
        	tplGame: function (data) {
        		var html = "";
        		data.forEach(function (puzzle,index) {
        			var hasEmpty = !puzzle ? "puzzle-empty" : "";
        		 	html +=`<li class="puzzle ${hasEmpty}" b-click="page.moveFn($index)">${puzzle}</li>`
        		})
        		return html;
        	}
        },
        mounted: function(){
            // 数据解析后执行
            this.render();
        }
    })
})

```

> 这里我们的方法定义改为了 es5的写法，移动端有些对es6并不友好。

## vuejs 跟 bui.store 对比

通过比对 `vuejs` 版跟 `bui.store`版本，你会发现，里面的业务方法几乎不用改变，重点在vuejs 模板引擎转换成 bui的模板的思路转换，bui模板里面使用 es6模板引擎，每次数据改变都会把模板重新渲染一遍，无需通过虚拟Dom去比对改变的位置。

### vuejs 

- 双向绑定
- 虚拟Dom
- 单文件组件
- 模板引擎

### bui.store

- 双向绑定；
- 真实Dom，可以跟Dom的UI更好配合；
- 组件分离，模板及逻辑，这样模板及脚本可以得到缓存，按需加载，也支持以单文件组件加载；
- 无模板引擎，模板的渲染在脚本，无需过多关注模板，当然你可以使用第三方模板引擎配合；
- 支持私有数据及公有数据；
- 模块的访问是并行的，各自管自己，之间的访问无需像组件树一样，从上到下传参；


## 优化

`bui.store`是基于真实Dom的数据驱动。当数据改变以后，会找到对应的选择器做对应的变更。上面的例子如果你在 `tplGame`模板方法里面输出，你会发现，每次点击一个方块，会有2次触发，意味着有2次Dom渲染，这个应该避免。

优化后的 main.js

```js
loader.define(function(require, exports, module) {

    // 初始化数据行为存储
    let bs = bui.store({
        scope: "page",
        data: {
            puzzles: []
        },
        methods: {
            // 重置渲染
            render: function() {

                let puzzleArr = [],
                    i = 1

                // 生成包含1 ~ 15数字的数组
                for (i; i < 16; i++) {
                    puzzleArr.push(i)
                }

                // 随机打乱数组
                puzzleArr = puzzleArr.sort(() => {
                    return Math.random() - 0.5
                });

                // 页面显示,前面声明是数组以后，不能使用赋值监听到变更,先处理再替换，这样只触发一次视图变更
                puzzleArr.push('');
                // 这里如果直接赋值不会触发视图更新
                // this.puzzles = puzzleArr;
                this.puzzles.$replace(puzzleArr);

            },

            // 点击方块
            moveFn: function(index) {
                // 获取点击位置及其上下左右的值
                let curNum = this.$data.puzzles[index],
                    leftNum = this.$data.puzzles[index - 1],
                    rightNum = this.$data.puzzles[index + 1],
                    topNum = this.$data.puzzles[index - 4],
                    bottomNum = this.$data.puzzles[index + 4]

                // 和为空的位置交换数值
                if (leftNum === '' && index % 4) {
                    // 只修改数据，不触发视图
                    this.$data.puzzles[index - 1] = curNum;
                    this.$data.puzzles[index] = '';
                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);
                } else if (rightNum === '' && 3 !== index % 4) {
                    // 只修改数据，不触发视图
                    this.$data.puzzles[index + 1] = curNum;
                    this.$data.puzzles[index] = '';

                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);

                } else if (topNum === '') {
                    // 只修改数据，不触发视图
                    this.$data.puzzles[index - 4] = curNum;
                    this.$data.puzzles[index] = '';
                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);
                } else if (bottomNum === '') {
                    // 只修改数据，不触发视图
                    this.$data.puzzles[index + 4] = curNum;
                    this.$data.puzzles[index] = '';
                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);
                }
                this.passFn()
            },

            // 校验是否过关
            passFn: function() {
                if (this.$data.puzzles[15] === '') {
                    const newPuzzles = this.$data.puzzles.slice(0, 15)
                    const isPass = newPuzzles.every((e, i) => e === i + 1)

                    if (isPass) {
                        bui.alert('恭喜，闯关成功！')
                    }
                }
            }
        },
        watch: {},
        computed: {},
        templates: {
            tplGame: function(data) {
                var html = "";
                data.forEach(function(puzzle, index) {
                    var hasEmpty = !puzzle ? "puzzle-empty" : "";
                    html += `<li class="puzzle ${hasEmpty}" b-click="page.moveFn($index)">${puzzle}</li>`
                })
                return html;
            }
        },
        mounted: function() {
            // 数据解析后执行
            this.render();
        }
    })
})
```

**优化说明**


- `this.puzzles` 改成了 `this.$data.puzzles`，这里数据的访问只有一层，所以没有出现问题；
- 用来访问的值应该使用 `this.$data.puzzles`；
- 当`this.abc = 123` 的时候， `this.$data.abc === 123 `; 
- 当`this.$data.abc = 123;` `this.abc` 还是等于原来的值；
- `this.abc` 会触发视图更新，`this.$data.abc` 则不会。


例子：

这里修改一次数据，改成就会触发一次视图更新，造成2次页面渲染。
```js
this.puzzles.$set(index + 1, curNum); this.puzzles.$set(index, '');
``` 

优化：

```js
// 只修改数据，不触发视图
this.$data.puzzles[index + 4] = curNum;
this.$data.puzzles[index] = '';
// 最后触发一次视图
this.puzzles.$replace(this.$data.puzzles);
```

## 适配

这个效果在PC效果还不错，但到了手机端就成了这样，手机无法正常操作。

![拼图不适配手机](images/iphone.png)

优化：去除引入 bootstrap样式， 按照BUI的750设计规范，把效果图转成 rem 单位。`1rem=100px`，宽度只要不大于750就不会有横向滚动条。把原本的float布局也改为 `bui-fluid-4`列布局，里面只需要定义好高度就可以了。

```html
<style type="text/css">
    .box {
        width: 6.8rem;
        margin: .4rem auto 0;
    }
    
    .puzzle-wrap {
        width: 100%;
        height: 6.8rem;
        margin-bottom: .4rem;
        padding: 0;
        background: #ccc;
    }
    
    .puzzle {
        width: 1.7rem;
        height: 1.7rem;
        font-size: .4rem;
        background: #f90;
        text-align: center;
        line-height: 1.7rem;
        border: 1px solid #ccc;
        box-shadow: 1px 1px 4px;
        text-shadow: 1px 1px 1px #B9B4B4;
        cursor: pointer;
    }
    
    .puzzle-empty {
        background: #ccc;
        box-shadow: inset 2px 2px 18px;
    }
</style>
<div class="bui-page">
    <header class="bui-bar">
        <div class="bui-bar-left"> </div>
        <div class="bui-bar-main">BUI拼图游戏-数据驱动</div>
        <div class="bui-bar-right"> </div>
    </header>
    <main>
        <div class="box">
            <ul class="puzzle-wrap bui-fluid-4" b-template="page.tplGame(page.puzzles)"></ul>

            <button class="bui-btn warning round" b-click="page.render">重置游戏</button>
        </div>
    </main>
</div>
```

**优化后的适配效果图：**

| iPhone5             | iPhone678   | iPhone678 Plus  |
|:--------------------|---------------|---:|
| ![iphone5](images/iphone5.png) |![iphone5](images/iphone678.png)      | ![iphone678](images/iphone678p.png) |

## 最后一步

执行编译压缩，把工程生成 `dist` 目录，这个就是用来发布的文件夹，代码会执行转换编译成es5以及把js压缩。

```bash
npm run build
```

## 源码下载

该源码放在[bui-puzzle](https://github.com/imouou/bui-puzzle)。喜欢就给颗星星吧。^_^


## 结语

谢谢阅读！欢迎关注[BUI Webapp专栏](https://segmentfault.com/blog/easybui)。BUI还有很多姿势等待你的开启。

- [BUI官网](http://www.easybui.com)

## 专栏往期热门文章：

- [2019开发最快的Webapp框架--BUI交互框架](https://segmentfault.com/a/1190000012994082)
- [微信Webapp开发的各种变态路由需求及解决办法!](https://segmentfault.com/a/1190000015493097)
- [webapp结合Dcloud平台打包图文教程](https://segmentfault.com/a/1190000015902575)
- [一张脑图看懂BUI Webapp移动快速开发框架【上】--框架与工具、资源](https://segmentfault.com/a/1190000019835124)