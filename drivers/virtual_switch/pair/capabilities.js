var devices = {
  "socket": {
    "capabilities": [
      "onoff",
      "dim",
      "measure_power"
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
      "onoff"
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
      "windowcoverings_set"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "fan": {
    "capabilities": [
      "onoff",
      "dim",
      "measure_power"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "heater": {
    "capabilities": [
      "onoff",
      "dim",
      "measure_power"
    ],
    "defaultCapabilities": [
      "onoff"
    ]
  },
  "kettle": {
    "capabilities": [
      "onoff",
      "target_temperature",
      "measure_temperature",
      "measure_power"
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
      "measure_temperature"
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
      "meter_gas",
      "meter_water",
      "meter_rain",
      "measure_power",
      "alarm_motion",
      "alarm_contact"
    ],
    "defaultCapabilities": [
    ]
  },
  "lock": {
    "capabilities": [
      "locked",
      "lock_mode"
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
      "windowcoverings_set"
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
      "windowcoverings_set"
    ],
    "defaultCapabilities": [
      "windowcoverings_state"
    ]
  },
  "doorbell": {
    "capabilities": [
      "button"
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
      "measure_power"
    ],
    "defaultCapabilities": [
      "measure_power"
    ]
  },
  "vacuumcleaner": {
    "capabilities": [
      "onoff",
      "vacuumcleaner_state"
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
      "button"
    ]
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
