# Virtual Devices

This app gives you the opportunity to add Virtual Devices to Homey. You can operate the Virtual Devices from the UI and/or use them in flows.

Or you can add a mode and add it as a condition, e.g. to disable multiple flows when going on Holiday.

Choose a device class, capabilities and an icon when adding a virtual device. On the next screen, optionally name capabilities and adjust numeric limits, step size and decimal places. Use Repair to change these choices later. Changing a class or removing capabilities can break existing Flows.

Energy options can mark a device as a home battery, electric car, EV charger or whole-home meter, and map separate imported and exported energy readings. Homey version support varies. Virtual readings can duplicate real devices in Energy; use Homey's exclusion setting when needed. Cumulative kWh readings should only increase. Battery and car classifications are optional.

For devices with an editable icon, Repair can replace it; restart Homey to see the new icon. Older devices using a built-in icon must be recreated to change their icon. For more advanced customization, use an Advanced Virtual Device from the Device Capabilities app.

Camera and doorbell devices can display a snapshot from an HTTP or HTTPS URL, configured during pairing or Repair. Flows can set their image from a URL or an image tag; the URL card can also refresh a snapshot. On supported Homeys, pairing and Repair also accept a live video URL. Speaker devices can display album art set by a Flow from a URL or image tag. Images are limited to 5 MB.

Flow cards can set numeric, yes/no, text and choice capabilities using inputs for each type. Choice values are selected from the available options; use the existing sensor card when a choice must come from a Flow token.

## What works:

* Virtual Devices: Switch, Alarm, Blinds, Hifi, Light, Security, TV, Heater
* Modes: Holiday, Away, Party, Event, Quiet, Movie, Sleep, Relax, Manual, Secure
* Trigger a flow
* Use the switch/mode status as a condition
* Use the switch/mode in the 'then'-column

## What doesn't:

* Settings (or other) that makes some modes mutually exclusive (issue #3)

## More information:

* [Repository](https://github.com/Qluster-IT/nl.qluster-it.VirtualDevices)
* [Wiki and how-to guides](https://github.com/Qluster-IT/nl.qluster-it.VirtualDevices/wiki)
* [Report a bug or request a feature](https://github.com/Qluster-IT/nl.qluster-it.VirtualDevices/issues)
* [Homey Community topic](https://community.homey.app/t/virtual-devices/1723)

...or on [Slack](https://athomcommunity.slack.com) (@arielaxed)

## Changelog

### 2.0.0
* Recommended capabilities and more icons for every device class.
* Edit devices with Repair, including capability options and editable icons.
* Optional Homey Energy settings for batteries, cars, chargers and meters.
* Camera snapshots, supported live video and speaker album art.
* Flow cards for numeric, yes/no, text and choice values.

### 1.4.2
* Moved source code and issues from Bitbucket to GitHub.

### 1.4.1
* Translated into all supported languages.

### 1.3.2
* Updated device classes and capabilities.

### 1.3.1
* Fixed missing temperature options during pairing.

### 1.3.0
* Added available device classes and capabilities for the installed Homey version.

### 1.2.3
* Fixed custom Mode icons being deleted when creating a device.

### 1.2.2
* Fixed custom icons being deleted when creating a device.

### 1.2.1
* Improved the Flow card for selecting a sensor or capability.

### 1.2.0
* Added a Flow card for selecting a sensor or capability.

### 1.1.2
* Corrected target and measured temperature options.

### 1.1.1
* Improved target and measured temperature options.

### 1.1.0
* Added support for Homey Pro (Early 2023).

### 1.0.4
* Improved target and measured temperature options.

### 1.0.3
* Fixed Flow card issues.

### 1.0.2
* Added contribution options.

### 1.0.1
* Improved SDK 3 support.

### 1.0.0
* Updated to SDK 3.

### 0.9.5
* Fixed a crash when removing a device or mode.

### 0.9.4
* Added decimal settings for measured temperature.

### 0.9.3
* Fixed temperature limits and step settings during pairing.

### 0.9.2
* Added custom icon uploads and temperature limits during pairing.

### 0.9.0
* Fixed setting energy consumption.

### 0.8.9
* Added Norwegian and battery, gas, water and rain sensor capabilities.
