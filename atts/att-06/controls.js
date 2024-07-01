"use strict"
class Controls {
    defaultValue = 0;

    constructor(type = "", positiveLabel = "", negativeLabel = "", { increment = 1 } = {} ) {
        this.type = type;

        this.currValue = this.defaultValue;
        this.increment = increment;
        
        this.labels = {
            curr: "Parado",
            pos: positiveLabel,
            neg: negativeLabel
        }

        this.changeBtn = window.document.querySelector(`#change-${type}-btn`);
        this.startBtn = window.document.querySelector(`#start-${type}-btn`);
        this.stopBtn = window.document.querySelector(`#stop-${type}-btn`);

        this.labelSpan = window.document.querySelector(`#${type}-direction`);

        this.setButton("stop", () => { 
            this.currValue = this.defaultValue;
            this.updateLabel();
            this.logs()
        });

        this.setButton("start", () => { 
            this.currValue = this.increment;
            this.updateLabel();
            this.logs()
        });

        this.setButton("change", () => { 
            this.increment *= -1; 
            this.currValue = this.increment;
            this.updateLabel();
            this.logs();
        })
    }
    
    setButton(type, callback = () => {}) {this[`${type}Btn`].addEventListener("click", callback);}

    updateLabel() {
        switch(Math.sign(this.currValue)) {
            case +1:
                this.labels.curr = this.labels.pos;
                break;
            case 0:
                this.labels.curr = "Parado";
                break;
            case -1:
                this.labels.curr = this.labels.neg;
                break;
        }

        console.log(this.labelSpan)

        this.labelSpan.innerText = this.labels.curr;
    }

    logs() {
        console.log(`label: ${this.labels.curr}
current: ${this.currValue}
increment: ${this.increment}`
        )
    }
}