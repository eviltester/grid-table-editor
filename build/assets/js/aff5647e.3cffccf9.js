"use strict";(self.webpackChunkdocs=self.webpackChunkdocs||[]).push([[742],{3905:function(e,t,r){r.d(t,{Zo:function(){return c},kt:function(){return d}});var n=r(7294);function a(e,t,r){return t in e?Object.defineProperty(e,t,{value:r,enumerable:!0,configurable:!0,writable:!0}):e[t]=r,e}function o(e,t){var r=Object.keys(e);if(Object.getOwnPropertySymbols){var n=Object.getOwnPropertySymbols(e);t&&(n=n.filter((function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable}))),r.push.apply(r,n)}return r}function i(e){for(var t=1;t<arguments.length;t++){var r=null!=arguments[t]?arguments[t]:{};t%2?o(Object(r),!0).forEach((function(t){a(e,t,r[t])})):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(r)):o(Object(r)).forEach((function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(r,t))}))}return e}function l(e,t){if(null==e)return{};var r,n,a=function(e,t){if(null==e)return{};var r,n,a={},o=Object.keys(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||(a[r]=e[r]);return a}(e,t);if(Object.getOwnPropertySymbols){var o=Object.getOwnPropertySymbols(e);for(n=0;n<o.length;n++)r=o[n],t.indexOf(r)>=0||Object.prototype.propertyIsEnumerable.call(e,r)&&(a[r]=e[r])}return a}var u=n.createContext({}),s=function(e){var t=n.useContext(u),r=t;return e&&(r="function"==typeof e?e(t):i(i({},t),e)),r},c=function(e){var t=s(e.components);return n.createElement(u.Provider,{value:t},e.children)},p={inlineCode:"code",wrapper:function(e){var t=e.children;return n.createElement(n.Fragment,{},t)}},f=n.forwardRef((function(e,t){var r=e.components,a=e.mdxType,o=e.originalType,u=e.parentName,c=l(e,["components","mdxType","originalType","parentName"]),f=s(r),d=a,m=f["".concat(u,".").concat(d)]||f[d]||p[d]||o;return r?n.createElement(m,i(i({ref:t},c),{},{components:r})):n.createElement(m,i({ref:t},c))}));function d(e,t){var r=arguments,a=t&&t.mdxType;if("string"==typeof e||a){var o=r.length,i=new Array(o);i[0]=f;var l={};for(var u in t)hasOwnProperty.call(t,u)&&(l[u]=t[u]);l.originalType=e,l.mdxType="string"==typeof e?e:a,i[1]=l;for(var s=2;s<o;s++)i[s]=r[s];return n.createElement.apply(null,i)}return n.createElement.apply(null,r)}f.displayName="MDXCreateElement"},2415:function(e,t,r){r.r(t),r.d(t,{assets:function(){return c},contentTitle:function(){return u},default:function(){return d},frontMatter:function(){return l},metadata:function(){return s},toc:function(){return p}});var n=r(7462),a=r(3366),o=(r(7294),r(3905)),i=["components"],l={slug:"initial-blog-post",title:"News at May 30th 2022",authors:"alan",tags:["release"]},u=void 0,s={permalink:"/grid-table-editor/blog/initial-blog-post",source:"@site/blog/2022-05-30-initial-blog-post.md",title:"News at May 30th 2022",description:"Initial Release of docs.",date:"2022-05-30T00:00:00.000Z",formattedDate:"May 30, 2022",tags:[{label:"release",permalink:"/grid-table-editor/blog/tags/release"}],readingTime:.405,truncated:!0,authors:[{name:"Alan Richardson",title:"Creator of Test Data Generator",url:"https://github.com/eviltester",imageURL:"https://github.com/eviltester.png",key:"alan"}],frontMatter:{slug:"initial-blog-post",title:"News at May 30th 2022",authors:"alan",tags:["release"]}},c={authorsImageUrls:[void 0]},p=[],f={toc:p};function d(e){var t=e.components,r=(0,a.Z)(e,i);return(0,o.kt)("wrapper",(0,n.Z)({},f,r,{components:t,mdxType:"MDXLayout"}),(0,o.kt)("p",null,"Initial Release of docs."),(0,o.kt)("p",null,"I've been busy refactoring the code of the ",(0,o.kt)("a",{parentName:"p",href:"https://github.com/eviltester/grid-table-editor/"},"Data Table Editor")),(0,o.kt)("ul",null,(0,o.kt)("li",{parentName:"ul"},"to make it more modular"),(0,o.kt)("li",{parentName:"ul"},"add unit tests"),(0,o.kt)("li",{parentName:"ul"},"add documentation")),(0,o.kt)("p",null,"This should make the application more robust and easier to use."),(0,o.kt)("p",null,"It is still hosted on Gitpages, but if more people use the app then I'll setup a domain for it."),(0,o.kt)("p",null,"Currently web traffic is tracked using plausible.io and no data is passed to the server other than counts of page views."))}d.isMDXComponent=!0}}]);