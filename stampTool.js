// Implements the stamp tool to place predefined images on the canvas.
function stampTool() {
    // Set an icon and a name for the object
    this.icon = "assets/stamp.png";
    this.name = "stamptool";

    // Variables to store assets, user-selected options, and sliders
    var star; // Image for the star
    var cloud; // Image for the cloud
    var imageSelector; // Dropdown selector for the stamp type
    var selectedImage; // Currently selected image
    var sizeSlider; // Slider for controlling stamp size
    var rotationSlider; // **Added** Slider for controlling stamp rotation

    // Preload assets in setup
    this.setup = function () {
        star = loadImage("./assets/star.png"); // Load the star image
        cloud = loadImage("./assets/cloud.png"); // Load the cloud image
        console.log("in stamp tool setup");
    };
    this.setup(); // Call setup immediately when the tool is created

    // Empty draw function (can be expanded if needed later)
    this.draw = function () {};

    // Draw custom vertex stamp (non-image stamp)
    this.drawStamp = function (rotation) {
        push(); // Save the current drawing state
        translate(mouseX, mouseY); // Move the origin to the mouse position
        rotate(rotation); // **Changed** Apply rotation using the provided rotation value
        beginShape(); // Begin a custom shape
        fill(255); // Fill color for the shape
        var xOffSet = 80;
        var yOffSet = 80;
        beginShape();
        // Chin and jaw
        vertex(30 - xOffSet, 140 - yOffSet); 
        vertex(70 - xOffSet, 130 - yOffSet); 
        vertex(90 - xOffSet, 150 - yOffSet); 
        vertex(110 - xOffSet, 130 - yOffSet); 
        vertex(150 - xOffSet, 140 - yOffSet); 

        // Cheekbones
        vertex(120 - xOffSet, 100 - yOffSet);
        vertex(160 - xOffSet, 80 - yOffSet);
        vertex(140 - xOffSet, 40 - yOffSet); 

        // Forehead and top
        vertex(100 - xOffSet, 20 - yOffSet); 
        vertex(60 - xOffSet, 40 - yOffSet); 
        vertex(40 - xOffSet, 80 - yOffSet); 
        vertex(70 - xOffSet, 100 - yOffSet); 

        // Connect back to jaw
        vertex(30 - xOffSet, 140 - yOffSet); 

        endShape(CLOSE);

        // Eye sockets
        fill(0);
        ellipse(60 - xOffSet, 80 - yOffSet, 20, 20); // Left eye
        ellipse(100 - xOffSet, 80 - yOffSet, 20, 20); // Right eye

        // Nose
        triangle(80 - xOffSet, 90 - yOffSet, 70 - xOffSet, 110 - yOffSet, 90 - xOffSet, 110 - yOffSet);

        pop(); // Restore the previous drawing state
    };

    // Handle mousePressed events (stamping action)
    this.mousePressed = function () {
        // Ensure the action occurs only if the mouse is on the canvas
        if (!mouseOnCanvas(canvas)) {
            return;
        }

        // Get the selected image or shape type
        var imageSelected = imageSelector.value();

        // **Added** Convert rotation slider value (degrees) to radians
        var rotationInRadians = radians(rotationSlider.value());

        // Check if the user selected the custom vertex stamp
        if (imageSelected == "vertex") {
            this.drawStamp(rotationInRadians); // **Changed** Draw the custom shape with rotation
        } else {
            // Otherwise, stamp the selected image
            var stampSize = sizeSlider.value(); // Get the size from the slider
            var stampX = mouseX - stampSize + stampSize / 2;
            var stampY = mouseY - stampSize + stampSize / 2;

            push(); // **Added** Save the current drawing state
            translate(mouseX, mouseY); // **Added** Move origin to mouse position
            rotate(rotationInRadians); // **Added** Rotate the canvas for the image
            image(selectedImage, -stampSize / 2, -stampSize / 2, stampSize, stampSize); // **Changed** Adjust position to center the image
            pop(); // **Added** Restore the drawing state
        }
    };

    // Unselect the tool and clear options
    this.unselectTool = function () {
        console.log("stamp tool unselected");
        select("#options").html(""); // Clear the options UI
    };

    // Populate options for the tool (sliders and dropdown)
 this.populateOptions = function () {
    console.log("stamp tool selected");

    // Clear previous options to avoid duplicates
    select("#options").html(""); 

    // Dropdown selector for the stamp type
    imageSelector = createSelect();
    imageSelector.parent("#options");
    imageSelector.option("star");
    imageSelector.option("cloud");
    imageSelector.option("vertex");
    imageSelector.changed(this.mySelectEvent); // Change event to update the selection
    selectedImage = star; // Default to the star image

    // Add a line break for spacing
    createDiv("").parent("#options");

   // Create a container div for better organization
let sizeContainer = createDiv();
sizeContainer.parent("#options");
sizeContainer.style('margin-bottom', '10px');

// Size label and slider
let sizeLabel = createDiv("Size");
sizeLabel.parent(sizeContainer);
sizeLabel.style("color", "black");
sizeLabel.style("font-weight", "bold");
sizeLabel.style("margin-bottom", "5px");

sizeSlider = createSlider(5, 50, 20);
sizeSlider.parent(sizeContainer);

// Create a container for rotation controls
let rotationContainer = createDiv();
rotationContainer.parent("#options");
rotationContainer.style('margin-bottom', '10px');

// Rotation label and slider
let rotationLabel = createDiv("Rotation");
rotationLabel.parent(rotationContainer);
rotationLabel.style("color", "black");
rotationLabel.style("font-weight", "bold");
rotationLabel.style("margin-bottom", "5px");

rotationSlider = createSlider(0, 360, 0);
rotationSlider.parent(rotationContainer);

    // Make sure size slider visibility is correctly set
    this.mySelectEvent();
};



    // Event triggered when dropdown selection changes
    this.mySelectEvent = function () {
        var imageSelected = imageSelector.value(); // Get the selected option
        sizeSlider.style("display", "block"); // Show the size slider by default
        if (imageSelected == "star") {
            selectedImage = star; // Set to star image
        } else if (imageSelected == "cloud") {
            selectedImage = cloud; // Set to cloud image
        } else if (imageSelected == "vertex") {
            sizeSlider.style("display", "none"); // Hide the size slider for custom shape
        }
    };
}
