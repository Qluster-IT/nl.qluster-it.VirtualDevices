Vue.component('capability-options', {
  props: ['selected', 'definitions', 'options'],
  data: function () {
    return { drafts: {} };
  },
  methods: {
    titleValue: function (id) {
      if (this.drafts[id] && Object.prototype.hasOwnProperty.call(this.drafts[id], 'title')) {
        return this.drafts[id].title;
      }
      var title = (this.options[id] || {}).title;
      if (typeof title === 'string') return title;
      return title && (title[Homey.getLanguage ? Homey.getLanguage() : 'en'] || title.en) || '';
    },
    numericValue: function (id, field) {
      if (this.drafts[id] && Object.prototype.hasOwnProperty.call(this.drafts[id], field)) {
        return this.drafts[id][field];
      }
      var value = (this.options[id] || {})[field];
      return typeof value === 'number' ? value : '';
    },
    remember: function (id, field, event) {
      if (!this.drafts[id]) Vue.set(this.drafts, id, {});
      Vue.set(this.drafts[id], field, event.target.value);
    },
    change: function (id, field, event) {
      var raw = event.target.value;
      var value = raw === '' ? null : field === 'title' ? raw : Number(raw);
      this.$emit('change', id, field, value, () => {
        if (this.drafts[id] && this.drafts[id][field] === raw) Vue.delete(this.drafts[id], field);
      });
    },
    changeApproximation: function (event) {
      this.$emit('change', 'measure_power', 'approximated', event.target.checked);
    }
  },
  template: `
    <div v-if="selected.length">
      <h3>{{ __('capability_options.heading') }}</h3>
      <p>{{ __('capability_options.hint') }}</p>
      <details v-for="id in selected" :key="id" class="vd-disclosure">
        <summary class="homey-form-label">{{ definitions[id] ? definitions[id].title : id }}</summary>
        <div class="homey-form-group">
          <label class="homey-form-label" :for="'option-' + id + '-title'">{{ __('capability_options.name') }}</label>
          <input class="homey-form-input" :id="'option-' + id + '-title'" type="text" maxlength="100" :value="titleValue(id)" @input="remember(id, 'title', $event)" @change="change(id, 'title', $event)">
        </div>
        <template v-if="definitions[id] && definitions[id].type === 'number'">
          <div v-for="field in ['min', 'max', 'step', 'decimals']" :key="field" class="homey-form-group">
            <label class="homey-form-label" :for="'option-' + id + '-' + field">
            {{ __(field === 'min' ? 'repair.minimum' : field === 'max' ? 'repair.maximum' : 'repair.' + field) }}
            </label>
            <input class="homey-form-input" :id="'option-' + id + '-' + field" type="number" :step="field === 'decimals' ? 1 : 'any'"
              :min="field === 'decimals' ? 0 : null" :max="field === 'decimals' ? 5 : null"
              :value="numericValue(id, field)" @input="remember(id, field, $event)" @change="change(id, field, $event)">
          </div>
        </template>
        <template v-if="id === 'target_power'">
          <div v-for="field in ['excludeMin', 'excludeMax']" :key="field" class="homey-form-group">
            <label class="homey-form-label" :for="'option-' + id + '-' + field">{{ __(field === 'excludeMin' ? 'energy.exclude_min' : 'energy.exclude_max') }}</label>
            <input class="homey-form-input" :id="'option-' + id + '-' + field" type="number" step="any"
              :value="numericValue(id, field)" @input="remember(id, field, $event)" @change="change(id, field, $event)">
          </div>
          <p>{{ __('energy.exclude_hint') }}</p>
        </template>
        <label v-if="id === 'measure_power'" class="homey-form-checkbox">
          <input class="homey-form-checkbox-input" type="checkbox" :checked="!!(options[id] || {}).approximated" @change="changeApproximation">
          <span class="homey-form-checkbox-checkmark"></span>
          <span class="homey-form-checkbox-text">{{ __('energy.approximated') }}</span>
        </label>
      </details>
    </div>`
});
