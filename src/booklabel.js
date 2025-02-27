import labelTemplate from "./booklabel.html?raw";
import labelStyle from "./booklabel.scss?inline";
import logoH from "./images/logo-h.png?inline"
import logoV from "./images/logo-v.png?inline";
import BwipJs from "@bwip-js/browser";
// Label format styles
import Style89x36 from "./label-sizes/89x36.scss?inline";

export class BookLabel {
  config = {
    unique_code: null,
    internal_code: null,
    isbn: null,
    title: null,
    author: null,
    size: null
  }
  constructor(config) {
    Object.assign(this.config, config);
  }
  print() {
    const iFrame = document.createElement("iframe");
    iFrame.setAttribute("width", "0px");
    iFrame.setAttribute("height", "0px");
    iFrame.style.visibility = 'hidden';
    document.body.appendChild(iFrame);
    const frameDoc = iFrame.contentDocument;
    iFrame.contentWindow.addEventListener('afterprint', () => {
      document.body.removeChild(iFrame);
    });

    const link = document.createElement('link');
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap';
    link.addEventListener("load", () => {
      frameDoc.fonts.ready.then(() => {
        setTimeout(() => { // give time to qr-code and barcode to be generated before print
          iFrame.contentWindow.print();
        }, 1000); //??
      });
    })
    frameDoc.head.appendChild(link);

    function parseLabelsize(value) {
      let [width, height] = value.split("x");
        
      return {
        width: width ? width : null,
        height: height ? height : null
      };
    }

    const sizes = parseLabelsize(this.config.size);
      
    const frameStyle = document.createElement("style");
    frameStyle.innerText = `html { font-family: 'Roboto Condensed', 'Roboto', sans-serif; } html, body { margin: 0; padding: 0; } @page { size: ${sizes.width}mm ${sizes.height}mm; margin: 0; }`;
    frameDoc.body.appendChild(frameStyle);
    
    const bookLabel = new BookLabelElement(this.config);
    frameDoc.body.appendChild(bookLabel);
  }
}

class BookLabelElement extends HTMLElement {
  constructor(config) {
    super();
    this.config = config;
    this.attachShadow({ mode: "open" });
  }

  connectedCallback() {
    const parser = new DOMParser();
    const template = parser.parseFromString(labelTemplate, 'text/html').getElementById('label-template').content.cloneNode(true);

    const style = document.createElement('style');
    style.textContent = `
      :host { font-family: 'Roboto Condensed', 'Roboto', sans-serif; }
      ${labelStyle}
      ${Style89x36}
    `;
    this.shadowRoot.appendChild(style);
    this.shadowRoot.appendChild(template);

    const configSizePrefix = "f";
    this.shadowRoot.querySelector("#label").className = configSizePrefix.concat(this.config.size.trim());

    this.shadowRoot.querySelector(".logo.vertical").src = logoV;
    this.shadowRoot.querySelector(".logo.horizontal").src = logoH;

    this.setTextContent(".title", this.config.title);
    this.setTextContent(".author", this.config.author);
    this.setTextContent(".unique-code", this.config.unique_code);
    this.setTextContent(".internal-code", `#${this.config.internal_code}`);
    this.setTextContent(".isbn", `ISBN ${this.config.isbn}`);

    BwipJs.toCanvas(this.shadowRoot.querySelector(".qrcode"), {
      bcid: 'qrcode',
      text: `https://locate.bibliogram.it/buid/${this.config.unique_code}`
    });
    BwipJs.toCanvas(this.shadowRoot.querySelector(".barcode"), {
      bcid: 'code128',
      text: this.config.unique_code,
      width: 80
    });
  }

  setTextContent(selector, text) {
    this.shadowRoot.querySelector(selector).textContent = text;
  }
}
customElements.define("book-label", BookLabelElement);