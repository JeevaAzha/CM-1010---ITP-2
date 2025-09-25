function FillBucketTool() {
    // Tool identification properties
    this.icon = "assets/fill.png";
    this.name = "fillBucket";

    // Empty draw function required for the toolbox
    this.draw = function() {};

    // Color correction for consistent appearance across platforms
    this.normalizeColor = function(c) {
        return color(
            Math.pow(red(c) / 255, 1.8) * 255,
            Math.pow(green(c) / 255, 1.8) * 255,
            Math.pow(blue(c) / 255, 1.8) * 255,
            alpha(c)
        );
    };

    // Handle mouse press events for filling
    this.mousePressed = function() {
        // Check if mouse is within canvas bounds
        if (typeof mouseOnCanvas === 'function' && !mouseOnCanvas(canvas)) {
            return;
        }

        // Get integer coordinates
        let x = Math.floor(mouseX);
        let y = Math.floor(mouseY);

        // Validate coordinates are within canvas
        if (x < 0 || x >= width || y < 0 || y >= height) {
            return;
        }

        // Load current pixel data
        loadPixels();

        // Get target color (what we're replacing)
        let targetColor = get(x, y);
        let tR = red(targetColor);
        let tG = green(targetColor);
        let tB = blue(targetColor);
        let tA = alpha(targetColor);

        // Get and normalize the new fill color
        let fillColor = this.normalizeColor(color(colourP.selectedColour));
        let fR = red(fillColor);
        let fG = green(fillColor);
        let fB = blue(fillColor);
        let fA = alpha(fillColor);

        // Skip if colors are too similar
        if (this.colorDistance(tR, tG, tB, fR, fG, fB) < 15) {
            console.log("Colors too similar, skipping fill");
            return;
        }

        // Execute the flood fill
        this.optimizedFloodFill(x, y, tR, tG, tB, tA, fR, fG, fB, fA);
        updatePixels();
    };

    // Calculate color difference using Euclidean distance
    this.colorDistance = function(r1, g1, b1, r2, g2, b2) {
        return Math.sqrt(
            Math.pow(r1 - r2, 2) + 
            Math.pow(g1 - g2, 2) + 
            Math.pow(b1 - b2, 2)
        );
    };

    // Check if colors match within threshold
    this.colorMatch = function(r1, g1, b1, a1, r2, g2, b2, a2, threshold) {
        return this.colorDistance(r1, g1, b1, r2, g2, b2) <= threshold;
    };

    // Optimized flood fill implementation
    this.optimizedFloodFill = function(startX, startY, targetR, targetG, targetB, targetA, fillR, fillG, fillB, fillA) {
        // Initialize pixel processing stack
        let pixelStack = [{x: startX, y: startY}];
        let canvasWidth = width;
        let canvasHeight = height;
        let d = pixelDensity();

        // Helper function to calculate pixel index
        let pixelIndex = function(x, y) {
            return 4 * ((y * d) * (canvasWidth * d) + (x * d));
        };

        // Track visited pixels
        let visited = {};
        let threshold = 15;
        let updateCounter = 0;

        // Process pixels while stack is not empty
        while (pixelStack.length > 0) {
            let newPos = pixelStack.pop();
            let x = newPos.x;
            let y = newPos.y;
            let posKey = `${x},${y}`;

            // Skip if pixel was visited or out of bounds
            if (visited[posKey]) continue;
            if (x < 0 || y < 0 || x >= canvasWidth || y >= canvasHeight) continue;

            visited[posKey] = true;

            // Get current pixel color
            let idx = pixelIndex(x, y);
            let currentR = pixels[idx];
            let currentG = pixels[idx + 1];
            let currentB = pixels[idx + 2];
            let currentA = pixels[idx + 3];

            // Skip if color doesn't match target
            if (!this.colorMatch(currentR, currentG, currentB, currentA, 
                               targetR, targetG, targetB, targetA, threshold)) {
                continue;
            }

            // Set new color
            pixels[idx] = fillR;
            pixels[idx + 1] = fillG;
            pixels[idx + 2] = fillB;
            pixels[idx + 3] = fillA;

            // Add adjacent pixels to stack
            pixelStack.push({x: x+1, y: y});
            pixelStack.push({x: x-1, y: y});
            pixelStack.push({x: x, y: y+1});
            pixelStack.push({x: x, y: y-1});

            // Update display periodically for visual feedback
            updateCounter++;
            if (updateCounter % 5000 === 0) {
                updatePixels();
            }
        }
    };
}