<template>
    <div class="imageView" ref="imageView">
        <div ref="shortImage" style="width: 100%;height: 100%">
            <img :src="imgPath" :style="imageStyle" alt="" v-drag>
            <div class="viewImageFooter">
                <span class="el-icon-zoom-out spanIcon" @click="scale('reduce')"></span>
                <span class="el-icon-full-screen spanIcon" @click="showFullScreen"></span>
                <span class="el-icon-zoom-in spanIcon" @click="scale('add')"></span>
            </div>
        </div>

        <div class="fullScreen" v-if="fullscreen" ref="fullBox">
            <img :src="imgPath" alt="" :style="fullImage" v-drag>
            <div class="closeBtn" @click="closeFullScreen">
                <i class="el-icon-circle-close"></i>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "viewImage",
        props: {
            imgPath: {
                type: String,
                default: ''
            }
        },
        data() {
            return {
                fullscreen: false,
                viewer: '',
                size: 0,
                imageStyle: {
                    position: 'absolute',
                    top: 0,
                    left: 0,
                    width: '100%',
                    height: '100%',
                    "-ms-transform": "scale(1,1)", /* IE 9 */
                    "-webkit-transform": "scale(1, 1)", /* Safari */
                    "transform": "scale(1,1)", /* 标准语法 */
                },
                fullImage: {
                    position: 'absolute',
                    display: 'block',
                    width: "500px",
                    height: "300px",
                    left: '50%',
                    top: '50%',
                    "object-fit": 'cover',
                    "-ms-transform": "translate(-50%,-50%) scale(1,1)", /* IE 9 */
                    "-webkit-transform": "translate(-50%,-50%) scale(1,1)", /* Safari */
                    "transform": "translate(-50%,-50%) scale(1,1)", /* 标准语法 */
                }
            }

        },
        created() {
        },
        mounted() {
            this.mouseScroll()
        },
        methods: {
            scale(type) {
                if (this.size === 0) {
                    this.size = 1;
                }
                let speed = 0.1;
                if (type === 'reduce') {
                    this.size = this.size - speed;
                    if (this.size < 0.1) {
                        this.size = 0.1
                    }
                }
                else if (type === 'add') {
                    this.size = this.size + speed;
                }
                if (this.fullscreen) {
                    this.fullImage["-ms-transform"] = `translate(-50%,-50%) scale(${this.size},${this.size})`;
                    this.fullImage["-webkit-transform"] = `translate(-50%,-50%) scale(${this.size},${this.size})`;
                    this.fullImage["transform"] = `translate(-50%,-50%) scale(${this.size},${this.size})`;
                }
                else {
                    this.imageStyle["-ms-transform"] = `scale(${this.size},${this.size})`;
                    this.imageStyle["-webkit-transform"] = `scale(${this.size},${this.size})`;
                    this.imageStyle["transform"] = `scale(${this.size},${this.size})`;
                }
            },
            //鼠标滑轮事件
            mouseScroll() {
                let _this = this;

                function scroll(e) {
                    let ev = e || window.event;
                    if (ev.wheelDelta > 0) {
                        _this.scale('add')
                    }
                    else if (ev.wheelDelta < 0) {
                        _this.scale('reduce')
                    }
                    if (!_this.isIE()) {
                        ev.preventDefault();//阻止默认事件
                    }
                    else {
                        return false;//阻止默认事件
                    }
                }

                if (window.addEventListener) {
                    this.$refs.shortImage.addEventListener('DOMMouseScroll', scroll, false);
                }
                if (document.attachEvent) {//ie
                    this.$refs.shortImage.attachEvent('onmousewheel', scroll);
                }
                this.$refs.shortImage.onmousewheel = scroll;
                if (this.fullscreen) {
                    if (window.addEventListener) {
                        this.$refs.fullBox.addEventListener('DOMMouseScroll', scroll, false);
                    }
                    if (document.attachEvent) {//ie
                        this.$refs.fullBox.attachEvent('onmousewheel', scroll);
                    }
                    this.$refs.fullBox.onmousewheel = scroll;
                }
            },
            showFullScreen() {
                this.fullscreen = true;
                this.$nextTick(() => {
                    this.mouseScroll()
                })
            },
            closeFullScreen() {
                this.fullscreen = false;
            },

            isIE() { //ie?
                if (!!window.ActiveXObject || "ActiveXObject" in window) {
                    return true;
                }
                else {
                    return false;
                }
            }

        },
        directives: {
            drag(el) {
                let oDiv = el; //当前元素
                let self = this; //上下文
                //禁止选择网页上的文字
                document.onselectstart = function () {
                    return false;
                };
                oDiv.onmousedown = function (e) {
                    //鼠标按下，计算当前元素距离可视区的距离
                    let disX = e.clientX - oDiv.offsetLeft;
                    let disY = e.clientY - oDiv.offsetTop;
                    document.onmousemove = function (e) {
                        //通过事件委托，计算移动的距离
                        let l = e.clientX - disX;
                        let t = e.clientY - disY;
                        //移动当前元素
                        oDiv.style.left = l + "px";
                        oDiv.style.top = t + "px";
                    }
                    document.onmouseup = function (e) {
                        document.onmousemove = null;
                        document.onmouseup = null;
                    };
                    //return false不加的话可能导致黏连，就是拖到一个地方时div粘在鼠标上不下来，相当于onmouseup失效
                    return false;
                };
            }
        }
    }
</script>

<style lang="less" scoped>
    .imageView {
        position: relative;
        width: 100%;
        height: 100%;
        background-color: rgb(255, 255, 255);
        overflow: hidden;
        .viewImageFooter {
            position: absolute;
            width: 284px;
            height: 44px;
            background-color: #606266;
            bottom: 10px;
            border-radius: 22px;
            padding: 0 23px;
            left: calc(50% - 142px);
            text-align: center;
            line-height: 44px;
            .spanIcon {
                color: white;
                font-size: 18px;
                letter-spacing: 8px;
            }
        }
        .fullScreen {
            position: fixed;
            top: 0;
            left: 0;
            right: 0;
            bottom: 0;
            background-color: rgba(0, 0, 0, 0.3);
            z-index: 2000;
            .closeBtn {
                position: absolute;
                width: 50px;
                height: 50px;
                top: 50px;
                right: 80px;
                font-size: 40px;
            }
        }
    }
</style>