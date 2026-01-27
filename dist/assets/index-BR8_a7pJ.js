import{O as D,P as C,d as S,e as m,c as _,k as E,I as G,u as V,S as I,A as f,R,J as T,M as A,w as $,y as B,i as L,a as k,x as d,T as Y}from"./index-BSr_EhCm.js";import{o as b,r as h,c as M}from"./if-defined-DGmVhyRS.js";import"./index-C9s6QKXN.js";import"./index-CZspJyNx.js";import"./index-kSdHRgQ3.js";import"./index-BDLQ_3cj.js";import"./index-DvPHCy1T.js";import"./index-BWDVDgUe.js";import"./index-CJbzLXSd.js";import"./index-D-4PSz6P.js";import"./auth-BxfdJgsU.js";import"./vendor-Cs8wUaRe.js";import"./index-BzF-AT5A.js";const i={INVALID_PAYMENT_CONFIG:"INVALID_PAYMENT_CONFIG",INVALID_RECIPIENT:"INVALID_RECIPIENT",INVALID_ASSET:"INVALID_ASSET",INVALID_AMOUNT:"INVALID_AMOUNT",UNKNOWN_ERROR:"UNKNOWN_ERROR",UNABLE_TO_INITIATE_PAYMENT:"UNABLE_TO_INITIATE_PAYMENT",INVALID_CHAIN_NAMESPACE:"INVALID_CHAIN_NAMESPACE",GENERIC_PAYMENT_ERROR:"GENERIC_PAYMENT_ERROR",UNABLE_TO_GET_EXCHANGES:"UNABLE_TO_GET_EXCHANGES",ASSET_NOT_SUPPORTED:"ASSET_NOT_SUPPORTED",UNABLE_TO_GET_PAY_URL:"UNABLE_TO_GET_PAY_URL",UNABLE_TO_GET_BUY_STATUS:"UNABLE_TO_GET_BUY_STATUS"},y={[i.INVALID_PAYMENT_CONFIG]:"Invalid payment configuration",[i.INVALID_RECIPIENT]:"Invalid recipient address",[i.INVALID_ASSET]:"Invalid asset specified",[i.INVALID_AMOUNT]:"Invalid payment amount",[i.UNKNOWN_ERROR]:"Unknown payment error occurred",[i.UNABLE_TO_INITIATE_PAYMENT]:"Unable to initiate payment",[i.INVALID_CHAIN_NAMESPACE]:"Invalid chain namespace",[i.GENERIC_PAYMENT_ERROR]:"Unable to process payment",[i.UNABLE_TO_GET_EXCHANGES]:"Unable to get exchanges",[i.ASSET_NOT_SUPPORTED]:"Asset not supported by the selected exchange",[i.UNABLE_TO_GET_PAY_URL]:"Unable to get payment URL",[i.UNABLE_TO_GET_BUY_STATUS]:"Unable to get buy status"};class l extends Error{get message(){return y[this.code]}constructor(e,n){super(y[e]),this.name="AppKitPayError",this.code=e,this.details=n,Error.captureStackTrace&&Error.captureStackTrace(this,l)}}const W="https://rpc.walletconnect.org/v1/json-rpc";class H extends Error{}function j(){const t=D.getSnapshot().projectId;return`${W}?projectId=${t}`}async function v(t,e){const n=j(),r=await(await fetch(n,{method:"POST",body:JSON.stringify({jsonrpc:"2.0",id:1,method:t,params:e}),headers:{"Content-Type":"application/json"}})).json();if(r.error)throw new H(r.error.message);return r}async function U(t){return(await v("reown_getExchanges",t)).result}async function F(t){return(await v("reown_getExchangePayUrl",t)).result}async function K(t){return(await v("reown_getExchangeBuyStatus",t)).result}const z={eip155:{native:{assetNamespace:"slip44",assetReference:"60"},defaultTokenNamespace:"erc20"}};function q(t,e){const{chainNamespace:n,chainId:a}=C.parseCaipNetworkId(t),o=z[n];if(!o)throw new Error(`Unsupported chain namespace for CAIP-19 formatting: ${n}`);let r=o.native.assetNamespace,c=o.native.assetReference;return e!=="native"&&(r=o.defaultTokenNamespace,c=e),`${`${n}:${a}`}/${r}:${c}`}async function X(t){const{paymentAssetNetwork:e,activeCaipNetwork:n,approvedCaipNetworkIds:a,requestedCaipNetworks:o}=t,c=S.sortRequestedNetworks(a,o).find(x=>x.caipNetworkId===e);if(!c)throw new l(i.INVALID_PAYMENT_CONFIG);if(c.caipNetworkId===n.caipNetworkId)return;const p=m.getNetworkProp("supportsAllNetworks",c.chainNamespace);if(!((a==null?void 0:a.includes(c.caipNetworkId))||p))throw new l(i.INVALID_PAYMENT_CONFIG);try{await m.switchActiveNetwork(c)}catch(x){throw new l(i.GENERIC_PAYMENT_ERROR,x)}}async function J(t,e,n){var p;if(e!==_.CHAIN.EVM)throw new l(i.INVALID_CHAIN_NAMESPACE);const a=typeof t.amount=="string"?parseFloat(t.amount):t.amount;if(isNaN(a))throw new l(i.INVALID_PAYMENT_CONFIG);const o=((p=t.metadata)==null?void 0:p.decimals)??18,r=E.parseUnits(a.toString(),o);if(typeof r!="bigint")throw new l(i.GENERIC_PAYMENT_ERROR);if(e!==_.CHAIN.EVM)throw new l(i.INVALID_CHAIN_NAMESPACE);return await E.sendTransaction({chainNamespace:e,to:t.recipient,address:n,value:r,data:"0x"})??void 0}async function Q(t,e){const n=t.asset,a=t.recipient,o=Number(t.metadata.decimals),r=E.parseUnits(t.amount.toString(),o);if(r===void 0)throw new l(i.GENERIC_PAYMENT_ERROR);return await E.writeContract({fromAddress:e,tokenAddress:n,args:[a,r],method:"transfer",abi:G.getERC20Abi(n),chainNamespace:_.CHAIN.EVM})??void 0}const O=0,s=V({paymentAsset:{network:"eip155:1",recipient:"0x0",asset:"0x0",amount:0,metadata:{name:"0x0",symbol:"0x0",decimals:0}},isConfigured:!1,error:null,isPaymentInProgress:!1,exchanges:[],isLoading:!1,openInNewTab:!0,redirectUrl:void 0,payWithExchange:void 0,currentPayment:void 0}),u={state:s,subscribe(t){return B(s,()=>t(s))},subscribeKey(t,e){return $(s,t,e)},async handleOpenPay(t){this.resetState(),this.setPaymentConfig(t),this.subscribeEvents(),s.isConfigured=!0,await A.open({view:"Pay"})},resetState(){s.paymentAsset={network:"eip155:1",recipient:"0x0",asset:"0x0",amount:0,metadata:{name:"0x0",symbol:"0x0",decimals:0}},s.isConfigured=!1,s.error=null,s.isPaymentInProgress=!1,s.isLoading=!1,s.currentPayment=void 0},setPaymentConfig(t){if(!t.paymentAsset)throw new l(i.INVALID_PAYMENT_CONFIG);try{s.paymentAsset=t.paymentAsset,s.openInNewTab=t.openInNewTab??!0,s.redirectUrl=t.redirectUrl,s.payWithExchange=t.payWithExchange,s.error=null}catch(e){throw new l(i.INVALID_PAYMENT_CONFIG,e.message)}},getPaymentAsset(){return s.paymentAsset},getExchanges(){return s.exchanges},async fetchExchanges(){try{s.isLoading=!0;const t=await U({page:O});s.exchanges=t.exchanges.slice(0,2)}catch{throw I.showError(y.UNABLE_TO_GET_EXCHANGES),new l(i.UNABLE_TO_GET_EXCHANGES)}finally{s.isLoading=!1}},async getAvailableExchanges(t=O){try{return await U({page:t})}catch{throw new l(i.UNABLE_TO_GET_EXCHANGES)}},async getPayUrl(t,e){try{const n=Number(e.amount);return await F({exchangeId:t,asset:q(e.network,e.asset),amount:n.toString(16),recipient:`${e.network}:${e.recipient}`})}catch(n){throw n instanceof Error&&n.message.includes("is not supported")?new l(i.ASSET_NOT_SUPPORTED):new Error(n.message)}},async openPayUrl(t,e,n=!0){try{const a=await this.getPayUrl(t,e);if(!a)throw new l(i.UNABLE_TO_GET_PAY_URL);const o=n?"_blank":"_self";return S.openHref(a.url,o),a}catch(a){throw a instanceof l?s.error=a.message:s.error=y.GENERIC_PAYMENT_ERROR,new l(i.UNABLE_TO_GET_PAY_URL)}},subscribeEvents(){s.isConfigured||(T.subscribeProviders(async t=>{const e=m.state.activeChain;T.getProvider(e)&&await this.handlePayment()}),f.subscribeKey("caipAddress",async t=>{t&&await this.handlePayment()}))},async handlePayment(){s.currentPayment={type:"wallet"};const t=f.state.caipAddress;if(!t)return;const{chainId:e,address:n}=C.parseCaipAddress(t),a=m.state.activeChain;if(!n||!e||!a||!T.getProvider(a))return;const r=m.state.activeCaipNetwork;if(r&&!s.isPaymentInProgress)try{s.isPaymentInProgress=!0;const c=m.getAllRequestedCaipNetworks(),p=m.getAllApprovedCaipNetworkIds();switch(await X({paymentAssetNetwork:s.paymentAsset.network,activeCaipNetwork:r,approvedCaipNetworkIds:p,requestedCaipNetworks:c}),await A.open({view:"PayLoading"}),a){case _.CHAIN.EVM:s.paymentAsset.asset==="native"&&(s.currentPayment.result=await J(s.paymentAsset,a,n)),s.paymentAsset.asset.startsWith("0x")&&(s.currentPayment.result=await Q(s.paymentAsset,n));break;default:throw new l(i.INVALID_CHAIN_NAMESPACE)}}catch(c){c instanceof l?s.error=c.message:s.error=y.GENERIC_PAYMENT_ERROR,I.showError(s.error)}finally{s.isPaymentInProgress=!1}},getExchangeById(t){return s.exchanges.find(e=>e.id===t)},validatePayConfig(t){const{paymentAsset:e}=t;if(!e)throw new l(i.INVALID_PAYMENT_CONFIG);if(!e.recipient)throw new l(i.INVALID_RECIPIENT);if(!e.asset)throw new l(i.INVALID_ASSET);if(!e.amount)throw new l(i.INVALID_AMOUNT)},handlePayWithWallet(){const t=f.state.caipAddress;if(!t){R.push("Connect");return}const{chainId:e,address:n}=C.parseCaipAddress(t),a=m.state.activeChain;if(!n||!e||!a){R.push("Connect");return}this.handlePayment()},async handlePayWithExchange(t){try{s.currentPayment={type:"exchange",exchangeId:t},s.isPaymentInProgress=!0;const{network:e,asset:n,amount:a,recipient:o}=s.paymentAsset,r={network:e,asset:n,amount:a,recipient:o},c=await this.getPayUrl(t,r);if(!c)throw new l(i.UNABLE_TO_INITIATE_PAYMENT);return s.currentPayment.sessionId=c.sessionId,s.currentPayment.status="IN_PROGRESS",s.currentPayment.exchangeId=t,{url:c.url,openInNewTab:s.openInNewTab}}catch(e){return e instanceof l?s.error=e.message:s.error=y.GENERIC_PAYMENT_ERROR,s.isPaymentInProgress=!1,I.showError(s.error),null}},async getBuyStatus(t,e){try{return await K({sessionId:e,exchangeId:t})}catch{throw new l(i.UNABLE_TO_GET_BUY_STATUS)}},async updateBuyStatus(t,e){try{const n=await this.getBuyStatus(t,e);s.currentPayment&&(s.currentPayment.status=n.status,s.currentPayment.result=n.txHash),(n.status==="SUCCESS"||n.status==="FAILED")&&(s.isPaymentInProgress=!1)}catch{throw new l(i.UNABLE_TO_GET_BUY_STATUS)}}},Z=L`
  wui-separator {
    margin: var(--wui-spacing-m) calc(var(--wui-spacing-m) * -1) var(--wui-spacing-xs)
      calc(var(--wui-spacing-m) * -1);
    width: calc(100% + var(--wui-spacing-s) * 2);
  }

  .token-display {
    padding: var(--wui-spacing-s) var(--wui-spacing-m);
    border-radius: var(--wui-border-radius-s);
    background-color: var(--wui-color-bg-125);
    margin-top: var(--wui-spacing-s);
    margin-bottom: var(--wui-spacing-s);
  }

  .token-display wui-text {
    text-transform: none;
  }

  wui-loading-spinner {
    padding: var(--wui-spacing-xs);
  }
`;var g=function(t,e,n,a){var o=arguments.length,r=o<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,n):a,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,n,a);else for(var p=t.length-1;p>=0;p--)(c=t[p])&&(r=(o<3?c(r):o>3?c(e,n,r):c(e,n))||r);return o>3&&r&&Object.defineProperty(e,n,r),r};let w=class extends k{constructor(){super(),this.unsubscribe=[],this.amount="",this.tokenSymbol="",this.networkName="",this.exchanges=u.state.exchanges,this.isLoading=u.state.isLoading,this.loadingExchangeId=null,this.connectedWalletInfo=f.state.connectedWalletInfo,this.initializePaymentDetails(),this.unsubscribe.push(u.subscribeKey("exchanges",e=>this.exchanges=e)),this.unsubscribe.push(u.subscribeKey("isLoading",e=>this.isLoading=e)),this.unsubscribe.push(f.subscribe(e=>this.connectedWalletInfo=e.connectedWalletInfo)),u.fetchExchanges()}get isWalletConnected(){return f.state.status==="connected"}render(){return d`
      <wui-flex flexDirection="column">
        <wui-flex flexDirection="column" .padding=${["0","l","l","l"]} gap="s">
          ${this.renderPaymentHeader()}

          <wui-flex flexDirection="column" gap="s">
            <wui-flex flexDirection="column" gap="s">
              ${this.isWalletConnected?this.renderConnectedView():this.renderDisconnectedView()}
            </wui-flex>
            <wui-separator text="or"></wui-separator>
            ${this.renderExchangeOptions()}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}initializePaymentDetails(){const e=u.getPaymentAsset();this.networkName=e.network,this.tokenSymbol=e.metadata.symbol,this.amount=e.amount.toString()}renderPaymentHeader(){let e=this.networkName;if(this.networkName){const a=m.getAllRequestedCaipNetworks().find(o=>o.caipNetworkId===this.networkName);a&&(e=a.name)}return d`
      <wui-flex flexDirection="column" alignItems="center">
        <wui-flex alignItems="center" gap="xs">
          <wui-text variant="large-700" color="fg-100">${this.amount||"0.0000"}</wui-text>
          <wui-flex class="token-display" alignItems="center" gap="xxs">
            <wui-text variant="paragraph-600" color="fg-100">
              ${this.tokenSymbol||"Unknown Asset"}
            </wui-text>
            ${e?d`
                  <wui-text variant="small-500" color="fg-200"> on ${e} </wui-text>
                `:""}
          </wui-flex>
        </wui-flex>
      </wui-flex>
    `}renderConnectedView(){var n,a,o;const e=((n=this.connectedWalletInfo)==null?void 0:n.name)||"connected wallet";return d`
      <wui-list-item
        @click=${this.onWalletPayment}
        ?chevron=${!0}
        data-testid="wallet-payment-option"
      >
        <wui-flex alignItems="center" gap="s">
          <wui-wallet-image
            size="sm"
            imageSrc=${b((a=this.connectedWalletInfo)==null?void 0:a.icon)}
            name=${b((o=this.connectedWalletInfo)==null?void 0:o.name)}
          ></wui-wallet-image>
          <wui-text variant="paragraph-500" color="inherit">Pay with ${e}</wui-text>
        </wui-flex>
      </wui-list-item>

      <wui-list-item
        variant="icon"
        iconVariant="overlay"
        icon="disconnect"
        @click=${this.onDisconnect}
        data-testid="disconnect-button"
        ?chevron=${!1}
      >
        <wui-text variant="paragraph-500" color="fg-200">Disconnect</wui-text>
      </wui-list-item>
    `}renderDisconnectedView(){return d`<wui-list-item
      variant="icon"
      iconVariant="overlay"
      icon="walletPlaceholder"
      @click=${this.onWalletPayment}
      ?chevron=${!0}
      data-testid="wallet-payment-option"
    >
      <wui-text variant="paragraph-500" color="inherit">Pay from wallet</wui-text>
    </wui-list-item>`}renderExchangeOptions(){return this.isLoading?d`<wui-flex justifyContent="center" alignItems="center">
        <wui-spinner size="md"></wui-spinner>
      </wui-flex>`:this.exchanges.length===0?d`<wui-flex justifyContent="center" alignItems="center">
        <wui-text variant="paragraph-500" color="fg-100">No exchanges available</wui-text>
      </wui-flex>`:this.exchanges.map(e=>d`
        <wui-list-item
          @click=${()=>this.onExchangePayment(e.id)}
          data-testid="exchange-option-${e.id}"
          ?chevron=${!0}
          ?disabled=${this.loadingExchangeId!==null}
        >
          <wui-flex alignItems="center" gap="s">
            ${this.loadingExchangeId===e.id?d`<wui-loading-spinner color="accent-100" size="md"></wui-loading-spinner>`:d`<wui-wallet-image
                  size="sm"
                  imageSrc=${b(e.imageUrl)}
                  name=${e.name}
                ></wui-wallet-image>`}
            <wui-text flexGrow="1" variant="paragraph-500" color="inherit"
              >Pay with ${e.name} <wui-spinner size="sm" color="fg-200"></wui-spinner
            ></wui-text>
          </wui-flex>
        </wui-list-item>
      `)}onWalletPayment(){u.handlePayWithWallet()}async onExchangePayment(e){try{this.loadingExchangeId=e;const n=await u.handlePayWithExchange(e);n&&(await A.open({view:"PayLoading"}),S.openHref(n.url,n.openInNewTab?"_blank":"_self"))}catch(n){console.error("Failed to pay with exchange",n),I.showError("Failed to pay with exchange")}finally{this.loadingExchangeId=null}}async onDisconnect(e){e.stopPropagation();try{await E.disconnect(),A.close()}catch{console.error("Failed to disconnect"),I.showError("Failed to disconnect")}}disconnectedCallback(){this.unsubscribe.forEach(e=>e())}};w.styles=Z;g([h()],w.prototype,"amount",void 0);g([h()],w.prototype,"tokenSymbol",void 0);g([h()],w.prototype,"networkName",void 0);g([h()],w.prototype,"exchanges",void 0);g([h()],w.prototype,"isLoading",void 0);g([h()],w.prototype,"loadingExchangeId",void 0);g([h()],w.prototype,"connectedWalletInfo",void 0);w=g([M("w3m-pay-view")],w);const ee=L`
  :host {
    display: block;
    height: 100%;
    width: 100%;
  }
`;var P=function(t,e,n,a){var o=arguments.length,r=o<3?e:a===null?a=Object.getOwnPropertyDescriptor(e,n):a,c;if(typeof Reflect=="object"&&typeof Reflect.decorate=="function")r=Reflect.decorate(t,e,n,a);else for(var p=t.length-1;p>=0;p--)(c=t[p])&&(r=(o<3?c(r):o>3?c(e,n,r):c(e,n))||r);return o>3&&r&&Object.defineProperty(e,n,r),r};const te=4e3;let N=class extends k{constructor(){super(),this.loadingMessage="",this.subMessage="",this.paymentState="in-progress",this.paymentState=u.state.isPaymentInProgress?"in-progress":"completed",this.updateMessages(),this.setupSubscription(),this.setupExchangeSubscription()}disconnectedCallback(){clearInterval(this.exchangeSubscription)}render(){return d`
      <wui-flex
        flexDirection="column"
        alignItems="center"
        .padding=${["xl","xl","xl","xl"]}
        gap="xl"
      >
        <wui-flex justifyContent="center" alignItems="center"> ${this.getStateIcon()} </wui-flex>
        <wui-flex flexDirection="column" alignItems="center" gap="xs">
          <wui-text align="center" variant="paragraph-500" color="fg-100">
            ${this.loadingMessage}
          </wui-text>
          <wui-text align="center" variant="small-400" color="fg-200">
            ${this.subMessage}
          </wui-text>
        </wui-flex>
      </wui-flex>
    `}updateMessages(){var e;switch(this.paymentState){case"completed":this.loadingMessage="Payment completed",this.subMessage="Your transaction has been successfully processed";break;case"error":this.loadingMessage="Payment failed",this.subMessage="There was an error processing your transaction";break;case"in-progress":default:((e=u.state.currentPayment)==null?void 0:e.type)==="exchange"?(this.loadingMessage="Payment initiated",this.subMessage="Please complete the payment on the exchange"):(this.loadingMessage="Awaiting payment confirmation",this.subMessage="Please confirm the payment transaction in your wallet");break}}getStateIcon(){switch(this.paymentState){case"completed":return this.successTemplate();case"error":return this.errorTemplate();case"in-progress":default:return this.loaderTemplate()}}setupExchangeSubscription(){var e;((e=u.state.currentPayment)==null?void 0:e.type)==="exchange"&&(this.exchangeSubscription=setInterval(async()=>{var o,r,c;const n=(o=u.state.currentPayment)==null?void 0:o.exchangeId,a=(r=u.state.currentPayment)==null?void 0:r.sessionId;n&&a&&(await u.updateBuyStatus(n,a),((c=u.state.currentPayment)==null?void 0:c.status)==="SUCCESS"&&clearInterval(this.exchangeSubscription))},te))}setupSubscription(){u.subscribeKey("isPaymentInProgress",e=>{var n;!e&&this.paymentState==="in-progress"&&(u.state.error||!((n=u.state.currentPayment)!=null&&n.result)?this.paymentState="error":this.paymentState="completed",this.updateMessages(),setTimeout(()=>{E.state.status!=="disconnected"&&A.close()},3e3))}),u.subscribeKey("error",e=>{e&&this.paymentState==="in-progress"&&(this.paymentState="error",this.updateMessages())})}loaderTemplate(){const e=Y.state.themeVariables["--w3m-border-radius-master"],n=e?parseInt(e.replace("px",""),10):4;return d`<wui-loading-thumbnail radius=${n*9}></wui-loading-thumbnail>`}successTemplate(){return d`<wui-icon size="xl" color="success-100" name="checkmark"></wui-icon>`}errorTemplate(){return d`<wui-icon size="xl" color="error-100" name="close"></wui-icon>`}};N.styles=ee;P([h()],N.prototype,"loadingMessage",void 0);P([h()],N.prototype,"subMessage",void 0);P([h()],N.prototype,"paymentState",void 0);N=P([M("w3m-pay-loading-view")],N);async function fe(t){return u.handleOpenPay(t)}function Ee(){return u.getExchanges()}function Ne(){var t;return(t=u.state.currentPayment)==null?void 0:t.result}function Ie(){return u.state.error}function Ae(){return u.state.isPaymentInProgress}export{N as W3mPayLoadingView,w as W3mPayView,Ee as getExchanges,Ae as getIsPaymentInProgress,Ie as getPayError,Ne as getPayResult,fe as openPay};
