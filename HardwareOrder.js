const Order = require("./Order");

const OrderState = Object.freeze({
    WELCOMING:   Symbol("welcoming"),
    SHOVEL:   Symbol("size"),
    DUSTBIN:   Symbol("toppings"),
    LIGHTBULB: Symbol("curry"),
    FURNACEFILTER: Symbol("spicy"),
    UPSELL:  Symbol("drinks"),
    PAYMENT: Symbol("payment")
});

let total = 0;

module.exports = class HardwareOrder extends Order{
    constructor(sNumber, sUrl){
        super(sNumber, sUrl);
        this.stateCur = OrderState.WELCOMING;
        this.s1 = "";
        this.s2 = "";
        this.s3 = "";
        this.s4 = "";
        this.s5 = "";
        this.sTotal = total;
        this.sTax = 1.13;
    }
    handleInput(sInput){
        let aReturn = [];
        switch(this.stateCur){
            case OrderState.WELCOMING:
                this.stateCur = OrderState.SHOVEL;
                aReturn.push("Welcome to Prabh's Hardware.");
                aReturn.push(`${this.sUrl}/payment/${this.sNumber}/`);
                aReturn.push("Would you like to order some SHOVEL, BROOM, SHOVEL AND BROOM or NO SHOVEL OR BROOM?");
                break;
            case OrderState.SHOVEL:
              if (sInput.toLowerCase() == "shovel" || sInput.toLowerCase() == "broom" || sInput.toLowerCase() == "shovel and broom" || sInput.toLowerCase() == "no shovel or broom"){
                this.stateCur = OrderState.DUSTBIN
                this.s1 = sInput;
                switch(sInput.toLowerCase()){
                  case "shovel":
                    this.sTotal = this.sTotal + 5;
                    break;
                  case "broom":
                    this.sTotal = this.sTotal + 4;
                    break;
                  case "shovel and broom":
                    this.sTotal = this.sTotal + 9;
                    break;
                  case "no shovel or broom":
                    this.sTotal = this.sTotal + 0;
                    break;
                }
                aReturn.push("How about some dustbin or recycling container");
              } else {
                aReturn.push("please enter SHOVEL, BROOM, SHOVEL AND BROOM, NO SHOVEL OR BROOM")
              }
                break;
            case OrderState.DUSTBIN:
              if (sInput.toLowerCase() == "dustbin" || sInput.toLowerCase() == "recycling container" || sInput.toLowerCase() == "dustbin and recycling container" || sInput.toLowerCase() == "no dustbin or recycling container"){
                this.stateCur = OrderState.LIGHTBULB
                this.s2 = sInput;
                switch(sInput.toLowerCase()){
                  case "dustbin":
                    this.sTotal = this.sTotal + 1;
                    break;
                  case "recycling container":
                    this.sTotal = this.sTotal + 2;
                    break;
                  case "dustbin and recycling container":
                    this.sTotal = this.sTotal + 3;
                    break;
                  case "no dustbin or recycling container":
                    this.sTotal = this.sTotal + 4;
                    break;
                }
                aReturn.push("Light bulbs, household cleaners?");
              } else {
                aReturn.push("options are DUSTBIN, RECYCLING CONTAINER, DUSTBIN AND RECYCLING CONTAINER, NO DUSTBIN OR RECYCLING CONTAINER")
              }
                break;
            case OrderState.LIGHTBULB:
                if (sInput.toLowerCase() == "light bulbs" || sInput.toLowerCase() == "household cleaners" || sInput.toLowerCase() == "light bulbs and household cleaners" || sInput.toLowerCase() == "no light bulbs or household cleaners"){
                    this.stateCur = OrderState.FURNACEFILTER
                    this.s3 = sInput;
                    switch(sInput.toLowerCase()){
                        case "light bulbs":
                            this.sTotal = this.sTotal + 6;
                            break;
                        case "household cleaners":
                            this.sTotal = this.sTotal + 8;
                            break;
                        case "light bulbs and household cleaners":
                            this.sTotal = this.sTotal + 14;
                            break;
                        case "no light bulbs or household cleaners":
                            this.sTotal = this.sTotal + 0;
                            break;
                    }
                    aReturn.push("Furnace filters, cat screens?")
                } else {
                    aReturn.push("options are LIGHT BULBS, HOUSEHOLD CLEANERS, LIGHT BULBS AND HOUSEHOLD CLEANERS, NO LIGHTBULBS OR HOUSEHOLD CLEANERS")
                }
                break;
            case OrderState.FURNACEFILTER:
                if (sInput.toLowerCase() == "furnace filters" || sInput.toLowerCase() == "cat screens" || sInput.toLowerCase() == "3furnace filters and cat screens" || sInput.toLowerCase() == "no furnace filters or cat screens"){
                    this.stateCur = OrderState.UPSELL
                    this.s4 = sInput;
                    switch(sInput.toLowerCase()){
                        case "furnace filters":
                            this.sTotal = this.sTotal + 3;
                            break;
                        case "household cleaners":
                            this.sTotal = this.sTotal + 3;
                            break;
                        case "light bulbs and household cleaners":
                            this.sTotal = this.sTotal + 6;
                            break;
                        case "no light bulbs or household cleaners":
                            this.sTotal = this.sTotal + 0;
                            break;
                    }
                    aReturn.push("Would you like ear buds with that?")
                } else {
                    aReturn.push("options are FURNACE FILTERS, CAT SCREENS, FURNACE FILTERS AND CAT SCREENS, NO FURNACE FILTERS OR CAT SCREENS")
                }
                break;
            case OrderState.UPSELL:
                this.stateCur = OrderState.PAYMENT;
                this.nOrder = this.sTotal;
                if(sInput.toLowerCase() != "no"){
                    this.s5 = "ear buds";
                    this.sTotal = this.sTotal + 5;
                }
                aReturn.push("Thank-you for your order of");
                aReturn.push(`${this.s1}, ${this.s2}, ${this.s3}, ${this.s4}`);
                if(this.s5){
                    aReturn.push(`plus ${this.s5}`);
                }
                aReturn.push(`Your total comes to ${this.sTotal * this.sTax}`);
                aReturn.push(`We will text you from 519-111-1111 when your order is ready for curbside pickup or if we have questions.`)
                this.isDone(true);
                break;
            case OrderState.PAYMENT:
                console.log(sInput);

        }
        return aReturn;
    }
    renderForm(){
      // your client id should be kept private
      const sClientID = process.env.SB_CLIENT_ID || 'put your client id here for testing ... Make sure that you delete it before committing'
      return(`
      <!DOCTYPE html>

<head>
    <meta content="text/html; charset=UTF-8" http-equiv="content-type">
    <style type="text/css">
        ol {
            margin: 0;
            padding: 0
        }

        table td,
        table th {
            padding: 0
        }

        .c2 {
            border-right-style: solid;
            padding: 1pt 1pt 1pt 1pt;
            border-bottom-color: #000000;
            border-top-width: 1pt;
            border-right-width: 1pt;
            border-left-color: #000000;
            vertical-align: top;
            border-right-color: #000000;
            border-left-width: 1pt;
            border-top-style: solid;
            background-color: #ffffff;
            border-left-style: solid;
            border-bottom-width: 1pt;
            width: 233.2pt;
            border-top-color: #000000;
            border-bottom-style: solid
        }

        .c3 {
            border-right-style: solid;
            padding: 1pt 1pt 1pt 1pt;
            border-bottom-color: #000000;
            border-top-width: 1pt;
            border-right-width: 1pt;
            border-left-color: #000000;
            vertical-align: top;
            border-right-color: #000000;
            border-left-width: 1pt;
            border-top-style: solid;
            background-color: #ffffff;
            border-left-style: solid;
            border-bottom-width: 1pt;
            width: 234pt;
            border-top-color: #000000;
            border-bottom-style: solid
        }

        .c8 {
            padding-top: 0pt;
            padding-bottom: 0pt;
            line-height: 1.15;
            orphans: 2;
            widows: 2;
            text-align: left;
            height: 11pt
        }

        .c1 {
            color: #000000;
            font-weight: 400;
            text-decoration: none;
            vertical-align: baseline;
            font-size: 20pt;
            font-family: "Arial";
            font-style: normal
        }

        .c0 {
            margin-left: 5pt;
            padding-top: 0pt;
            padding-bottom: 12pt;
            line-height: 1.15;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        .c7 {
            color: #000000;
            font-weight: 400;
            text-decoration: none;
            vertical-align: baseline;
            font-family: "Arial";
            font-style: normal
        }

        .c6 {
            padding-top: 0pt;
            padding-bottom: 12pt;
            line-height: 1.15;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        .c12 {
            border-spacing: 0;
            border-collapse: collapse;
            margin-right: auto
        }

        .c11 {
            background-color: #ffffff;
            max-width: 468pt;
            padding: 72pt 72pt 72pt 72pt
        }

        .c5 {
            font-size: 34.5pt
        }

        .c10 {
            font-size: 11pt
        }

        .c9 {
            font-size: 48pt
        }

        .c4 {
            height: 38.2pt
        }

        .title {
            padding-top: 0pt;
            color: #000000;
            font-size: 26pt;
            padding-bottom: 3pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        .subtitle {
            padding-top: 0pt;
            color: #666666;
            font-size: 15pt;
            padding-bottom: 16pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        li {
            color: #000000;
            font-size: 11pt;
            font-family: "Arial"
        }

        p {
            margin: 0;
            color: #000000;
            font-size: 11pt;
            font-family: "Arial"
        }

        h1 {
            padding-top: 20pt;
            color: #000000;
            font-size: 20pt;
            padding-bottom: 6pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h2 {
            padding-top: 18pt;
            color: #000000;
            font-size: 16pt;
            padding-bottom: 6pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h3 {
            padding-top: 16pt;
            color: #434343;
            font-size: 14pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h4 {
            padding-top: 14pt;
            color: #666666;
            font-size: 12pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h5 {
            padding-top: 12pt;
            color: #666666;
            font-size: 11pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            orphans: 2;
            widows: 2;
            text-align: left
        }

        h6 {
            padding-top: 12pt;
            color: #666666;
            font-size: 11pt;
            padding-bottom: 4pt;
            font-family: "Arial";
            line-height: 1.15;
            page-break-after: avoid;
            font-style: italic;
            orphans: 2;
            widows: 2;
            text-align: left
        }
    </style>
</head>

<body class="c11">
    <p class="c6"><span class="c7 c5">Prabh&rsquo;s Hardware</span></p>
    <p class="c6"><span class="c7 c5">For curbside pickup:</span></p>
    <p class="c6"><span class="c5">Text &ldquo;hi&rdquo; to </span><span class="c7 c9">519-111-1111 </span></p><a
        id="t.5b905644d30969e1ffaaa5240155f96d637e4b10"></a><a id="t.0"></a>
    <table class="c12">
        <tbody>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Shovel</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$5</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Broom</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$4</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Dustbin</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$1</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Recycling Containers</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$2</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Light Bulbs</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$6</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Household Cleaners</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$8</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Furnace Filters</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$3</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Cat Screens</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$3</span></p>
                </td>
            </tr>
            <tr class="c4">
                <td class="c3" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">Ear buds</span></p>
                </td>
                <td class="c2" colspan="1" rowspan="1">
                    <p class="c0"><span class="c1">$5</span></p>
                </td>
            </tr>
        </tbody>
    </table>
    <p class="c6"><span class="c7 c10">&nbsp;</span></p>
    <p class="c6"><span class="c5 c7">Visit our Store for more options.</span></p>
    <p class="c8"><span class="c7 c10"></span></p>
</body>

</html>
          
      `);
  
    }
}