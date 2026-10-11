document.getElementById('renderBtn').addEventListener('click', parseAndRender);

function parseAndRender() {
    const inputText = document.getElementById('consoleInput').value;
    const regex = /probe at\s+([\d\.]+),\s*([\d\.]+)\s+is z=([-\d\.]+)/gi;
    let match;
    const dataMap = new Map();

    while ((match = regex.exec(inputText)) !== null) {
        const x = parseFloat(match[1]);
        const y = parseFloat(match[2]);
        const z = parseFloat(match[3]);
        const key = `${x},${y}`;

        if (!dataMap.has(key)) {
            dataMap.set(key, []);
        }
        dataMap.get(key).push(z);
    }

    if (dataMap.size === 0) {
        alert("No valid probe data found. Ensure your text includes lines like: // probe at 10.000,10.000 is z=-0.048");
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

    const zMatrix = [];
    let minZ = Infinity;
    let maxZ = -Infinity;

    for (let i = 0; i < yVals.length; i++) {
        const row = [];
        for (let j = 0; j < xVals.length; j++) {
            const point = averagedData.find(p => p.x === xVals[j] && p.y === yVals[i]);
            const zVal = point ? point.z : null;
            row.push(zVal);
            
            if (zVal !== null) {
                if (zVal < minZ) minZ = zVal;
                if (zVal > maxZ) maxZ = zVal;
            }
        }
        zMatrix.push(row);
    }

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

    Plotly.newPlot('plotContainer', plotData, layout, {responsive: true});
}
