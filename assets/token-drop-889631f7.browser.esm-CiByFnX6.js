var d=Object.defineProperty;var f=(s,e,t)=>e in s?d(s,e,{enumerable:!0,configurable:!0,writable:!0,value:t}):s[e]=t;var n=(s,e,t)=>f(s,typeof e!="symbol"?e+"":e,t);import{d_ as C,a1 as w,q as W,d$ as y,a2 as R,Y as p,aO as T,aQ as A,t as c,T as h}from"./index-BzFxWc_h.js";import{a as b,b as E,G as O,C as S}from"./contract-appuri-5c40af52.browser.esm-BLSHI0VH.js";import{C as v}from"./contract-interceptor-d7b164a7.browser.esm-C_yNedqZ.js";import{C as D}from"./contract-platform-fee-e756e68f.browser.esm-BWxVUr7Y.js";import{C as F}from"./contract-roles-71988d2e.browser.esm-D4Kldtkk.js";import{C as V}from"./contract-sales-918c7cb8.browser.esm-BqW8DDK8.js";import{D as _}from"./drop-claim-conditions-e6f2abbf.browser.esm-C-Odm-OR.js";import{S as B}from"./erc-20-standard-1e9d9631.browser.esm-nONyt-m0.js";import"./index-DHKDF7fp.js";import"./erc-20-9a18a51c.browser.esm-BANK-ym2.js";import"./assertEnabled-d1700f0b.browser.esm-lzJO4zNm.js";import"./setErc20Allowance-7f76f677.browser.esm-D9FuepMa.js";import"./treeify-BwbAlYD3.js";const o=class o extends B{constructor(t,r,a){let i=arguments.length>3&&arguments[3]!==void 0?arguments[3]:{},m=arguments.length>4?arguments[4]:void 0,u=arguments.length>5?arguments[5]:void 0,g=arguments.length>6&&arguments[6]!==void 0?arguments[6]:new w(t,r,m,i,a);super(g,a,u);n(this,"claim",c((()=>{var t=this;return async function(r){let a=arguments.length>1&&arguments[1]!==void 0?arguments[1]:!0;return t.claimTo.prepare(await t.contractWrapper.getSignerAddress(),r,a)}})()));n(this,"claimTo",c((()=>{var t=this;return async function(r,a){let i=arguments.length>2&&arguments[2]!==void 0?arguments[2]:!0;return t.erc20.claimTo.prepare(r,a,{checkERC20Allowance:i})}})()));n(this,"delegateTo",c(async t=>h.fromContractWrapper({contractWrapper:this.contractWrapper,method:"delegate",args:[await p(t)]})));n(this,"burnTokens",c(async t=>this.erc20.burn.prepare(t)));n(this,"burnFrom",c(async(t,r)=>this.erc20.burnFrom.prepare(t,r)));this.abi=W.parse(m||[]),this.metadata=new b(this.contractWrapper,y,this.storage),this.app=new E(this.contractWrapper,this.metadata,this.storage),this.roles=new F(this.contractWrapper,o.contractRoles),this.encoder=new R(this.contractWrapper),this.estimator=new O(this.contractWrapper),this.events=new S(this.contractWrapper),this.sales=new V(this.contractWrapper),this.platformFees=new D(this.contractWrapper),this.interceptor=new v(this.contractWrapper),this.claimConditions=new _(this.contractWrapper,this.metadata,this.storage)}async getVoteBalance(){return await this.getVoteBalanceOf(await this.contractWrapper.getSignerAddress())}async getVoteBalanceOf(t){return await this.erc20.getValue(await this.contractWrapper.read("getVotes",[await p(t)]))}async getDelegation(){return await this.getDelegationOf(await this.contractWrapper.getSignerAddress())}async getDelegationOf(t){return await this.contractWrapper.read("delegates",[await p(t)])}async isTransferRestricted(){return!await this.contractWrapper.read("hasRole",[T("transfer"),A])}async prepare(t,r,a){return h.fromContractWrapper({contractWrapper:this.contractWrapper,method:t,args:r,overrides:a})}async call(t,r,a){return this.contractWrapper.call(t,r,a)}};n(o,"contractRoles",C);let l=o;export{l as TokenDrop};
