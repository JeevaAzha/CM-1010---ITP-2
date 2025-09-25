// Main application script, manages the tools and user interactions.
// Global variables that will store the toolbox, colour palette, helper functions, and canvas
var toolbox = null;
var colourP = null;
var helpers = null;
var canvas = null;

var penThickness = 5;  // Default pen thickness
var penSlider;

// Spray can object literal
sprayCan = {
    name: "Spray Can",
    icon: "assets/spraycan.jpeg",
    points: 30, // Number of dots per spray
    spreadMultiplier: 5, // Scale factor for spread

    draw: function() {
        if (!mouseOnCanvas(canvas)) {
            return;
        }

        if (mouseIsPressed) {
            let spreadArea = max(5, penThickness * this.spreadMultiplier); // ✅ Prevents zero spread

            for (let i = 0; i < this.points; i++) {
                let offsetX = random(-spreadArea, spreadArea);
                let offsetY = random(-spreadArea, spreadArea);

                let dotSize = random(1, 5); // ✅ Keeps particles small and realistic

                noStroke();
                fill(colourP.selectedColour); // ✅ Uses currently selected color
                ellipse(mouseX + offsetX, mouseY + offsetY, dotSize, dotSize);
            }
        }
    }
};



// Function to create the pen thickness slider
function createPenThicknessSlider() {
    let sliderContainer = createDiv();  // Wrapper to control visibility
    sliderContainer.id('penThicknessContainer');
    sliderContainer.style('display', 'none');  // Initially hidden

    penSlider = createSlider(1, 20, 5); // Slider from 1px to 20px, default 5px
    penSlider.parent(sliderContainer); // Attach to the container
    penSlider.style('width', '200px');
    penSlider.input(() => {
        penThickness = penSlider.value();  // Update global pen thickness
    });

    let label = createP('Thickness'); // Header for the slider
    label.parent(sliderContainer); // Attach to the container

    sliderContainer.position(150, height + 100); // Adjust position
}

// Function to show/hide slider based on selected tool
function updateSliderVisibility() {
    console.log("Current Tool Selected:", toolbox.selectedTool.name);  // Debugging log

    // Ensure names match actual assigned tool names
    let toolsThatUseThickness = ["freehand", "LineTo", "Spray Can", "eraser"];
    let currentToolName = toolbox.selectedTool.name.trim(); // Avoid whitespace issues

    if (toolsThatUseThickness.includes(currentToolName)) {
        select('#penThicknessContainer').style('display', 'block'); // Show slider
    } else {
        select('#penThicknessContainer').style('display', 'none');  // Hide slider
    }
}

// p5.js setup function
function setup() {
    // Create a canvas to fill the content div from index.html
    canvasContainer = select('#content');
    var c = createCanvas(canvasContainer.size().width, canvasContainer.size().height);
    c.parent("content");
    canvas = c;

    // Create helper functions and the colour palette
    helpers = new HelperFunctions();
    colourP = new ColourPalette();

    createPenThicknessSlider(); // Create the slider

    // Create a toolbox for storing the tools
    toolbox = new Toolbox();

    // Add tools to the toolbox
    toolbox.addTool(new FreehandTool());  // Freehand Tool
    toolbox.addTool(new LineToTool());  // Line Tool
    toolbox.addTool(sprayCan);  // Spray Tool (Fixed name)
    toolbox.addTool(new mirrorDrawTool());
    toolbox.addTool(new stampTool());
    toolbox.addTool(new scissorTool());
    toolbox.addTool(new FillBucketTool());
    toolbox.addTool(new EraserTool());  // Eraser

    background(255);
    
    // Call function to update slider visibility when tool is changed
    setInterval(updateSliderVisibility, 100); // Run every 100ms to update the UI
}

// p5.js draw function
function draw() {
    // Call the draw function from the selected tool.
    if (toolbox.selectedTool.hasOwnProperty("draw")) {
        toolbox.selectedTool.draw();
    } else {
        alert("It doesn't look like your tool has a draw method!");
    }
}

// p5.js mousePressed function
function mousePressed() {
    if (toolbox.selectedTool.hasOwnProperty("mousePressed")) {
        toolbox.selectedTool.mousePressed();
    }
}

// p5.js mouseDragged function
function mouseDragged() {
    if (toolbox.selectedTool.hasOwnProperty("mouseDragged")){
        toolbox.selectedTool.mouseDragged();
    }
}
