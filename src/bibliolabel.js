import labelTemplate from "./bibliolabel.html?raw";
import labelStyle from "./bibliolabel.css?raw";
import logoH from "./images/logo-h.png?inline"
import logoV from "./images/logo-v.png?inline";
import BwipJs from "@bwip-js/browser";

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
    iFrame.style.display = "none";
    document.body.appendChild(iFrame);

    const frameDoc = iFrame.contentDocument;
    const frameStyle = document.createElement("style");
    frameStyle.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Roboto+Condensed:ital,wght@0,100..900;1,100..900&display=swap');
      html { font-family: 'Roboto Condensed', 'Roboto', sans-serif; }
    `;
    frameDoc.body.appendChild(frameStyle);

    const biblioLabel = new BiblioLabel(this.config);
    frameDoc.body.appendChild(biblioLabel);

    setTimeout(() => {
      iFrame.contentWindow.print();
      iFrame.contentWindow.onafterprint = () => {
        document.body.removeChild(iFrame);
      };
    }, 500);
  }
}

class BiblioLabel extends HTMLElement {
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
    this.setTextContent(".internal-code", "#" + this.config.internal_code);
    this.setTextContent(".isbn", "ISBN" + " " + this.config.isbn);

    BwipJs.toCanvas(this.shadowRoot.querySelector(".qrcode"), {
      bcid: 'qrcode',
      text: `https://backoffice.bibliogram.it/locate/hex/${this.config.unique_code}`
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
customElements.define("biblio-label", BiblioLabel);