(this.webpackJsonpmiddleman=this.webpackJsonpmiddleman||[]).push([[0],{38:function(e,t,c){},55:function(e,t,c){},59:function(e,t,c){},82:function(e,t,c){"use strict";c.r(t);var n=c(0),a=c.n(n),s=c(18),i=c.n(s),r=(c(55),c(56),c(57),c(58),c(89)),j=(c(59),c(92)),l=c(91),d=c(8),b=c(84),o=c(90),O=(c(38),c(1));var x=function(){var e=Object(n.useState)(!1),t=Object(d.a)(e,2),c=t[0],s=t[1],i=function(){return s(!1)};return Object(O.jsxs)(a.a.Fragment,{children:[Object(O.jsxs)(b.a,{variant:"navbar-btn",onClick:function(){return s(!0)},children:[Object(O.jsx)("i",{className:"bi bi-person"}),"\xa0About Me"]}),Object(O.jsxs)(o.a,{show:c,onHide:i,children:[Object(O.jsx)(o.a.Header,{children:Object(O.jsxs)(o.a.Title,{children:[Object(O.jsx)("i",{className:"bi bi-person"}),"\xa0About Me"]})}),Object(O.jsx)(o.a.Body,{children:Object(O.jsxs)("div",{className:"d-flex flex-column",children:[Object(O.jsxs)("div",{className:"d-flex justify-content-center",children:["Designed & Developed with ",Object(O.jsx)("span",{className:"heart animate__animated animate__heartBeat animate__infinite px-1",children:"\u2665"})," by"," ",Object(O.jsx)("a",{className:"px-1",href:"https://github.com/anushibin007/middleman",children:"Anu Shibin Joseph Raj"})]}),Object(O.jsx)("br",{}),Object(O.jsx)("div",{className:"d-flex justify-content-center",children:Object(O.jsx)("img",{src:"https://www.freevisitorcounters.com/en/counter/render/836517/t/0",border:"0",className:"counterimg",alt:"Visitor Counter"})})]})}),Object(O.jsx)(o.a.Footer,{children:Object(O.jsx)(b.a,{variant:"info",onClick:i,children:"Close"})})]})]})},h=c(29),u=c(36),m=c(85),f=c(94),v={LOCALSTORAGE_SERVER_URL_KEY:"MIDDLEMAN_SERVER_URL_KEY"},g=Object(n.createContext)(),p=function(e){var t=Object(n.useState)({serverUrl:"",userMailId:""}),c=Object(d.a)(t,2),a=c[0],s=c[1];return Object(n.useEffect)((function(){var e=localStorage.getItem(v.LOCALSTORAGE_SERVER_URL_KEY);e&&s(JSON.parse(e))}),[]),Object(n.useEffect)((function(){localStorage.setItem(v.LOCALSTORAGE_SERVER_URL_KEY,JSON.stringify(a))}),[a]),Object(O.jsx)(g.Provider,{value:[a,s],children:e.children})};var w=function(){var e=Object(n.useState)(!1),t=Object(d.a)(e,2),c=t[0],s=t[1],i=function(){return s(!1)},r=Object(n.useContext)(g),j=Object(d.a)(r,2),l=j[0],x=j[1],v=function(e){x(Object(u.a)(Object(u.a)({},l),{},Object(h.a)({},e.target.name,e.target.value)))};return Object(O.jsxs)(a.a.Fragment,{children:[Object(O.jsxs)(b.a,{variant:"navbar-btn",onClick:function(){return s(!0)},children:[Object(O.jsx)("i",{className:"bi bi-gear"}),"\xa0Config"]}),Object(O.jsxs)(o.a,{show:c,onHide:i,children:[Object(O.jsx)(o.a.Header,{children:Object(O.jsxs)(o.a.Title,{children:[Object(O.jsx)("i",{className:"bi bi-gear"}),"\xa0Config"]})}),Object(O.jsx)(o.a.Body,{children:Object(O.jsxs)("div",{className:"d-flex flex-column",children:[Object(O.jsxs)(m.a,{children:[Object(O.jsx)(m.a.Prepend,{children:Object(O.jsxs)(m.a.Text,{children:[Object(O.jsx)("i",{className:"bi bi-link-45deg"}),"\xa0Server URL"]})}),Object(O.jsx)(f.a,{placeholder:"https://middleman-server.com",name:"serverUrl",value:l.serverUrl,onChange:v,"aria-label":"Server URL"})]}),Object(O.jsx)("br",{}),Object(O.jsxs)(m.a,{children:[Object(O.jsx)(m.a.Prepend,{children:Object(O.jsxs)(m.a.Text,{children:[Object(O.jsx)("i",{className:"bi bi-envelope"}),"\xa0Your Mail ID"]})}),Object(O.jsx)(f.a,{type:"email",placeholder:"me@gmail.com",name:"userMailId",value:l.userMailId,onChange:v,"aria-label":"Server URL"})]})]})}),Object(O.jsx)(o.a.Footer,{children:Object(O.jsxs)(b.a,{variant:"info",onClick:i,children:[Object(O.jsx)("i",{className:"bi bi-save"}),"\xa0Save"]})})]})]})};var C=function(){return Object(O.jsxs)("div",{children:[Object(O.jsxs)(j.a,{bg:"light",expand:"lg",children:[Object(O.jsx)(j.a.Brand,{children:"Middleman"}),Object(O.jsx)(j.a.Toggle,{"aria-controls":"jsc-navbar"}),Object(O.jsx)(j.a.Collapse,{id:"jsc-navbar",children:Object(O.jsxs)(l.a,{className:"mr-auto",children:[Object(O.jsx)(x,{}),Object(O.jsx)(w,{})]})})]}),Object(O.jsx)("img",{src:"https://www.freevisitorcounters.com/en/home/counter/836517/t/0",style:{display:"none"},alt:"Visitor Counter"})]})},S=c(49),N=c(50),E=c(37),R=c.n(E),L=new(function(){function e(){Object(S.a)(this,e)}return Object(N.a)(e,[{key:"downloadFile",value:function(e,t){return R.a.get(e+"/download?downloadUrl="+t)}},{key:"getExistingDownloads",value:function(e){if(""!==e)return R.a.get(e+"/api/middlemanDocs?size=100")}}]),e}()),_=function(){var e=Object(n.useState)(""),t=Object(d.a)(e,2),c=t[0],s=t[1],i=Object(n.useContext)(g),r=Object(d.a)(i,1)[0];return Object(O.jsxs)(a.a.Fragment,{children:[Object(O.jsx)("h5",{children:"Cache files to Middleman"}),Object(O.jsxs)(m.a,{children:[Object(O.jsx)(m.a.Prepend,{children:Object(O.jsx)(m.a.Text,{children:Object(O.jsx)("i",{className:"bi bi-link-45deg"})})}),Object(O.jsx)(f.a,{placeholder:"Download URL",value:c,onChange:function(e){s(e.target.value)},"aria-label":"Download URL"}),Object(O.jsx)(m.a.Append,{children:Object(O.jsxs)(b.a,{onClick:function(){L.downloadFile(r.serverUrl,c),s("")},children:[Object(O.jsx)("i",{className:"bi bi-download"}),"\xa0Cache to Middleman"]})})]})]})},U=c(93),y=c(86),D=c(87),M=c(88),F=function(e){var t=Object(n.useState)([]),c=Object(d.a)(t,2),a=c[0],s=c[1];return Object(n.useEffect)((function(){s(e.item)}),[e.item]),Object(O.jsxs)("tr",{children:[Object(O.jsx)("td",{children:a.downloadUrl}),Object(O.jsx)("td",{children:a.status}),Object(O.jsx)("td",{children:Object(O.jsx)("a",{href:a.middlemanUrl,children:Object(O.jsxs)(b.a,{variant:"success",children:[Object(O.jsx)("i",{className:"bi bi-download"}),"\xa0Download"]})})})]})},k=function(){var e=Object(n.useContext)(g),t=Object(d.a)(e,1)[0],c=Object(n.useState)([]),a=Object(d.a)(c,2),s=a[0],i=a[1];return Object(O.jsxs)(U.a,{defaultActiveKey:"0",children:[Object(O.jsxs)(y.a,{children:[Object(O.jsx)(D.a,{children:Object(O.jsx)("h5",{children:"Files in Middleman"})}),Object(O.jsx)(D.a,{children:Object(O.jsxs)(b.a,{variant:"warning",onClick:function(){L.getExistingDownloads(t.serverUrl).then((function(e){console.log(e.data),i(e.data._embedded.middlemanDocs)}))},className:"float-end",children:[Object(O.jsx)("i",{className:"bi bi-x-octagon"})," Fetch"]})})]}),Object(O.jsx)(y.a,{children:Object(O.jsxs)(M.a,{striped:!0,bordered:!0,hover:!0,children:[Object(O.jsx)("thead",{children:Object(O.jsxs)("tr",{children:[Object(O.jsx)("th",{children:"Original Download URL"}),Object(O.jsx)("th",{children:"Status"}),Object(O.jsx)("th",{children:"Download from Middleman"})]})}),Object(O.jsx)("tbody",{children:0!==s.length?s.map((function(e){return Object(O.jsx)(F,{item:e})})):Object(O.jsx)("tr",{children:Object(O.jsx)("td",{colSpan:3,children:"No results found. Try fetching again."})})})]})})]})};var A=function(){return Object(O.jsx)(r.a,{children:Object(O.jsxs)(p,{children:[Object(O.jsx)(C,{}),Object(O.jsx)(_,{}),Object(O.jsx)("hr",{}),Object(O.jsx)(k,{})]})})},T=function(e){e&&e instanceof Function&&c.e(3).then(c.bind(null,95)).then((function(t){var c=t.getCLS,n=t.getFID,a=t.getFCP,s=t.getLCP,i=t.getTTFB;c(e),n(e),a(e),s(e),i(e)}))};i.a.render(Object(O.jsx)(a.a.StrictMode,{children:Object(O.jsx)(A,{})}),document.getElementById("root")),T()}},[[82,1,2]]]);
//# sourceMappingURL=main.a69c649f.chunk.js.map