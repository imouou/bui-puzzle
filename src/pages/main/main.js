/**
 * 拼图游戏
 * 默认模块名: main
 * @return {[object]}  [ 返回一个对象 ]
 */
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
                    // 触发2次修改视图
                    // this.puzzles.$set(index - 1, curNum)
                    // this.puzzles.$set(index, '')

                    // 只修改数据，不触发视图
                    this.$data.puzzles[index - 1] = curNum;
                    this.$data.puzzles[index] = '';
                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);
                } else if (rightNum === '' && 3 !== index % 4) {

                    // 触发2次修改视图
                    // this.puzzles.$set(index + 1, curNum)
                    // this.puzzles.$set(index, '')

                    // 只修改数据，不触发视图
                    this.$data.puzzles[index + 1] = curNum;
                    this.$data.puzzles[index] = '';

                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);

                } else if (topNum === '') {
                    // 触发2次修改视图
                    // this.puzzles.$set(index - 4, curNum)
                    // this.puzzles.$set(index, '')

                    // 只修改数据，不触发视图
                    this.$data.puzzles[index - 4] = curNum;
                    this.$data.puzzles[index] = '';
                    // 触发一次视图
                    this.puzzles.$replace(this.$data.puzzles);
                } else if (bottomNum === '') {
                    // 触发2次修改视图
                    // this.puzzles.$set(index + 4, curNum)
                    // this.puzzles.$set(index, '')

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