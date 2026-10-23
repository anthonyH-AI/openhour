#!/bin/bash
# Removes the hourly Open Hour push job.
PLIST="$HOME/Library/LaunchAgents/org.openhour.autopush.plist"
launchctl bootout "gui/$(id -u)" "$PLIST" 2>/dev/null || true
rm -f "$PLIST"
echo "Removed."
