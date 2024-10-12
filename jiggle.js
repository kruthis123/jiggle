const depsMap = new Map();
let currentEffect = null;
const effectsStack = [];

function render(element, content) {
    const app = document.querySelector(element);
    if (app !== null) {
        app.innerHTML = content;
    }
}

function reactive(obj) {
    const keys = Object.keys(obj);
    const reactiveObj = {};
    keys.forEach((key) => {
        let value = obj[key];
        Object.defineProperty(reactiveObj, key, {
            get: () => {
                console.log('Getting value: ', value);
                track(reactiveObj, key);
                return value;
            },
            set: (newValue) => {
                console.log('Setting value as ', newValue);
                value = newValue;
                trigger(reactiveObj, key);
            }
        });
    });
    return reactiveObj;
}

function createEffect(fn) {
    const effect = function effect() {
        if (effectsStack.indexOf(effect) === -1) {
            try {
                currentEffect = effect;
                effectsStack.push(effect);
                return fn();
            } finally {
                effectsStack.pop();
                currentEffect = effectsStack[effectsStack.length -1];
            }
        }
    }
    effect();
}

function track(targetState, key) {
    if (currentEffect) {
        let deps = depsMap.get(targetState);
        if (!deps) {
            deps = new Map();
            depsMap.set(targetState, deps);
        }
        let dep = deps.get(key);
        if (!dep) {
            dep = new Set();
            deps.set(key, dep);
        }
        dep.add(currentEffect);
    }
}

function trigger(targetState, key) {
    let deps = depsMap.get(targetState);
    if (!deps) return;
    const dep = deps.get(key);
    if (dep) {
        const effectsToRun = new Set(dep);
        effectsToRun.forEach(effect => {
            effect();
        });
    }
}