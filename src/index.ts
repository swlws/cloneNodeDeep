/**
 * 为 style 中的样式，添加名空间
 * 
 * @param styleTag 
 * @param namespace 
 * @returns 
 */
function cloneStyleTag(styleTag: HTMLStyleElement, namespace: string) {
    let clonedStyleTag = document.createElement('style');

    // 添加名空间
    let originalStyles = styleTag.textContent ?? '';
    let modifiedStyles = originalStyles.replace(/(^|})([^{@]+)/g, function (match, p1, p2) {
        return p1 + namespace + ' ' + p2.trim();
    });

    clonedStyleTag.textContent = modifiedStyles;
    return clonedStyleTag;
}

/**
 * 生成一段随机数
 * 
 * @returns 
 */
function generateRandom16DigitsAndLetters() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const timestamp = Date.now().toString(); // 获取当前时间戳字符串
    let randomString = '';

    // 将时间戳作为一部分添加到随机字符串中
    for(const char of timestamp){
        randomString += characters.charAt(parseInt(char) % characters.length);
    }

    // 补充剩余的随机字符
    for (let i = timestamp.length; i < 16; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        randomString += characters.charAt(randomIndex);
    }

    return randomString;
}

/**
 * 克隆 Web Component
 * 
 * @param {*} target 
 * @param {*} cloneNodeDeep 
 * @returns 
 */
function cloneWebComponent(target: Node, cloneNodeDeepFn: typeof cloneNodeDeep) {
    // 样式表的名空间
    const namespace = `web-component__${generateRandom16DigitsAndLetters()}`;

    // 临时容器
    const box = document.createElement('div')
    box.classList.add(namespace)

    // web component 子节点
    const childNodes = (target as HTMLElement).shadowRoot?.childNodes;
    if(!childNodes || childNodes.length === 0) return 

    for (const node of childNodes) {
        const tagName = (node as HTMLElement).tagName
        if (tagName === 'STYLE') {
            // 创建 style 节点
            box.append(cloneStyleTag(node as HTMLStyleElement, `.${namespace}`))
        } else {
            // 创建非 style 节点
            const cloneNode = cloneNodeDeepFn(node as HTMLElement)
            cloneNode && box.append(cloneNode)
        }
    }

    return box
}

/**
 * 深度 Clone Node
 *      支持对 Web Component的处理
 * 
 * @param node 
 * @returns 
 */
export function cloneNodeDeep(node: HTMLElement) {
    if (!node) return null;

    let clonedNode;

    // 处理 Web Component 节点
    if (node.shadowRoot) {
        clonedNode = cloneWebComponent(node, cloneNodeDeep)
    } else if (node.nodeType === Node.ELEMENT_NODE) {
        // 元素节点
        clonedNode = node.cloneNode(false) as HTMLElement; // 浅拷贝节点

        // 处理属性
        for(const attr of node.attributes){
            clonedNode.setAttribute(attr.name, attr.value);
        }

        // 处理子节点
        for(const child of node.childNodes){
            const clonedChild = cloneNodeDeep(child as HTMLElement);
            if (clonedChild) {
                clonedNode.appendChild(clonedChild);
            }
        }
    } else {
        clonedNode = node.cloneNode(true);
    }

    return clonedNode;
}