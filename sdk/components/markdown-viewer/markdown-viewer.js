/*!
 * Fresns 微信小程序 (https://fresns.cn)
 * Copyright 2021-Present 唐杰
 * Licensed under the Apache-2.0 license
 */
const marked = require('./marked.min.js');
const Prism = require('./prism.min.js');

function isLanguageSupported(lang) {
  return Prism.languages[lang] !== undefined;
}

Component({
  /** 组件的属性列表 **/
  properties: {
    content: {
      type: String,
      value: '',
      observer: function (newVal) {
        this.renderMarkdown(newVal);
      },
    },
  },

  /** 组件的初始数据 **/
  data: {
    html: '',
  },

  /** 组件功能 **/
  methods: {
    renderMarkdown: function (content) {
      if (!content) {
        return;
      }

      // 使用 marked 解析 Markdown 文本
      const parsedContent = marked.parse(content);

      // 使用 Prism 高亮代码块
      const highlightedContent = this.highlightCodeBlocks(parsedContent);

      this.setData({
        html: highlightedContent,
      });
    },

    // 辅助方法：用于高亮代码块
    highlightCodeBlocks: function (html) {
      return html.replace(/<pre><code class="(.+?)">([\s\S]+?)<\/code><\/pre>/g, function (match, lang, code) {
        lang = lang || 'plaintext'; // 默认语言为纯文本
        code = code.trim(); // 去除代码块首尾的空白字符
        // 检查语言规则是否存在
        if (isLanguageSupported(lang)) {
          // 如果语言规则存在，则进行代码高亮处理
          const highlightedCode = Prism.highlight(code, Prism.languages[lang], lang);
          return `<pre class="language-${lang}"><code class="language-${lang}">${highlightedCode}</code></pre>`;
        } else {
          // 如果语言规则不存在，则渲染为普通的代码块
          return `<pre><code>${code}</code></pre>`;
        }
      });
    },
  },
});
