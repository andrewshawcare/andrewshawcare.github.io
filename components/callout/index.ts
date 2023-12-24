import { html, LitElement, TemplateResult } from "lit";
import { customElement } from "lit/decorators.js";

@customElement("asc-callout")
export default class Callout extends LitElement {
    type: string;

    constructor({ type } = { type: "note" }) {
        super();
        this.type = type;
    }

    protected render(): TemplateResult {
        return html`<p class="${this.type}"><slot></slot></p>`;
    }
}