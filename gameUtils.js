/**
 * @description 游戏工具
 * @author 齐皓
 * @Date 2020/4/29
 */

export function imagesLoader(images = []) {
  const { length } = images;
  let loadCount = 0;
  let loadImgElMap = {};
  return new Promise(((resolve, reject) => {
    images.forEach((image, index) => {
      const imageEl = document.createElement('img');
      imageEl.src = image.url;
      imageEl.id = image.id;
      imageEl.style.position = 'absolute';
      imageEl.style.top = '-9999px';
      imageEl.style.width = '1px'
      imageEl.style.height = '1px'
      document.body.appendChild(imageEl);
      imageEl.onload = () => {
        loadImgElMap[image.id] = imageEl;
        loadCount++;
        if (loadCount === length) {
          resolve(['success', loadImgElMap]);
        }
      }
    })
  }))
}

export function collisionDetect(item, target) {
  const L1 = item.x;
  const R1 = item.x + item.width;
  const T1 = item.y;
  const B1 = item.y + item.height;
  const L2 = target.x;
  const R2 = target.x + target.width;
  const T2 = target.y;
  const B2 = target.y + target.height;
  return !(R1 < L2 || L1 > R2 || T1 > B2 || B1 < T2);
}

export function abs(number) {
  return Math.abs(number);
}

export function sin(rotation) {
  return Math.sin(rotation * Math.PI / 180)
}

export function cos(rotation) {
  return Math.cos(rotation * Math.PI / 180)
}

export function atan(tan) {
  return Math.atan(tan) / (Math.PI / 180);
}


