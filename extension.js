const { St, GLib, Clutter, GObject } = imports.gi;

const Mainloop = imports.mainloop;
const Main = imports.ui.main;
const PanelMenu = imports.ui.panelMenu;
const PopupMenu = imports.ui.popupMenu;
const ExtensionUtils = imports.misc.extensionUtils;

var NetSpeedIndicator = class NetSpeedIndicator extends PanelMenu.Button {
    static {
        GObject.registerClass(this);
    }

    constructor() {
        super(0.0, 'NetSpeed Indicator', false);

        this._prevUpBytes = 0;
        this._prevDownBytes = 0;

        // Create a panel button with icon and label
        this.buttonBox = new St.BoxLayout({ style_class: 'panel-status-menu-box' });

        // Add network icon
        this.icon = new St.Icon({
            icon_name: 'network-transmit-receive-symbolic',
            style_class: 'system-status-icon'
        });
        this.buttonBox.add_child(this.icon);

        // Add label to display network speed
        this.speedLabel = new St.Label({
            text: '0 KB/s ↑\n0 KB/s ↓',
            y_align: Clutter.ActorAlign.CENTER
        });
        this.buttonBox.add_child(this.speedLabel);

        this.add_child(this.buttonBox);
    }

    refreshSpeed(refreshInterval) {
        this._refreshInterval = refreshInterval;

        if (this._updateTimeout) {
            Mainloop.source_remove(this._updateTimeout);
        }

        this._updateTimeout = Mainloop.timeout_add_seconds(refreshInterval, () => {
            // Read current network statistics
            let [up, down] = this._getNetworkUsage();

            // Format the speed values
            let upText = this._formatSpeed(up);
            let downText = this._formatSpeed(down);

            // Update the label
            this.speedLabel.set_text(`${upText} ↑\n${downText} ↓`);

            return GLib.SOURCE_CONTINUE;
        });
    }

    _getNetworkUsage() {
        let upBytes = 0;
        let downBytes = 0;

        try {
            // Read network statistics from /proc/net/dev
            let file = GLib.file_get_contents('/proc/net/dev');
            if (file[0]) {
                let lines = String(file[1]).split('\n');

                // Skip the first two lines (headers)
                for (let i = 2; i < lines.length; i++) {
                    let line = lines[i].trim();
                    if (line.length === 0) continue;

                    // Skip loopback interface
                    if (line.indexOf('lo:') === 0) continue;

                    let parts = line.split(':');
                    if (parts.length < 2) continue;

                    let values = parts[1].trim().split(/\s+/);
                    if (values.length < 10) continue;

                    // Received bytes are at index 0, transmitted at index 8
                    downBytes += parseInt(values[0]);
                    upBytes += parseInt(values[8]);
                }
            }
        } catch (e) {
            console.debug(`NetSpeed: Error reading network statistics: ${e.message}`);
        }

        // Calculate the difference since last reading
        let upDiff = (upBytes - this._prevUpBytes) / this._refreshInterval;
        let downDiff = (downBytes - this._prevDownBytes) / this._refreshInterval;

        // Update previous values
        this._prevUpBytes = upBytes;
        this._prevDownBytes = downBytes;

        // Return bytes per second
        return [upDiff, downDiff];
    }

    _formatSpeed(bytes) {
        if (bytes < 0) bytes = 0;

        // Convert to appropriate unit (bytes)
        if (bytes < 1024) {
            return `${bytes} B/s`;
        } else if (bytes < 1048576) {
            return `${(bytes / 1024).toFixed(1)} KB/s`;
        } else {
            return `${(bytes / 1048576).toFixed(1)} MB/s`;
        }
    }

    destroy() {
        if (this._updateTimeout) {
            Mainloop.source_remove(this._updateTimeout);
            this._updateTimeout = null;
        }

        super.destroy();
    }
}

class Extension {
    enable() {
        this._settings = ExtensionUtils.getSettings();

        this._netSpeedIndicator = new NetSpeedIndicator();
        Main.panel.addToStatusArea('netspeed-indicator', this._netSpeedIndicator);
        this._netSpeedIndicator.refreshSpeed(this._settings.get_int('refresh-interval'));

        this._settings.connect('changed::refresh-interval', (settings, key) => {
            this._netSpeedIndicator.refreshSpeed(settings.get_int(key));
        });
    }

    disable() {
        if (this._netSpeedIndicator) {
            this._netSpeedIndicator.destroy();
            this._netSpeedIndicator = null;
        }
        this._settings = null;
    }
}

function init() {
    return new Extension();
}