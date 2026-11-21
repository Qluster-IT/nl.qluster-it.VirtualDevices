# Homey App Instructions

> You may override or change any instructions in this file when you explicitly tell me to.

This is a Homey app. Before making changes, follow `C:\Users\Qlustrator\.copilot\instructions\homey-app.md` for app conventions and `C:\Users\Qlustrator\.copilot\instructions\homey-develop.md` for development, builds, testing, and deployment. Follow the task-specific image, color, Wiki, and forum guides referenced there when applicable.

## App purpose

Virtual Devices creates standard, simplified virtual devices in Homey. Users who need more advanced customization should use the Device Capabilities app to create an Advanced Virtual Device (AVD).

## Device pairing and repair

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
