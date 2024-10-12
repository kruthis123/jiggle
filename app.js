const state = reactive({
    message: 'Hello Universe',
});

function renderApp() {
    render('#container', `<h1>${state.message}</h1>`);
}

renderApp();

setTimeout(() => {
    state.message = 'Message has changed'
}, 2000);