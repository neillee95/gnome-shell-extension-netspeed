const { GObject, Gtk, Gio } = imports.gi;
const ExtensionUtils = imports.misc.extensionUtils;

class NetSpeedPrefsWidget extends Gtk.Box {
    static {
        GObject.registerClass(this);
    }

    constructor() {
        super();

        // Get settings
        this._settings = ExtensionUtils.getSettings();

        this.margin = 20;
        this.set_spacing(15);
        this.set_orientation(Gtk.Orientation.VERTICAL);

        // Create a label
        let label = new Gtk.Label({
            label: '<b>NetSpeed Extension Preferences</b>',
            use_markup: true,
            xalign: 0
        });
        this.append(label);

        // Add a separator
        this.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL }));

        // Add refresh interval setting
        let refreshBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            margin_top: 10,
            margin_bottom: 10,
            spacing: 10
        });

        let refreshLabel = new Gtk.Label({
            label: 'Refresh Interval (seconds):',
            xalign: 0
        });
        refreshBox.append(refreshLabel);

        let adjustment = new Gtk.Adjustment({
            lower: 1,
            upper: 10,
            step_increment: 1
        });

        let refreshScale = new Gtk.Scale({
            orientation: Gtk.Orientation.HORIZONTAL,
            adjustment,
            digits: 0,
            hexpand: true,
            value_pos: Gtk.PositionType.RIGHT,
            round_digits: 0
        });

        // Add a signal handler to ensure integer values
        refreshScale.connect('value-changed', () => {
            let value = refreshScale.get_value();
            let roundedValue = Math.round(value);
            if (value !== roundedValue) {
                refreshScale.set_value(roundedValue);
            }
        });

        // Add marks to the scale
        for (let i = 1; i <= 10; i++) {
            refreshScale.add_mark(i, Gtk.PositionType.BOTTOM, i.toString());
        }

        refreshBox.append(refreshScale);
        this.append(refreshBox);

        // Bind the scale to the settings
        this._settings.bind(
            'refresh-interval',
            adjustment,
            'value',
            Gio.SettingsBindFlags.DEFAULT
        );

        // Add a separator
        this.append(new Gtk.Separator({ orientation: Gtk.Orientation.HORIZONTAL }));

        // Add a simple info label
        let infoLabel = new Gtk.Label({
            label: 'This extension displays network upload and download speeds in the top panel.',
            xalign: 0,
            wrap: true
        });
        this.append(infoLabel);

        // Add a link to GitHub
        let linkBox = new Gtk.Box({
            orientation: Gtk.Orientation.HORIZONTAL,
            margin_top: 10
        });

        let linkLabel = new Gtk.Label({
            label: 'Visit GitHub repository:',
            xalign: 0
        });
        linkBox.append(linkLabel);

        let linkButton = new Gtk.LinkButton({
            label: 'NetSpeed Extension',
            uri: 'https://github.com/lee/gnome-shell-extension-netspeed'
        });
        linkBox.append(linkButton);

        this.append(linkBox);
    }
}

function init() {
}

function buildPrefsWidget() {
    return new NetSpeedPrefsWidget();
}