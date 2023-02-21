const drag = (el) => {
    let oDiv = el; //当前元素
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
};

const pop = (el) => {
    el.addEventListener('click', () => {
        let parent = el.parentElement || el.parentNode;
        const node = document.createElement('div');
        node.style.padding = '10px';
        node.style.height = '20px';
        node.style.backgroundColor = '#303133';
        node.style.color = '#fff';
        node.style.position = 'absolute';
        node.style.borderRadius = '4px';
        node.innerText = '您输入的信息有误';
        node.style.fontSize = '12px';
        node.style.lineHeight = '1.2px';
        node.style.top = `${Math.ceil(el.getBoundingClientRect().y) + document.documentElement.scrollTop}px`;
        node.style.left = `${Math.ceil(el.getBoundingClientRect().x)}px`;
        node.style.marginTop = `${el.getBoundingClientRect().height + 5}px`;
        node.style.zIndex = "2020";

        parent.appendChild(node);

        let scrollTop = 0;
        let parentNode = '';
        //滚动事件
        const scrollFun = () => {
            node.style.top = `${Math.ceil(el.getBoundingClientRect().y)}px`;
        };

        //查找出现滚动的父级
        const getParentScrollTop = (element) => {
            let parent = element.parentElement || element.parentNode;
            if (parent.scrollTop === 0) {
                getParentScrollTop(parent)
            }
            else {
                scrollTop = parent.scrollTop;
                parentNode = parent;
                parentNode.addEventListener('scroll', scrollFun)
            }
        };
        getParentScrollTop(el);
        setTimeout(() => {
            if (parentNode) {
                parentNode.removeEventListener('scroll', scrollFun)
            }
            parent.removeChild(node)
        }, 1500)
    });
};
const waterMark = {
    inserted(el, binding) {
        const defaultMark = {
            text: '水印内容',
            angle: 25,
            color: 'rgba(0,0,0,.15)',
            fontSize: '16px',
        };
        Object.assign(defaultMark, binding.value);
        //将旋转度数改成负数
        defaultMark.angle = -Math.abs(defaultMark.angle);
        //随机生成id
        const id = Math.random();
        let prevDivId = null;
        prevDivId = id;
        const canvas = document.createElement('canvas');
        canvas.width = 240;
        canvas.height = 180;
        const pen = canvas.getContext('2d');
        pen.rotate((defaultMark.angle * Math.PI) / 180);
        pen.font = `${defaultMark.fontSize}微软雅黑`;
        pen.fillStyle = defaultMark.color;
        pen.textAlign = 'left';
        pen.textBaseline = 'middle';
        pen.fillText(defaultMark.text, 0, canvas.height);

        const div = document.createElement('div');
        div.id = prevDivId;
        div.style.pointerEvents = 'none';
        div.style.position = 'absolute';
        div.style.top = `${el.getBoundingClientRect().top}px`;
        div.style.left = `${el.getBoundingClientRect().left}px`;
        div.style.zIndex = '9999';
        div.style.width = window.getComputedStyle(el).width;
        div.style.height = window.getComputedStyle(el).height;
        div.style.background = 'url(' + canvas.toDataURL('image/png') + ') left top repeat';
        el.appendChild(div);
    }
};

const lazyModules = {
    inserted: (el, binding, vnode) => {
        el.style.position = 'relative';
        let clientHeight = el.clientHeight;
        let childModules = el.childNodes;
        let hasInView = [];
        //检查进入可视区
        let isIntoView = () => {
            for (let i = 0; i < childModules.length; i++) {
                let scrollTop = el.scrollTop;
                if ((childModules[i].offsetTop - scrollTop) < clientHeight) {
                    if (!hasInView.includes(i)) { //不包含再添加
                        hasInView.push(i);
                        binding.value(i,childModules[i],hasInView)
                    }
                }
            }
        };
        isIntoView();
        el.addEventListener('scroll', () => {
            isIntoView()
        });
    }
}

export default {
    drag,
    pop,
    waterMark,
    lazyModules
}