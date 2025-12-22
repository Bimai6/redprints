class RedToast extends HTMLElement {
  private shadow: ShadowRoot;
  private timer?: number;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    const style = document.createElement("style");
    style.textContent = `
    :host {
      display: block;
    }

    [part="wrapper"] {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 1000;
    }

    :host([open]) [part="wrapper"] {
      display: block;
    }

    [part="overlay"] {
      position: fixed;
      inset: 0;
    }

    [part="modal"] {
      position: fixed;
      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
    }
  `;

    const wrapper = document.createElement("div");
    wrapper.setAttribute("part", "wrapper");
    wrapper.innerHTML = `
    <div part="overlay"></div>
    <div part="modal">
      <slot name="header"></slot>
      <slot></slot>
    </div>
  `;

    this.shadow.append(style, wrapper);
  }

  static get observedAttributes() {
    return ["open"];
  }

  show() {
    const duration = Number(this.getAttribute("duration")) || 3000;

    this.setAttribute("open", "");
    this.dispatchEvent(new CustomEvent("toast-opened"));

    clearTimeout(this.timer);
    this.timer = window.setTimeout(() => this.hide(), duration);
  }

  hide() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("toast-closed"));
  }
}

customElements.define("red-toast", RedToast);
