import{u as k,w as C,y as $,i as f,r as y,a as d,x as s,O as a,h as R}from"./index-BSr_EhCm.js";import{n as _,c as b,o as O,r as j}from"./if-defined-DGmVhyRS.js";import{e as P,n as U}from"./ref-CD41MNL9.js";import{R as T}from"./ConstantsUtil-Dmg8YACJ.js";const u=k({isLegalCheckboxChecked:!1}),x={state:u,subscribe(r){return $(u,()=>r(u))},subscribeKey(r,e){return C(u,r,e)},setIsLegalCheckboxChecked(r){u.isLegalCheckboxChecked=r}},L=f`
  label {
    display: flex;
    align-items: center;
    cursor: pointer;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
    user-select: none;
    column-gap: var(--wui-spacing-1xs);
  }

  label > input[type='checkbox'] {
    height: 0;
    width: 0;
    opacity: 0;
    pointer-events: none;
    position: absolute;
  }

  label > span {
    width: var(--wui-spacing-xl);
    height: var(--wui-spacing-xl);
    min-width: var(--wui-spacing-xl);
    min-height: var(--wui-spacing-xl);
    border-radius: var(--wui-border-radius-3xs);
    border-width: 1px;
    border-style: solid;
    border-color: var(--wui-color-gray-glass-010);
    display: flex;
    align-items: center;
    justify-content: center;
    transition: background-color var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: background-color;
  }

  label > span:hover,
  label > input[type='checkbox']:focus-visible + span {
    background-color: var(--wui-color-gray-glass-010);
  }

  label input[type='checkbox']:checked + span {
    background-color: var(--wui-color-blue-base-90);
  }

  label > span > wui-icon {
    opacity: 0;
    transition: opacity var(--wui-ease-out-power-1) var(--wui-duration-lg);
    will-change: opacity;
  }

  label > input[type='checkbox']:checked + span wui-icon {
    opacity: 1;
  }
`;var m=function(r,e,n,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,n):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,n,i);else for(var l=r.length-1;l>=0;l--)(c=r[l])&&(t=(o<3?c(t):o>3?c(e,n,t):c(e,n))||t);return o>3&&t&&Object.defineProperty(e,n,t),t};let h=class extends d{constructor(){super(...arguments),this.inputElementRef=P(),this.checked=void 0}render(){return s`
      <label>
        <input
          ${U(this.inputElementRef)}
          ?checked=${O(this.checked)}
          type="checkbox"
          @change=${this.dispatchChangeEvent}
        />
        <span>
          <wui-icon name="checkmarkBold" color="inverse-100" size="xxs"></wui-icon>
        </span>
        <slot></slot>
      </label>
    `}dispatchChangeEvent(){var e;this.dispatchEvent(new CustomEvent("checkboxChange",{detail:(e=this.inputElementRef.value)==null?void 0:e.checked,bubbles:!0,composed:!0}))}};h.styles=[y,L];m([_({type:Boolean})],h.prototype,"checked",void 0);h=m([b("wui-checkbox")],h);const E=f`
  :host {
    display: flex;
    align-items: center;
    justify-content: center;
  }
  wui-checkbox {
    padding: var(--wui-spacing-s);
  }
  a {
    text-decoration: none;
    color: var(--wui-color-fg-150);
    font-weight: 500;
  }
`;var v=function(r,e,n,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,n):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,n,i);else for(var l=r.length-1;l>=0;l--)(c=r[l])&&(t=(o<3?c(t):o>3?c(e,n,t):c(e,n))||t);return o>3&&t&&Object.defineProperty(e,n,t),t};let p=class extends d{constructor(){super(),this.unsubscribe=[],this.checked=x.state.isLegalCheckboxChecked,this.unsubscribe.push(x.subscribeKey("isLegalCheckboxChecked",e=>{this.checked=e}))}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}render(){var o;const{termsConditionsUrl:e,privacyPolicyUrl:n}=a.state,i=(o=a.state.features)==null?void 0:o.legalCheckbox;return!e&&!n||!i?null:s`
      <wui-checkbox
        ?checked=${this.checked}
        @checkboxChange=${this.onCheckboxChange.bind(this)}
        data-testid="wui-checkbox"
      >
        <wui-text color="fg-250" variant="small-400" align="left">
          I agree to our ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
        </wui-text>
      </wui-checkbox>
    `}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:n}=a.state;return e&&n?"and":""}termsTemplate(){const{termsConditionsUrl:e}=a.state;return e?s`<a rel="noreferrer" target="_blank" href=${e}>terms of service</a>`:null}privacyTemplate(){const{privacyPolicyUrl:e}=a.state;return e?s`<a rel="noreferrer" target="_blank" href=${e}>privacy policy</a>`:null}onCheckboxChange(){x.setIsLegalCheckboxChecked(!this.checked)}};p.styles=[E];v([j()],p.prototype,"checked",void 0);p=v([b("w3m-legal-checkbox")],p);const W=f`
  .reown-logo {
    height: var(--wui-spacing-xxl);
  }

  a {
    text-decoration: none;
    cursor: pointer;
  }

  a:hover {
    opacity: 0.9;
  }
`;var B=function(r,e,n,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,n):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,n,i);else for(var l=r.length-1;l>=0;l--)(c=r[l])&&(t=(o<3?c(t):o>3?c(e,n,t):c(e,n))||t);return o>3&&t&&Object.defineProperty(e,n,t),t};let g=class extends d{render(){return s`
      <a href=${T} rel="noreferrer" target="_blank" style="text-decoration: none;">
        <wui-flex
          justifyContent="center"
          alignItems="center"
          gap="xs"
          .padding=${["0","0","l","0"]}
        >
          <wui-text variant="small-500" color="fg-100"> UX by </wui-text>
          <wui-icon name="reown" size="xxxl" class="reown-logo"></wui-icon>
        </wui-flex>
      </a>
    `}};g.styles=[y,R,W];g=B([b("wui-ux-by-reown")],g);const D=f`
  :host > wui-flex {
    background-color: var(--wui-color-gray-glass-005);
    margin-top: var(--wui-spacing-s);
  }

  a {
    text-decoration: none;
    color: var(--wui-color-fg-175);
    font-weight: 500;
  }
`;var I=function(r,e,n,i){var o=arguments.length,t=o<3?e:i===null?i=Object.getOwnPropertyDescriptor(e,n):i,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")t=Reflect.decorate(r,e,n,i);else for(var l=r.length-1;l>=0;l--)(c=r[l])&&(t=(o<3?c(t):o>3?c(e,n,t):c(e,n))||t);return o>3&&t&&Object.defineProperty(e,n,t),t};let w=class extends d{render(){var o;const{termsConditionsUrl:e,privacyPolicyUrl:n}=a.state,i=(o=a.state.features)==null?void 0:o.legalCheckbox;return!e&&!n||i?null:s`
      <wui-flex flexDirection="column">
        <wui-flex .padding=${["m","s","s","s"]} justifyContent="center">
          <wui-text color="fg-250" variant="small-400" align="center">
            By connecting your wallet, you agree to our <br />
            ${this.termsTemplate()} ${this.andTemplate()} ${this.privacyTemplate()}
          </wui-text>
        </wui-flex>
        <wui-ux-by-reown></wui-ux-by-reown>
      </wui-flex>
    `}andTemplate(){const{termsConditionsUrl:e,privacyPolicyUrl:n}=a.state;return e&&n?"and":""}termsTemplate(){const{termsConditionsUrl:e}=a.state;return e?s`<a href=${e}>Terms of Service</a>`:null}privacyTemplate(){const{privacyPolicyUrl:e}=a.state;return e?s`<a href=${e}>Privacy Policy</a>`:null}};w.styles=[D];w=I([b("w3m-legal-footer")],w);export{x as O};
