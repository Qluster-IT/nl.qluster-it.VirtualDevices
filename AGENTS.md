# Homey App Instructions

> You may override or change any instructions in this file when you explicitly tell me to.

This is a Homey app. Before making changes, follow `C:\Users\Qlustrator\.copilot\instructions\homey-app.md` for app conventions and `C:\Users\Qlustrator\.copilot\instructions\homey-develop.md` for development, builds, testing, and deployment. Follow the task-specific image, color, Wiki, and forum guides referenced there when applicable.

## App purpose

Virtual Devices creates standard, simplified virtual devices in Homey. Users who need more advanced customization should use the Device Capabilities app to create an Advanced Virtual Device (AVD).

## Device pairing and repair

- For each supported Homey device class, show a default list of preferred and suitable capabilities as a preselected recommendation, filtered for the running Homey version and the capabilities available on that version. Users can change the selection before continuing, and revisiting pairing or Repair must preserve their choices.
- Keep recommended and preselected capabilities for every supported Homey device class, filtering unavailable capabilities for the running Homey version. Preserve the user's selections when revisiting pairing.
- Keep optional capability names and numeric settings available in both pairing and repair; preserve Homey defaults and unrelated options when users do not change them.
- Show capability options on a separate step after capability selection in pairing and repair, with a notice on the selection step and navigation that preserves edits.
- Use Homey's custom-view form and button styles for pairing and repair, with view navigation together at the bottom, including custom save and close actions.
- Keep at least three suitable icon choices mapped to each device class. New virtual devices store their selected icon in a per-device userdata file so it can be replaced during repair.
- Repair must preserve untouched capabilities and options, warn before class changes or capability removal, and explain that older built-in asset icons require recreating the device to change the icon. Replacing an editable icon requires a Homey restart to become visible; verify this and listener behavior on supported Homeys when device testing is authorized.
- App Store tags must be single words. Keep `virtual`, `device` and `devices` in every supported language's tags, alongside relevant localized words.
- Camera and doorbell snapshots and speaker album art use Homey images, not capabilities. Keep URL and image-tag Flow cards, preserve image sources in device storage, and never log URLs or put their credentials in public userdata. Gate live camera video on supported Homey versions.
- Homey `setEnergy()` replaces the complete Energy override. Preserve unrelated properties during repair, remove references only when their capabilities are removed, and gate newer Energy properties by Homey version.
- Homey button styling can collapse percentage-height icon masks. Give pairing and repair icon masks an explicit inline height so their previews remain visible.

## Flow cards and release notice

- Preserve existing Flow card IDs and behavior, and keep existing cards before the typed capability cards. Typed cards select only capabilities of the corresponding type; preserve numeric, boolean and text values without coercion, and offer the selected enum capability's valid choices.
- Camera image cards are for camera and doorbell classes; album-art cards are for speakers. Keep the device-class filters and runtime checks in sync.
- The 2.0.0 notice uses existing devices as the upgrade signal because older releases stored no version marker. Wait for all three drivers to be ready before checking, send at most one notice, and do not notify a fresh installation.
- Mode actions must complete their capability update before reporting success so subsequent Flow conditions see the new state; propagate update failures.

## App-specific testing

Follow the shared Homey testing instructions, including saved Advanced Flows on both test Homeys when device testing is authorized. In addition:

- Exercise real pairing and Repair for representative device classes: recommendations, quick name entry, navigation and preserved drafts, numeric options, class/removal warnings, icon previews, and saved settings. Cover cameras with no URL as well as supported media sources.
- Test Energy options for a battery, electric car, EV charger and whole-home meter where supported. Verify capability mappings and numeric limits, unchanged Energy overrides, and removal of mappings when their capabilities are removed.
- Exercise the existing free-text and autocomplete sensor cards and the typed number, yes/no, text and choice cards in saved Flows. Check actual picker results, numeric and boolean Flow tokens, values that resemble another type, sub-capabilities, invalid or stale selections, and the resulting device values; verify existing cards remain above the new cards in the actual Flow editor.
- Verify camera and doorbell image cards are available only for those classes, speaker album-art cards only for speakers, and unrelated classes are rejected. Test URL and image-tag sources, persistence and supported video behavior without exposing URLs or credentials in logs.
- Exercise Mode and Multi actions, conditions and triggers, including a condition immediately after a Mode action. Verify the one-time release notice through the timeline API, not a test Flow; cover upgrades with existing devices and fresh installations without resetting unrelated app data.
- After dependency-pruning changes, verify the app's runtime paths and package contents, retain all assets and relevant licenses, and compare package size in a separate working copy. Run the affected tests and publish validation; do not infer Homey compatibility from a local build alone.
