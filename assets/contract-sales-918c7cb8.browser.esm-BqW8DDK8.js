var c=Object.defineProperty;var n=(t,r,a)=>r in t?c(t,r,{enumerable:!0,configurable:!0,writable:!0,value:a}):t[r]=a;var e=(t,r,a)=>n(t,typeof r!="symbol"?r+"":r,a);import{a7 as i,t as s,T as o}from"./index-BzFxWc_h.js";class u{constructor(r){e(this,"featureName",i.name);e(this,"setRecipient",s(async r=>o.fromContractWrapper({contractWrapper:this.contractWrapper,method:"setPrimarySaleRecipient",args:[r]})));this.contractWrapper=r}async getRecipient(){return await this.contractWrapper.read("primarySaleRecipient",[])}}export{u as C};
