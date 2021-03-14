import { config, library } from '@fortawesome/fontawesome-svg-core';
import { fas } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/vue-fontawesome';
import Vue from 'vue';

config.autoAddCss = false;

library.add(fas);

// Register the component globally
Vue.component('FontAwesomeIcon', FontAwesomeIcon);
