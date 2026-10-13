document.getElementById('renderBtn').addEventListener('click', parseAndRender);

function parseAndRender() {
    const inputText = document.getElementById('consoleInput').value;
    
    const regex = /probe at\s+([0-9.-]+),\s*([0-9.-]+)\s+is\s+z=([0-9.-]+)/gi;
    
    let match;
    const dataMap = new Map();
    let matchCount = 0;

    console.log("--- Starting Parsing Process ---");

    while ((match = regex.exec(inputText)) !== null) {
        matchCount++;
        const x = Math.round(parseFloat(match[1]));
        const y = Math.round(parseFloat(match[2]));
        const z = parseFloat(match[3]);
        const key = `${x},${y}`;

        if (!dataMap.has(key)) {
            dataMap.set(key, []);
        }
        dataMap.get(key).push(z);
    }

    console.log(`Total Regex Matches Found: ${matchCount}`);
    console.log("Data Map (Grouped by rounded X,Y):", dataMap);

    if (dataMap.size === 0) {
        alert("No valid probe data found.");
        return;
    }

    const uniqueX = new Set();
    const uniqueY = new Set();
    const averagedData = [];

    for (const [key, zValues] of dataMap.entries()) {
        const [x, y] = key.split(',').map(Number);
        const avgZ = zValues.reduce((sum, val) => sum + val, 0) / zValues.length;
        uniqueX.add(x);
        uniqueY.add(y);
        averagedData.push({ x, y, z: avgZ });
    }

    const xVals = Array.from(uniqueX).sort((a, b) => a - b);
    const yVals = Array.from(uniqueY).sort((a, b) => a - b);

    console.log("Sorted X Axis Coordinates:", xVals);
    console.log("Sorted Y Axis Coordinates:", yVals);

    const zMatrix = [];
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < yVals.length; i++) {
        const row = [];
        for (let j = 0; j < xVals.length; j++) {
            const point = averagedData.find(p => p.x === xVals[j] && p.y === yVals[i]);
            // Note: If a point is missing in the grid, it pushes 'null'. Plotly surface plots fail if they hit nulls.
            const zVal = point ? point.z : null;
            row.push(zVal);
            
            if (zVal !== null) {
                if (zVal < minZ) minZ = zVal;
                if (zVal > maxZ) maxZ = zVal;
            }
        }
        zMatrix.push(row);
    }

    console.log("Final Z Matrix generated for Plotly:", zMatrix);

    const plotData = [{
        z: zMatrix,
        x: xVals,
        y: yVals,
        type: 'surface',
        colorscale: 'Jet',
        colorbar: {
            title: 'Z Height (mm)'
        }
    }];

    const layout = {
        title: {
            text: `Bed Mesh Topology (Variance: ${(maxZ - minZ).toFixed(3)}mm)`,
            font: { color: '#cdd6f4' }
        },
        paper_bgcolor: 'rgba(0,0,0,0)',
        plot_bgcolor: 'rgba(0,0,0,0)',
        autosize: true,
        margin: { l: 65, r: 50, b: 65, t: 90 },
        scene: {
            xaxis: { title: 'X Axis', color: '#cdd6f4', gridcolor: '#45475a' },
            yaxis: { title: 'Y Axis', color: '#cdd6f4', gridcolor: '#45475a' },
            zaxis: { title: 'Z Axis', color: '#cdd6f4', gridcolor: '#45475a' },
            camera: {
                eye: { x: -1.25, y: -1.25, z: 0.75 }
            }
        }
    };

    try {
        Plotly.newPlot('plotContainer', plotData, layout, {responsive: true});
        console.log("Plotly render triggered successfully.");
    } catch (error) {
        console.error("Plotly rendering failed:", error);
    }
}