import { html, render } from '../../node_modules/lit-html/lit-html.js';

// uncomment line below to register offline cache service worker
// navigator.serviceWorker.register('../serviceworker.js');

if (typeof fin !== 'undefined') {
    init();
} else {
    document.querySelector('#of-version').innerText =
        'The fin API is not available - you are probably running in a browser.';
}

//once the DOM has loaded and the OpenFin API is ready
async function init() {
    //get a reference to the current Application.
    const app = await fin.Application.getCurrent();
    const win = await fin.Window.getCurrent();

    const ofVersion = document.querySelector('#of-version');
    //ofVersion.innerText = await fin.System.getVersion();
    const version = await fin.System.getVersion();

    // Define a template
    const myTemplate = (version) => html`<span> ${version}</span>`;
    // Render the template to the document
    render(myTemplate(version), ofVersion);

    //Only launch new windows from the main window.
    if (win.identity.name === app.identity.uuid) {
        //subscribing to the run-requested events will allow us to react to secondary launches, clicking on the icon once the Application is running for example.
        //for this app we will  launch a child window the first the user clicks on the desktop.
        app.once('run-requested', async () => {
            await fin.Window.create({
                name: 'childWindow',
                url: location.href,
                defaultWidth: 320,
                defaultHeight: 320,
                autoShow: true
            });
        });
    }
}

class OpenFinButton extends HTMLElement {
    constructor() {
        super();
        // below two lines required
        //this.render = this.render.bind(this);
        //this.createChildWin = this.createChildWin.bind(this);
        this.render();
    }
    render() {
        const btnTemplate = html`
          <button>Hello</button>
        `;
        render(btnTemplate, this);
    }
/*
    async createChildWin() {
        const childName = `child-window-${Date.now()}`;
        const winOption = {
            name: childName,
            defaultWidth: 300,
            defaultHeight: 300,
            url: location.href,
            frame: true,
            autoShow: true
        };
        await fin.Window.create(winOption);
    }*/
}

customElements.define('openfin-button', OpenFinButton);
