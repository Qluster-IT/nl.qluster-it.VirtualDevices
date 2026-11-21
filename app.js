"use strict";

const Homey = require('homey');

class VirtualDevices extends Homey.App {

	onInit() {

		if (process.env.DEBUG === '1' || false) {
			try {
				require('inspector').waitForDebugger();
			}
			catch (error) {
				require('inspector').open(9210, '0.0.0.0', true);
			}
		}
		this.log('Virtual Devices App is initialized');
		this._releaseDrivers = new Map();
	}

	registerReleaseDriver(id, driver) {
		this._releaseDrivers.set(id, driver);
		if (this._releaseDrivers.size === 3) {
			this._notifyReleaseFeatures().catch(error => {
				this.error('Unable to deliver release notification', error);
			});
		}
	}

	async _notifyReleaseFeatures() {
		const key = 'release2NotificationAttempted';
		if (this.homey.settings.get(key)) return;

		const drivers = [...this._releaseDrivers.values()];
		await Promise.all(drivers.map(driver => driver.ready()));
		const hasDevices = drivers.some(driver => driver.getDevices().length > 0);
		this.homey.settings.set(key, true);
		if (hasDevices) {
			await this.homey.notifications.createNotification({
				excerpt: this.homey.__('release.notice'),
			});
		}
	}
}

module.exports = VirtualDevices;
