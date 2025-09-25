// Implements the scissor tool for cutting and selecting parts of the canvas.
function scissorTool(){

    this.icon = "assets/scissor.png";
    this.name = "scissor";

    var selectMode; // 0-drawing mode, 1-cutting mode, 2-paste mode
    var selectedArea;// to store the x y w h of the selectedArea

    var selectButton;
    var selectedPixels; // to store the cut image to paste

    this.draw = function(){
        if(mouseIsPressed)
        {
            //check if the mouse press is within the canvas
            if(!mouseOnCanvas(canvas)){
                return;
            }

            if(selectMode == 0)//drawing mode and mouse pressed
            {
                //check if the previous X and Y are -1
                //set them to the current mouse X and Y if they are
                if(this.previousMouseX == -1)
                {
                    console.log("update mouse")
                    this.previousMouseX = mouseX;
                    this.previousMouseY = mouseY;
                }
                //if we already have values for previousX and Y we can draw a line from 
                //there to the current mouse location
                else
                {
                    stroke(0);
                    noFill();
                    line(this.previousMouseX, this.previoueMouseY, mouseX, mouseY);
                    this.previousMouseX = mouseX;
                    this.previousMouseY = mouseY;
                }
            }
            else if(selectMode == 1)//cutting mode and mouse pressed
            {   // keep drawing a translucent rect on       where the user is selecting
                updatePixels();
                noStroke();
                //draw a temp translucent red rect on where the user want to select
                fill(255,0,0,100);
                //selectedArea x and y is updated at this.mousePressed() in cutting mode
                //selectedArea w and h is constantly updated at this.mouseDragged() in cutting mode
                rect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);

            }
        }
        else//no mouse pressed
        {
            this.previousMouseX = -1;
            this.previousMouseY = -1;
        }
    }

    this.selectButtonClicked = function(){
        console.log("button pressed");
        if(selectMode == 0)//drawing mode
        {
            selectMode = 1; //change to cutting mode
            selectButton.html("cut"); //the next action

            loadPixels(); // store current frame
        }
        else if(selectMode == 1)//cutting mode
        {
            selectMode = 2; //change to pasting mode
            selectButton.html("end paste"); //the next mode

            //refresh the screen
            updatePixels();

            //store the pixels for pasting
            selectedPixels = get(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
            
            fill(255);
            noStrok();
            rect(selectedArea.x, selectedArea.y, selectedArea.w, selectedArea.h);
        }
        else if(selectMode == 2)//pasting mode
        {
            selectMode = 0;//change to drawing mode
            selectedArea = {x:0, y:0, w:100, h:100};
            selectButton.html("select area");
        }
    }


    this.unselectTool = function(){
        select(".options").html("");
        
        if(selectMode==1){
            updatePixels();
            fill(colourP.selectedColour);
            stroke(colourP.selectedColour);
        }
        else if(selectMode==2){
            fill(colourP.selectedColour);
            stroke(colourP.selectedColour);
        }
    };


    this.populateOptions = function(){
        selectMode = 0;
        selectedArea = {x: 0, y:0, w: 100, h:100};

        selectButton = createButton('select area');
        selectButton.parent("#options");
        selectButton.mousePressed(this.selectButtonClicked);
    }

    this.mousePressed = function(){
        //check if the mouse press is within the canvas
        if(!mouseOnCanvas(canvas)){
            return;
        }

        if(selectMode == 1) //1- cutting mode
        {
            //update the selected area to current mouse x and y
            selectedArea.x = mouseX;
            selectedArea.y = mouseY;
        }
        else if(selectMode == 2) //2-paste mode
        {
            // the actual pasting of the selected image
            push();
            translate(mouseX,mouseY);
            image(selectedPixels, -selectedArea.w/2, -selectedArea.h/2);
            pop();
        }
    }


    this.mouseDragged = function(){
        print("mouse dragged");
        if(selectMode == 1) //1-cutting method
        {
            //keep updating the selected area,
            var w = mouseX - selectedArea.x;
            var h = mouseY - selectedArea.y;

            selectedArea.w = w;
            selectedArea.h = h;

            console.log(selectedArea);
        }
    }
}

