var devices = {
  "socket": {
    "capabilities": [
      "onoff",
      "dim",
      "measure_power",
      "meter_power",
      "meter_power.imported",
      "meter_power.exported"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "light": {
    "capabilities": [
      "onoff",
      "dim",
      "light_hue",
      "light_saturation",
      "light_temperature",
      "light_mode",
      "measure_power"
    ],
    "defaultCapabilities": [
      "onoff",
      "dim"
    ]
  },
  "tv": {
    "capabilities": [
      "onoff",
      "volume_set",
      "volume_mute",
      "volume_up",
      "volume_down"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "amplifier": {
    "capabilities": [
      "onoff",
      "volume_set",
      "volume_mute",
      "volume_up",
      "volume_down"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "windowcoverings": {
    "capabilities": [
      "onoff",
      "dim",
      "windowcoverings_state",
      "windowcoverings_tilt_down",
      "windowcoverings_tilt_set",
      "windowcoverings_tilt_up",
      "windowcoverings_closed",
      "windowcoverings_set",
      "measure_battery",
      "alarm_battery"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "fan": {
    "capabilities": [
      "onoff",
      "dim",
      "measure_power",
      "fan_speed",
      "fan_mode"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "heater": {
    "capabilities": [
      "onoff",
      "target_temperature",
      "measure_temperature",
      "heater_operation_mode",
      "measure_power"
    ],
    "defaultCapabilities": [
      "onoff",
      "target_temperature",
      "measure_temperature"
    ]
  },
  "kettle": {
    "capabilities": [
      "onoff",
      "target_temperature",
      "measure_temperature",
      "measure_power",
      "operational_state",
      "progress"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "coffeemachine": {
    "capabilities": [
      "onoff",
      "target_temperature",
      "measure_temperature"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "button": {
    "capabilities": [
      "button"
    ],
    "defaultCapabilities": [
      "button"
    ]
  },
  "homealarm": {
    "capabilities": [
      "homealarm_state",
      "onoff",
      "button",
      "alarm_motion",
      "alarm_contact"
    ],
    "defaultCapabilities": [
      "homealarm_state"
    ]
  },
  "thermostat": {
    "capabilities": [
      "target_temperature",
      "thermostat_mode",
      "measure_temperature",
      "measure_humidity",
      "measure_battery",
      "alarm_battery"
    ],
    "defaultCapabilities": [
      "target_temperature",
      "measure_temperature"
    ]
  },
  "sensor": {
    "capabilities": [
      "measure_temperature",
      "measure_co2",
      "measure_pressure",
      "measure_humidity",
      "measure_pm25",
      "measure_co",
      "measure_current",
      "measure_gust_angle",
      "measure_gust_strength",
      "measure_luminance",
      "measure_noise",
      "measure_rain",
      "measure_ultraviolet",
      "measure_voltage",
      "measure_water",
      "measure_wind_angle",
      "measure_wind_strength",
      "measure_battery",
      "meter_power",
      "meter_power.imported",
      "meter_power.exported",
      "meter_gas",
      "meter_water",
      "meter_rain",
      "measure_power",
      "alarm_motion",
      "alarm_contact"
    ],
    "defaultCapabilities": [
      "measure_temperature",
      "measure_humidity",
      "measure_battery"
    ]
  },
  "lock": {
    "capabilities": [
      "locked",
      "lock_mode",
      "button",
      "alarm_contact",
      "alarm_tamper",
      "alarm_battery",
      "measure_battery"
    ],
    "defaultCapabilities": [
      "locked"
    ]
  },
  "blinds": {
    "capabilities": [
      "onoff",
      "windowcoverings_state",
      "windowcoverings_tilt_down",
      "windowcoverings_tilt_set",
      "windowcoverings_tilt_up",
      "windowcoverings_closed",
      "windowcoverings_set",
      "measure_battery",
      "alarm_battery"
    ],
    "defaultCapabilities": [
      "windowcoverings_state"
    ]
  },
  "curtain": {
    "capabilities": [
      "onoff",
      "windowcoverings_state",
      "windowcoverings_closed",
      "windowcoverings_set",
      "measure_battery",
      "alarm_battery"
    ],
    "defaultCapabilities": [
      "windowcoverings_state"
    ]
  },
  "doorbell": {
    "capabilities": [
      "button",
      "alarm_motion",
      "alarm_tamper",
      "alarm_battery",
      "measure_battery"
    ],
    "defaultCapabilities": [
      "button"
    ]
  },
  "sunshade": {
    "capabilities": [
      "windowcoverings_state",
      "windowcoverings_closed",
      "windowcoverings_set"
    ],
    "defaultCapabilities": [
      "windowcoverings_state"
    ]
  },
  "solarpanel": {
    "capabilities": [
      "meter_power",
      "measure_power",
      "measure_voltage",
      "measure_current",
      "meter_power.exported",
      "target_power",
      "target_power_mode"
    ],
    "defaultCapabilities": [
      "measure_power"
    ]
  },
  "vacuumcleaner": {
    "capabilities": [
      "onoff",
      "vacuumcleaner_state",
      "vacuumcleaner_job_mode",
      "operational_state",
      "measure_battery",
      "battery_charging_state",
      "alarm_problem"
    ],
    "defaultCapabilities": [
      "vacuumcleaner_state"
    ]
  },
  "camera": {
    "capabilities": [
      "alarm_motion",
      "alarm_battery",
      "alarm_tamper"
    ],
    "defaultCapabilities": [
      "alarm_motion"
    ]
  },
  "remote": {
    "capabilities": [
      "onoff",
      "dim",
      "volume_set",
      "volume_up",
      "volume_down",
      "volume_mute",
      "channel_up",
      "channel_down",
      "windowcoverings_state",
      "windowcoverings_closed",
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "speaker": {
    "capabilities": [
      "button",
      "volume_set",
      "volume_mute",
      "volume_up",
      "volume_down",
      "speaker_playing",
      "speaker_next",
      "speaker_prev",
      "speaker_shuffle",
      "speaker_repeat",
      "speaker_artist",
      "speaker_album",
      "speaker_track",
      "speaker_duration",
      "speaker_position"
    ],
    "defaultCapabilities": [
      "speaker_playing",
      "volume_set",
      "volume_mute"
    ]
  },
  "airconditioning": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "thermostat_mode", "target_humidity", "measure_humidity", "fan_speed", "swing_mode", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "airfryer": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "cooking_time", "progress", "operational_state", "power_level"],
    "defaultCapabilities": ["onoff", "target_temperature", "progress"]
  },
  "airpurifier": {
    "capabilities": ["onoff", "fan_speed", "fan_mode", "target_humidity", "measure_humidity", "measure_aqi", "level_aqi", "measure_pm25", "measure_co2", "measure_hepa_filter", "measure_carbon_filter", "measure_power"],
    "defaultCapabilities": ["onoff", "fan_speed", "measure_aqi"]
  },
  "airtreatment": {
    "capabilities": ["onoff", "fan_speed", "fan_mode", "target_humidity", "measure_humidity", "measure_aqi", "measure_power"],
    "defaultCapabilities": ["onoff", "fan_mode", "measure_humidity"]
  },
  "battery": {
    "capabilities": ["measure_battery", "battery_charging_state", "measure_voltage", "measure_power", "meter_power.imported", "meter_power.exported", "target_power", "target_power_mode"],
    "defaultCapabilities": ["measure_battery", "battery_charging_state"]
  },
  "bicycle": {
    "capabilities": ["locked", "measure_battery", "battery_charging_state", "measure_speed", "measure_distance"],
    "defaultCapabilities": ["locked", "measure_battery"]
  },
  "boiler": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "hot_water_mode", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "bridge": {
    "capabilities": ["onoff", "button", "alarm_connectivity", "alarm_problem"],
    "defaultCapabilities": ["onoff", "alarm_connectivity"]
  },
  "car": {
    "capabilities": ["onoff", "locked", "measure_battery", "battery_charging_state", "ev_charging_state", "measure_distance", "measure_speed"],
    "defaultCapabilities": ["locked", "measure_battery", "ev_charging_state"]
  },
  "cooktop": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "cooking_time", "operational_state", "power_level", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "cooking_time"]
  },
  "dehumidifier": {
    "capabilities": ["onoff", "target_humidity", "measure_humidity", "fan_mode", "fan_speed", "alarm_tank_empty", "measure_power"],
    "defaultCapabilities": ["onoff", "target_humidity", "measure_humidity"]
  },
  "diffuser": {
    "capabilities": ["onoff", "dim", "fan_speed", "target_humidity", "measure_humidity"],
    "defaultCapabilities": ["onoff", "fan_speed"]
  },
  "dishwasher": {
    "capabilities": ["onoff", "dishwasher_program", "operational_state", "progress", "measure_water", "alarm_water", "measure_power"],
    "defaultCapabilities": ["onoff", "dishwasher_program", "progress"]
  },
  "dryer": {
    "capabilities": ["onoff", "laundry_dryer_dryness", "operational_state", "progress", "measure_power"],
    "defaultCapabilities": ["onoff", "laundry_dryer_dryness", "progress"]
  },
  "evcharger": {
    "capabilities": ["onoff", "evcharger_charging", "evcharger_charging_state", "target_power", "target_power_mode", "measure_power", "measure_voltage", "measure_current", "meter_power", "meter_power.imported", "meter_power.exported"],
    "defaultCapabilities": ["onoff", "evcharger_charging", "evcharger_charging_state"]
  },
  "faucet": {
    "capabilities": ["onoff", "valve_position", "measure_water", "measure_pressure", "alarm_water"],
    "defaultCapabilities": ["onoff", "valve_position", "alarm_water"]
  },
  "fireplace": {
    "capabilities": ["onoff", "dim", "target_temperature", "measure_temperature", "measure_power"],
    "defaultCapabilities": ["onoff", "dim"]
  },
  "freezer": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "alarm_freeze_risk", "alarm_contact", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "fridge": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "refrigerator_mode", "alarm_freeze_risk", "alarm_contact", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "fridge_and_freezer": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "refrigerator_mode", "alarm_freeze_risk", "alarm_contact", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "fryer": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "cooking_time", "progress", "operational_state", "power_level"],
    "defaultCapabilities": ["onoff", "target_temperature", "progress"]
  },
  "gameconsole": {
    "capabilities": ["onoff", "button", "measure_power"],
    "defaultCapabilities": ["onoff"]
  },
  "garagedoor": {
    "capabilities": ["garagedoor_closed", "button", "alarm_contact", "alarm_generic", "alarm_tamper", "measure_battery"],
    "defaultCapabilities": ["garagedoor_closed"]
  },
  "grill": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "cooking_time", "operational_state", "progress", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "heatpump": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "thermostat_mode", "fan_mode", "fan_speed", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "hood": {
    "capabilities": ["onoff", "fan_speed", "fan_mode", "light_mode", "measure_power"],
    "defaultCapabilities": ["onoff", "fan_speed", "light_mode"]
  },
  "humidifier": {
    "capabilities": ["onoff", "target_humidity", "measure_humidity", "fan_speed", "fan_mode", "measure_power"],
    "defaultCapabilities": ["onoff", "target_humidity", "measure_humidity"]
  },
  "lawnmower": {
    "capabilities": ["onoff", "mower_state", "operational_state", "measure_battery", "battery_charging_state", "alarm_problem"],
    "defaultCapabilities": ["mower_state", "operational_state", "measure_battery"]
  },
  "mediaplayer": {
    "capabilities": ["onoff", "speaker_playing", "speaker_next", "speaker_prev", "volume_set", "volume_mute", "speaker_artist", "speaker_track", "audio_output"],
    "defaultCapabilities": ["onoff", "speaker_playing", "volume_set"]
  },
  "microwave": {
    "capabilities": ["onoff", "microwave_mode", "target_temperature", "cooking_time", "progress", "operational_state", "power_level"],
    "defaultCapabilities": ["onoff", "cooking_time", "operational_state"]
  },
  "mop": {
    "capabilities": ["onoff", "vacuumcleaner_state", "vacuumcleaner_job_mode", "operational_state", "measure_battery", "alarm_water", "alarm_problem"],
    "defaultCapabilities": ["onoff", "vacuumcleaner_state", "measure_battery"]
  },
  "multicooker": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "cooking_time", "progress", "operational_state", "power_level"],
    "defaultCapabilities": ["onoff", "target_temperature", "cooking_time"]
  },
  "networkrouter": {
    "capabilities": ["onoff", "measure_data_rate", "measure_data_size", "measure_signal_strength", "alarm_connectivity"],
    "defaultCapabilities": ["onoff", "alarm_connectivity", "measure_signal_strength"]
  },
  "oven": {
    "capabilities": ["onoff", "oven_mode", "target_temperature", "measure_temperature", "cooking_time", "progress", "operational_state", "measure_power"],
    "defaultCapabilities": ["onoff", "oven_mode", "target_temperature"]
  },
  "oven_and_microwave": {
    "capabilities": ["onoff", "oven_mode", "microwave_mode", "target_temperature", "measure_temperature", "cooking_time", "progress", "operational_state"],
    "defaultCapabilities": ["onoff", "oven_mode", "target_temperature"]
  },
  "other": {
    "capabilities": ["onoff", "button", "alarm_generic", "alarm_problem", "measure_power", "measure_temperature"],
    "defaultCapabilities": ["onoff", "button"]
  },
  "petfeeder": {
    "capabilities": ["onoff", "button", "operational_state", "progress", "measure_battery", "alarm_tank_empty"],
    "defaultCapabilities": ["onoff", "operational_state", "alarm_tank_empty"]
  },
  "radiator": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "thermostat_mode", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "scooter": {
    "capabilities": ["onoff", "locked", "measure_battery", "battery_charging_state", "measure_speed", "measure_distance"],
    "defaultCapabilities": ["onoff", "locked", "measure_battery"]
  },
  "service": {
    "capabilities": ["onoff", "button", "operational_state", "alarm_problem", "alarm_connectivity"],
    "defaultCapabilities": ["onoff", "operational_state"]
  },
  "settopbox": {
    "capabilities": ["onoff", "speaker_playing", "channel_up", "channel_down", "volume_set", "volume_mute", "media_input"],
    "defaultCapabilities": ["onoff", "speaker_playing", "volume_set"]
  },
  "shutterblinds": {
    "capabilities": ["windowcoverings_state", "windowcoverings_set", "windowcoverings_closed", "windowcoverings_tilt_up", "windowcoverings_tilt_down", "windowcoverings_tilt_set"],
    "defaultCapabilities": ["windowcoverings_state", "windowcoverings_set"]
  },
  "siren": {
    "capabilities": ["onoff", "alarm_generic", "alarm_problem", "volume_set", "measure_battery"],
    "defaultCapabilities": ["onoff", "alarm_generic"]
  },
  "smokealarm": {
    "capabilities": ["alarm_smoke", "alarm_fire", "alarm_heat", "alarm_battery", "alarm_tamper", "measure_battery", "button"],
    "defaultCapabilities": ["alarm_smoke", "alarm_battery"]
  },
  "sprinkler": {
    "capabilities": ["onoff", "operational_state", "progress", "valve_position", "measure_water", "meter_water", "alarm_water"],
    "defaultCapabilities": ["onoff", "operational_state", "progress"]
  },
  "vehicle": {
    "capabilities": ["onoff", "locked", "measure_battery", "battery_charging_state", "ev_charging_state", "measure_distance", "measure_speed"],
    "defaultCapabilities": ["locked", "measure_battery", "ev_charging_state"]
  },
  "washer": {
    "capabilities": ["onoff", "laundry_washer_program", "laundry_washer_cycles", "laundry_washer_speed", "operational_state", "progress", "measure_water", "measure_power"],
    "defaultCapabilities": ["onoff", "laundry_washer_program", "progress"]
  },
  "washer_and_dryer": {
    "capabilities": ["onoff", "laundry_washer_program", "laundry_washer_cycles", "laundry_washer_speed", "laundry_dryer_dryness", "operational_state", "progress", "measure_water", "measure_power"],
    "defaultCapabilities": ["onoff", "laundry_washer_program", "progress"]
  },
  "waterheater": {
    "capabilities": ["onoff", "target_temperature", "measure_temperature", "hot_water_mode", "measure_power"],
    "defaultCapabilities": ["onoff", "target_temperature", "measure_temperature"]
  },
  "waterpurifier": {
    "capabilities": ["onoff", "measure_aqi", "measure_pm25", "measure_co2", "measure_water", "alarm_water", "measure_content_volume"],
    "defaultCapabilities": ["onoff", "measure_water", "alarm_water"]
  },
  "watervalve": {
    "capabilities": ["onoff", "valve_position", "alarm_water", "measure_water", "meter_water"],
    "defaultCapabilities": ["onoff", "valve_position", "alarm_water"]
  },
  "pump": {
    "capabilities": ["onoff", "pump_mode", "pump_setpoint", "operational_state", "measure_power", "measure_pressure", "measure_water", "alarm_pump_device", "alarm_pump_supply"],
    "defaultCapabilities": ["onoff", "pump_mode", "operational_state"]
  },
  



  
  // "airconditioning": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "airfryer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "airpurifier": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "airtreatment": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "battery": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "bicycle": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "boiler": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "car": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "cooktop": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "dehumidifier": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "diffuser": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "dishwasher": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "dryer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "evcharger": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "faucet": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "fireplace": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "freezer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "fridge_and_freezer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "fridge": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "fryer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "gameconsole": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "grill": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "heatpump": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "hood": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "humidifier": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "lawnmower": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "mediaplayer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "microwave": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "mop": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "multicooker": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "networkrouter": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "oven_and_microwave": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "oven": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "petfeeder": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "radiator": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "scooter": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "service": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.3.0"
  // },
  // "settopbox": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "shutterblinds": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "siren": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "smokealarm": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "sprinkler": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "vehicle": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "washer_and_dryer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "washer": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "waterheater": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "waterpurifier": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // },
  // "watervalve": {
  //   "capabilities": [
  //     "",
  //     ""
  //   ],
  //   "defaultCapabilities": [
  //     "onoff"
  //   ],
  //   "minCompatibility" : "12.0.0"
  // }
}

var default_options = {
  "target_temperature": {
    "min": 12,
    "max": 32,
    "step": 0.5
  },
  "measure_temperature": {
    "decimals": 1
  }

}

if (typeof module !== 'undefined') module.exports = { devices, default_options };
