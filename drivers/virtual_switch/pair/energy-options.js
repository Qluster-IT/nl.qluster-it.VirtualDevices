Vue.component('energy-options', {
  props: ['deviceClass', 'selected', 'definitions', 'energy', 'support'],
  computed: {
    meters: function () { return this.selected.filter(id => id === 'meter_power' || id.indexOf('meter_power.') === 0); },
    isCumulative: function () { return !!this.energy.cumulative; },
    importedKey: function () { return this.isCumulative ? 'cumulativeImportedCapability' : 'meterPowerImportedCapability'; },
    exportedKey: function () { return this.isCumulative ? 'cumulativeExportedCapability' : 'meterPowerExportedCapability'; },
    showMeters: function () { return this.meters.length && (this.isCumulative ? this.support.cumulativeMeters : this.support.deviceMeters); },
    flag: function () {
      return this.deviceClass === 'battery' ? 'homeBattery' : this.deviceClass === 'car' ? 'electricCar'
        : this.deviceClass === 'evcharger' ? 'evCharger' : '';
    },
    visible: function () {
      return (this.flag && this.support[this.flag]) || this.selected.some(id =>
        ['measure_power', 'meter_power', 'meter_gas', 'meter_water'].includes(id) || id.indexOf('meter_power.') === 0);
    }
  },
  methods: {
    change: function (key, value) { this.$emit('change', key, value); }
  },
  template: `
    <div v-if="visible" class="vd-section">
      <h3>{{ __('energy.heading') }}</h3>
      <p>{{ __('energy.hint') }}</p>
      <label v-if="flag && support[flag]" class="homey-form-checkbox">
        <input class="homey-form-checkbox-input" type="checkbox" :checked="!!energy[flag]" @change="change(flag, $event.target.checked)">
        <span class="homey-form-checkbox-checkmark"></span>
        <span class="homey-form-checkbox-text">{{ __(flag === 'homeBattery' ? 'energy.home_battery' : flag === 'electricCar' ? 'energy.electric_car' : 'energy.ev_charger') }}</span>
      </label>
      <label v-if="selected.some(id => ['measure_power', 'meter_power', 'meter_gas', 'meter_water'].includes(id) || id.indexOf('meter_power.') === 0)" class="homey-form-checkbox">
        <input class="homey-form-checkbox-input" type="checkbox" :checked="isCumulative" @change="change('cumulative', $event.target.checked)">
        <span class="homey-form-checkbox-checkmark"></span>
        <span class="homey-form-checkbox-text">{{ __('energy.cumulative') }}</span>
      </label>
      <p v-if="isCumulative">{{ __('energy.cumulative_hint') }}</p>
      <template v-if="showMeters">
        <div v-for="item in [{key: importedKey, label: 'energy.imported'}, {key: exportedKey, label: 'energy.exported'}]" :key="item.key" class="homey-form-group">
          <label class="homey-form-label" :for="'energy-' + item.key">{{ __(item.label) }}</label>
          <select class="homey-form-select" :id="'energy-' + item.key" :value="energy[item.key] || ''" @change="change(item.key, $event.target.value || null)">
            <option value="">{{ __('energy.default') }}</option>
            <option v-for="id in meters" :key="id" :value="id">{{ definitions[id] ? definitions[id].title : id }}</option>
          </select>
        </div>
        <p>{{ __('energy.meter_hint') }}</p>
      </template>
    </div>`
});
