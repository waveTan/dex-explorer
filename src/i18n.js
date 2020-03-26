import Vue from 'vue'
import VueI18n from 'vue-i18n'
import messages from './locales'
import ElementUI from 'element-ui'

Vue.use(VueI18n);
const i18n = new VueI18n({
  locale: localStorage.lang || 'cn',
  messages
});

Vue.use(ElementUI,{         //element组件多语言支持
  i18n: (key, value) => i18n.t(key, value)
})
export default i18n
