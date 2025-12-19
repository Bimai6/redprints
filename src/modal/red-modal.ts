class RedModal extends HTMLElement {
  private shadow: ShadowRoot;

  constructor() {
    super();
    this.shadow = this.attachShadow({ mode: "open" });

    const wrapper = document.createElement("div");
    wrapper.setAttribute("part", "wrapper");
    wrapper.innerHTML = `
      <div part="overlay"></div>
      <div part="modal">
        <slot name="header"></slot>
        <slot></slot>
        <slot name="footer"></slot>
      </div>
    `;

    const style = document.createElement("style");
    style.textContent = `
      :host {
        display: block;
      }

      [part="wrapper"] {
        display: none;
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        z-index: 1000;
      }

      :host([open]) [part="wrapper"] {
        display: block;
      }

      [part="overlay"] {
        position: fixed;
        top: 0; left: 0;
        width: 100%; height: 100%;
        background-color: rgba(0,0,0,0.7);
      }

      [part="modal"] {
        position: fixed;
        top: 50%; left: 50%;
        transform: translate(-50%, -50%);
        background-color: white;
        padding: 1.5rem;
        border-radius: 12px;
        width: 300px;
      }
    `;

    this.shadow.appendChild(style);
    this.shadow.appendChild(wrapper);
  }

  connectedCallback() {
    this.addEventListener("click", this.handleClick);
  }

  disconnectedCallback() {
    this.removeEventListener("click", this.handleClick);
  }

  private handleClick = (e: Event) => {
    const target = e.target as HTMLElement;

    if (target.getAttribute("part") === "overlay") {
      this.close();
      this.dispatchEvent(new CustomEvent("modal-cancel"));
    }

    if (target.getAttribute("data-action") === "cancel") {
      this.close();
      this.dispatchEvent(new CustomEvent("modal-cancel"));
    } else if (target.getAttribute("data-action") === "confirm") {
      this.close();
      this.dispatchEvent(new CustomEvent("modal-confirm"));
    }
  };

  open() {
    this.setAttribute("open", "");
    this.dispatchEvent(new CustomEvent("modal-opened"));
  }

  close() {
    this.removeAttribute("open");
    this.dispatchEvent(new CustomEvent("modal-closed"));
  }
}

if (!customElements.get("red-modal")) {
  window.customElements.define("red-modal", RedModal);
}
