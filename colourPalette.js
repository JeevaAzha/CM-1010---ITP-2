// Manages the color palette selection and UI.
function ColourPalette() {
    // Default color set to black
    this.selectedColour = "rgba(0, 0, 0, 1)";
    var self = this;

    // Create the color picker UI container (shifted slightly to the right)
    this.colorPickerContainer = createDiv('').id('color-picker');
    this.colorPickerContainer.style('position', 'absolute');
    this.colorPickerContainer.style('bottom', '10px');
    this.colorPickerContainer.style('left', '55%'); // Shifted slightly to the right
    this.colorPickerContainer.style('transform', 'translateX(-50%)');
    this.colorPickerContainer.style('background', '#000'); // Black background
    this.colorPickerContainer.style('padding', '10px');
    this.colorPickerContainer.style('border-radius', '8px');
    this.colorPickerContainer.style('display', 'flex');
    this.colorPickerContainer.style('align-items', 'center');
    this.colorPickerContainer.style('gap', '15px'); // Spacing between elements

    // Function to create labeled sliders horizontally
    function createLabeledSlider(labelText, min, max, defaultValue, step = 1) {
        let wrapper = createDiv('').parent(self.colorPickerContainer);
        wrapper.style('display', 'flex');
        wrapper.style('align-items', 'center');
        wrapper.style('gap', '5px');

        let label = createDiv(labelText).parent(wrapper);
        label.style('color', 'white');
        label.style('font-weight', 'bold');

        let slider = createSlider(min, max, defaultValue, step).parent(wrapper);
        return slider;
    }

    // Create RGB and Alpha sliders with labels (horizontal)
    this.redSlider = createLabeledSlider("R", 0, 255, 0);
    this.greenSlider = createLabeledSlider("G", 0, 255, 0);
    this.blueSlider = createLabeledSlider("B", 0, 255, 0);
    this.alphaSlider = createLabeledSlider("A", 0, 1, 1, 0.01);

    // Create preview box
    this.previewBox = createDiv('').parent(this.colorPickerContainer);
    this.previewBox.style('width', '40px');
    this.previewBox.style('height', '40px');
    this.previewBox.style('border', '1px solid white');
    this.previewBox.style('background-color', this.selectedColour);
    this.previewBox.style('cursor', 'pointer');
    this.previewBox.style('border-radius', '50%'); // Circular preview

    // Create HEX & RGBA Display
    this.hexDisplay = createInput('#000000').parent(this.colorPickerContainer);
    this.hexDisplay.input(() => self.setColorFromHex());

    this.rgbaDisplay = createInput('rgba(0,0,0,1)').parent(this.colorPickerContainer);
    this.rgbaDisplay.input(() => self.setColorFromRGBA());

    // Preset Colors (optional, can be placed at the end)
    this.presetContainer = createDiv('').parent(this.colorPickerContainer);
    this.presetContainer.style('display', 'flex');
    this.presetContainer.style('gap', '5px');

    this.presetColors = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF', '#000000', '#FFFFFF'];
    this.presetColors.forEach(color => {
        let colorSwatch = createDiv('').parent(this.presetContainer);
        colorSwatch.style('width', '25px');
        colorSwatch.style('height', '25px');
        colorSwatch.style('background-color', color);
        colorSwatch.style('cursor', 'pointer');
        colorSwatch.style('border-radius', '50%'); // Circular swatches
        colorSwatch.mousePressed(() => {
            self.setColorFromHexValue(color);
        });
    });

    // Function to update color
    this.updateColor = function () {
        var r = self.redSlider.value();
        var g = self.greenSlider.value();
        var b = self.blueSlider.value();
        var a = self.alphaSlider.value();
        self.selectedColour = `rgba(${r}, ${g}, ${b}, ${a})`;
        self.updateUI();
    };

    this.updateUI = function () {
        fill(self.selectedColour);
        stroke(self.selectedColour);
        self.previewBox.style('background-color', self.selectedColour);
        self.hexDisplay.value(self.rgbToHex(self.selectedColour));
        self.rgbaDisplay.value(self.selectedColour);
    };

    this.rgbToHex = function (rgba) {
        var result = rgba.match(/\d+/g);
        return `#${((1 << 24) + (parseInt(result[0]) << 16) + (parseInt(result[1]) << 8) + parseInt(result[2])).toString(16).slice(1).toUpperCase()}`;
    };

    this.setColorFromHex = function () {
        self.setColorFromHexValue(self.hexDisplay.value());
    };

    this.setColorFromRGBA = function () {
        self.selectedColour = self.rgbaDisplay.value();
        self.updateUI();
    };

    this.setColorFromHexValue = function (hex) {
        self.selectedColour = hex;
        let rgb = self.hexToRgb(hex);
        if (rgb) {
            self.redSlider.value(rgb.r);
            self.greenSlider.value(rgb.g);
            self.blueSlider.value(rgb.b);
            self.alphaSlider.value(1);
            self.updateUI();
        }
    };

    this.hexToRgb = function (hex) {
        let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
        hex = hex.replace(shorthandRegex, function(m, r, g, b) {
            return r + r + g + g + b + b;
        });
        let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
        return result ? {
            r: parseInt(result[1], 16),
            g: parseInt(result[2], 16),
            b: parseInt(result[3], 16)
        } : null;
    };

    this.redSlider.input(this.updateColor);
    this.greenSlider.input(this.updateColor);
    this.blueSlider.input(this.updateColor);
    this.alphaSlider.input(this.updateColor);
}
