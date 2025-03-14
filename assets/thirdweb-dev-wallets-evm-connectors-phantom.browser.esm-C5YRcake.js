import{l as u,_ as m,w as p,b as l,U as d,c as w,R as g}from"./index-BzFxWc_h.js";import{InjectedConnector as f}from"./thirdweb-dev-wallets-evm-connectors-injected.browser.esm-BAmJ5dbD.js";class U extends f{constructor(t){const n={...{name:"Phantom",shimDisconnect:!0,shimChainChangedDisconnect:!0,getProvider:u},...t.options};super({chains:t.chains,options:n,connectorStorage:t.connectorStorage}),m(this,"id",p.phantom),this._UNSTABLE_shimOnConnectSelectAccount=n.UNSTABLE_shimOnConnectSelectAccount}async connect(){var c,n;let t=arguments.length>0&&arguments[0]!==void 0?arguments[0]:{};try{const e=await this.getProvider();if(!e)throw new l;this.setupListeners(),this.emit("message",{type:"connecting"});let o=null;if(this._UNSTABLE_shimOnConnectSelectAccount&&((c=this.options)!=null&&c.shimDisconnect)&&!this.connectorStorage.getItem(this.shimDisconnectKey)&&(o=await this.getAccount().catch(()=>null),!!o))try{await e.request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]})}catch(h){if(this.isUserRejectedRequestError(h))throw new d(h)}if(!o){const i=await e.request({method:"eth_requestAccounts"});o=w(i[0])}let s=await this.getChainId(),r=this.isChainUnsupported(s);if(t.chainId&&s!==t.chainId)try{await this.switchChain(t.chainId),s=t.chainId,r=this.isChainUnsupported(t.chainId)}catch(i){console.error(`Could not switch to chain id : ${t.chainId}`,i)}(n=this.options)!=null&&n.shimDisconnect&&await this.connectorStorage.setItem(this.shimDisconnectKey,"true");const a={chain:{id:s,unsupported:r},provider:e,account:o};return this.emit("connect",a),a}catch(e){throw this.isUserRejectedRequestError(e)?new d(e):e.code===-32002?new g(e):e}}async switchAccount(){await(await this.getProvider()).request({method:"wallet_requestPermissions",params:[{eth_accounts:{}}]})}}export{U as PhantomConnector};
