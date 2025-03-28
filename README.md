# NetSpeed GNOME Shell Extension

A simple GNOME Shell extension that displays network upload and download speeds in the top panel.

## Features

- Real-time display of upload and download speeds
- Simple and clean interface integrated into the GNOME Shell top panel
- Automatic unit conversion (B/s, KB/s, MB/s)

## Installation

### Manual Installation

1. Clone this repository:
   ```sh
   git clone https://github.com/neillee95/gnome-shell-extension-netspeed.git
   ```

2. Copy or link the extension to the GNOME Shell extensions directory:
   ```sh
   cp -r gnome-shell-extension-netspeed ~/.local/share/gnome-shell/extensions/netspeed@neillee.github.com
   ```

3. Compile the schema:
    ```sh
   cd ~/.local/share/gnome-shell/extensions/netspeed@neillee.github.com

   glib-compile-schemas schemas/
    ```

4. Restart GNOME Shell:
   - Press Alt+F2, type 'r' and press Enter (on X11)
   - Or log out and log back in (on Wayland)

5. Enable the extension using GNOME Extensions app or the Extensions website.

## Compatibility

This extension is compatible with GNOME Shell 42.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.