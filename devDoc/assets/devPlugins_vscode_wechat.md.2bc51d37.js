import{_ as e,c as i,o as t,a as s}from"./app.0747e22e.js";const _=JSON.parse('{"title":"\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u63D2\u4EF6","description":"","frontmatter":{},"headers":[{"level":2,"title":"\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u6269\u5C55","slug":"\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u6269\u5C55"},{"level":2,"title":"wechat-snippet","slug":"wechat-snippet"},{"level":3,"title":"\u4F7F\u7528\u65B9\u6CD5","slug":"\u4F7F\u7528\u65B9\u6CD5"},{"level":3,"title":"\u6F14\u793A\u52A8\u753B","slug":"\u6F14\u793A\u52A8\u753B"}],"relativePath":"devPlugins/vscode/wechat.md"}'),a={name:"devPlugins/vscode/wechat.md"},l=s('<h1 id="\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u63D2\u4EF6" tabindex="-1">\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u63D2\u4EF6</h1><h2 id="\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u6269\u5C55" tabindex="-1">\u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u6269\u5C55</h2><p><img src="https://zsh.gallerycdn.vsassets.io/extensions/zsh/miniprogram/0.1.3/1574222814290/Microsoft.VisualStudio.Services.Icons.Default" alt="" width="48"> \u7279\u6027</p><ol><li>\u4EE3\u7801\u9AD8\u4EAE</li><li>\u4EE3\u7801\u7247\u6BB5</li><li>\u5305\u542B\uFF08wxml,wxss,page.json,app.json\uFF09</li><li>\u65B0\u5EFA\u5C0F\u7A0B\u5E8F\u9875\u9762</li><li>...</li></ol><p>\u5C55\u793A <img src="https://github.com/masterZSH/w-extension/blob/master/resources/images/1.gif" alt=""></p><h2 id="wechat-snippet" tabindex="-1">wechat-snippet</h2><p><img src="https://chandzhang.gallerycdn.vsassets.io/extensions/chandzhang/wechat-snippet/0.4.11/1564020204144/Microsoft.VisualStudio.Services.Icons.Default" alt="" width="48"> \u5FAE\u4FE1\u5C0F\u7A0B\u5E8F\u4EE3\u7801\u8F85\u52A9,\u4EE3\u7801\u7247\u6BB5\u81EA\u52A8\u5B8C\u6210<br> \u7531\u5FAE\u4FE1\u5B98\u65B9\u6587\u6863\u7167\u642C\u4E0B\u6765\u7684\u4EE3\u7801\u7247\u6BB5\u3002 \u65B9\u4FBF\u81EA\u5DF1\u4F7F\u7528\uFF0C\u540C\u65F6\u4E5F\u7ED9\u9700\u8981\u8005\u63D0\u4F9B\u5E2E\u52A9\u3002<br></p><p>\u5B98\u65B9\u6587\u6863: <a href="https://developers.weixin.qq.com/miniprogram/dev/api/" target="_blank" rel="noopener noreferrer">https://developers.weixin.qq.com/miniprogram/dev/api/</a><br></p><ul><li><h3 id="\u4F7F\u7528\u65B9\u6CD5" tabindex="-1">\u4F7F\u7528\u65B9\u6CD5<br></h3></li></ul><ol><li>JSON \u7247\u6BB5\uFF1A\u5728{}\u4E2D\u8F93\u5165 page,pages,window,tabbar\u7B49\u5C5E\u6027\u5173\u952E\u5B57\u5373\u53EF\u63D0\u793A\u4EE3\u7801\u7247\u6BB5\u6A21\u677F\u3002</li><li>JavaScript \u7247\u6BB5\uFF1A\u8F93\u5165 wx-page,wx-app,wx-request\u7B49wx-\u5F00\u5934\u7684\u5173\u952E\u5B57\u5373\u53EF\u63D0\u793A\u4EE3\u7801\u7247\u6BB5\u6A21\u677F\u3002</li><li>WXML \u7247\u6BB5\uFF1A\u76F4\u63A5\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0\uFF0C\u5373\u53EF\u63D0\u793A\u4EE3\u7801\u7247\u6BB5\u6A21\u677F\u3002\u5982,\u8F93\u5165 view,\u53EF\u81EA\u52A8\u751F\u6210 View \u6807\u7B7E\u53CA\u5176\u5C5E\u6027\u3002</li></ol><ul><li><h3 id="\u6F14\u793A\u52A8\u753B" tabindex="-1">\u6F14\u793A\u52A8\u753B</h3></li></ul><ol><li>json\u7247\u6BB5\uFF1A\u5728{}\u4E2D\u8F93\u5165 page,pages,window,tabbar\u7B49\u5C5E\u6027\u5173\u952E\u5B57\u5373\u53EF\u63D0\u793A\u4EE3\u7801\u7247\u6BB5\u6A21\u677F. JSON</li><li>js\u7247\u6BB5\uFF1A\u8F93\u5165 wx-page,wx-app,wx-request\u7B49wx-\u5F00\u5934\u7684\u5173\u952E\u5B57\u5373\u53EF\u63D0\u793A\u4EE3\u7801\u7247\u6BB5\u6A21\u677F. JS</li><li>wxml\u7247\u6BB5\uFF1A\u76F4\u63A5\u8F93\u5165\u7EC4\u4EF6\u540D\u79F0,\u5373\u53EF\u63D0\u793A\u4EE3\u7801\u7247\u6BB5\u6A21\u677F. \u5982,\u8F93\u5165 view,\u53EF\u81EA\u52A8\u751F\u6210 view\u6807\u7B7E\u53CA\u5176\u5C5E\u6027 WXML</li></ol>',12),o=[l];function r(n,p,c,d,h,w){return t(),i("div",null,o)}var m=e(a,[["render",r]]);export{_ as __pageData,m as default};