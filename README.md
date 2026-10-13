# BedMapper

A lightweight, client-side web tool to render interactive 3D surface plots of 3D printer bed meshes directly from raw console output.

Live Demo: https://kanrog.com/BedMapper

## Overview

Not all 3D printer firmware or OEM interfaces provide a visual representation of bed mesh probe data. BedMapper solves this by taking the raw coordinate output from your printer's console and plotting it into a fully interactive 3D heatmap. Everything runs entirely in your browser using vanilla HTML, CSS, and Plotly.js.

## Features

* Client-Side Processing: No data is sent to any server. All parsing and rendering happens locally in your browser.
* Interactive 3D Plot: Rotate, zoom, and inspect your bed mesh topology to identify high and low spots.
* Automatic Averaging: If multiple probe samples are taken at the same coordinate, the tool automatically averages the Z-heights.
* Variance Calculation: Automatically calculates and displays the total variance (difference between the highest and lowest points) of your bed.

## How it Works

BedMapper uses regular expressions to scan your pasted text for lines containing X, Y, and Z coordinate data. It extracts these numbers, automatically rounds the X and Y coordinates to snap them to a clean grid (fixing slight variations in Klipper probe positions), and averages any duplicate probe points. Finally, it uses the Plotly.js library to render this unified matrix into an interactive 3D surface.

## Security

All processing is performed locally on your device. BedMapper is a completely static web application. No data, console output, or telemetry is ever transmitted to a server, saved to a database, or stored externally. 

## How to Use

1. Run a bed mesh probe on your 3D printer.
2. Copy the raw probe output from your terminal or console. The text should look similar to:
   ```text
   // probe at 10.000,10.000 is z=-0.048281
   // probe at 10.000,10.000 is z=-0.046875
   ```
3. Navigate to https://kanrog.com/BedMapper.
4. Paste the console output into the text area.
5. Click "Render 3D Mesh".

## Deployment

This project is designed to be hosted statically. Simply serve the index.html, style.css, and script.js files from any web server or static hosting provider like GitHub Pages.

## License

Copyright (c) 2026 Kanrog Creations.