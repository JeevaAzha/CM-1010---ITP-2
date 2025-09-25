// Implements the eraser tool to remove drawn content from the canvas.
function EraserTool() {
    this.name = "eraser";
    this.icon = "assets/eraser.png";

    this.previousMouseX = -1;
    this.previousMouseY = -1;

    this.draw = function() {
        if (mouseIsPressed) {
            if (!mouseOnCanvas(canvas)) {
                return;
            }

            // Use the slider value for pen thickness
            strokeWeight(penThickness);
            stroke(255);  // Erase with white color
            strokeCap(ROUND); // Correct p5.js function for smooth line edges

            if (this.previousMouseX === -1) {
                point(mouseX, mouseY);
            } else {
                line(this.previousMouseX, this.previousMouseY, mouseX, mouseY);
            }

            this.previousMouseX = mouseX;
            this.previousMouseY = mouseY;
        } else {
            this.previousMouseX = -1;
            this.previousMouseY = -1;
        }
    };

    // Reset stroke when the tool is deselected
    this.unselectTool = function() {
        stroke(colourP.selectedColour);
    };
}
