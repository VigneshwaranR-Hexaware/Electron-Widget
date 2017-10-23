'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['messageTemplates', 'uuid'], function (messageTpl, uuidv1) {

    class CardDesign {

        constructor(card, responseType) {
            this.data = card;
            this.responseType = responseType;
        }

        getHTML() {
            //Return Plain Text Response Type Payload
            if (this.responseType == "plaintext") {
                console.log(this.data);
                return messageTpl.plaintext(this.data);
            }
            //Return Card Response Type Payload
            if (this.responseType == "card") {
                console.log(JSON.stringify(this.data));
                return messageTpl.card(this.data);
            }
            //Return Carousel Response Type Payload
            if (this.responseType == "carousel") {
                return messageTpl.carousel(this.data, uuidv1());
            }
            //Return Quick replies Response Type Payload
            if (this.responseType == "quickreplies") {
                return messageTpl.quickreplies(this.data);
            }

            // airlines intergration of Airline boarding pass template
            if (this.responseType == "airlineBoarding") {
                return messageTpl.airlineBoarding(this.data);
            }
            // airlines intergration of Airline boarding pass with view bar code template
            if (this.responseType == "ViewBoardingPassBarCode") {
                return messageTpl.ViewBoardingPassBarCode(this.data);
            }
            // airlines intergration of Airline Checkin template
            if (this.responseType == "airlineCheckin") {
                return messageTpl.airlineCheckin(this.data);
            }
            // airlines intergration of Airline Flight Update template
            if (this.responseType == "airlineFlightUpdate") {
                return messageTpl.airlineFlightUpdate(this.data);
            }
            //Return Video Response Type Payload
            if (this.responseType == "video") {
                console.log(this.data);
                return messageTpl.video(this.data);
            }
            //Return Audio Response Type Payload
            if (this.responseType == "audio") {
                console.log(this.data);
                return messageTpl.audio(this.data);
            }
            //Return File Response Type Payload
            if (this.responseType == "file") {
                console.log(this.data);
                return messageTpl.file(this.data);
            }
            //Return Receipt Response Type Payload
            if (this.responseType == "receipt") {
                console.log(this.data);
                return messageTpl.receipt(this.data);
            }
            //Return Receipt Response Type Payload
            if (this.responseType == "list") {
                return messageTpl.list(this.data);
            }
            // Generic Templates Response Type Payload

            if (this.responseType == "generic") {
                //console.log(JSON.stringify(this.data));
                return messageTpl.generic(this.data);
            }
            if (this.responseType == "buybutton") {
                return messageTpl.buybutton(this.data);
            }
            if(this.responseType == "logout"){
                console.log(this.data);
                return messageTpl.logout(this.data);
            }
            if(this.responseType == "login"){
                console.log(this.data);
                return messageTpl.login(this.data);
            }
        }
    }

    return function (card, responseType) {
        return new CardDesign(card, responseType).getHTML();
    }
});