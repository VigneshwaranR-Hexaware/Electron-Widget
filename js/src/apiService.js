'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(['jquery', 'settings', 'utils', 'messageTemplates', 'cards', 'uuid'],
    function ($, config, utils, messageTpl, cards, uuidv1) {

        class ApiHandler {

            constructor() {
                this.options = {
                    sessionId: uuidv1(),
                    lang: "en"
                };
            }

            userSays(userInput, callback) {
                console.log(callback);
                callback(null, messageTpl.userplaintext({
                    "payload": userInput,
                    "senderName": config.userTitle,
                    "senderAvatar": config.userAvatar,
                    "time": utils.currentTime(),
                    "className": 'pull-right'
                }));
            }
            askBot(userInput, userText, callback) {
                this.userSays(userText, callback);

                this.options.query = userInput;

                $.ajax({
                    type: "POST",
                    url: config.chatServerURL + "query?v=20150910",
                    contentType: "application/json; charset=utf-8",
                    dataType: "json",
                    headers: {
                        "Authorization": "Bearer " + config.accessToken
                    },
                    data: JSON.stringify(this.options),
                    success: function (response) {
                        let isCardorCarousel = false;
                        let isImage = false;
                        let isQuickReply = false;
                        let isQuickReplyFromApiai = false;
                        //Media attachment
                        let isVideo = false;
                        let videoUrl = null;
                        let isAudio = false;
                        let audioUrl = null;
                        let isFile = false;
                        let fileUrl = null;
                        let isReceipt = false;
                        let receiptData = null;
                        let isList = false;
                        let imageUrl;
                        // airline onboarding
                        let isAirlineBoardingPass = false;
                        let isViewBoardingPassBarCode = false;
                        let isAirlineCheckin = false;
                        let isAirlingFlightUpdate = false;
                        //Generic Template
                        let genericTemplate = false;
                        let genericElement = null;
                        let genericBuy = false;
                        let genericCheckout = null;
                        //To find Card || Carousel
                        let count = 0;
                        let hasbutton;
                        //login and logout template
                        let isLogOut=false;
                        let logoutData=null;
                        let login=null;
                        let isLogIn=false;
                        console.log(response);
                        if (response.result.fulfillment.messages) {
                            // console.log("for airline service"+ response);
                            for (let i in response.result.fulfillment.messages) {
                                if (response.result.fulfillment.messages[i].type == 0 && response.result.fulfillment.messages[i].speech !="") {

                                    let cardHTML = cards({
                                        "payload": response.result.fulfillment.messages[i].speech,
                                        "senderName": config.botTitle,
                                        "senderAvatar": config.botAvatar,
                                        "time": utils.currentTime(),
                                        "className": ''
                                    }, "plaintext");
                                    callback(null, cardHTML);
                                }
                                if (response.result.fulfillment.messages[i].type == 1) {
                                    count = count + 1;
                                    hasbutton = (response.result.fulfillment.messages[i].buttons.length > 0) ? true : false;
                                    isCardorCarousel = true;
                                }
                                if (response.result.fulfillment.messages[i].type == 2) {
                                    isQuickReplyFromApiai = true;
                                }
                                if (response.result.fulfillment.messages[i].type == 3) {
                                    isImage = true;
                                }
                                let msgfulfill = response.result.fulfillment.messages[i];

                                if (msgfulfill.type == 4 && msgfulfill.hasOwnProperty("payload") && msgfulfill.payload.hasOwnProperty("facebook")) {
                                    //Quick Replies
                                    if (msgfulfill.payload.facebook.hasOwnProperty("quick_replies")) {
                                        isQuickReply = (msgfulfill.payload.facebook.quick_replies.length > 0) ? true : false;
                                        console.log(isQuickReply);
                                    }
                                    if (msgfulfill.payload.facebook.hasOwnProperty("attachment") && msgfulfill.payload.facebook.attachment.hasOwnProperty("payload")) {
                                        //video attachment
                                        if (msgfulfill.payload.facebook.attachment.type == "video") {
                                            isVideo = true;
                                            videoUrl = msgfulfill.payload.facebook.attachment.payload.url;
                                        }

                                        if (msgfulfill.payload.facebook.attachment.type == "audio") {
                                            isAudio = true;
                                            audioUrl = msgfulfill.payload.facebook.attachment.payload.url;
                                        }
                                        //file attachment
                                        isFile = (msgfulfill.payload.facebook.attachment.type == "file") ? true : false;
                                        fileUrl = msgfulfill.payload.facebook.attachment.payload.url;
                                        //receipt template
                                        isReceipt = (msgfulfill.payload.facebook.attachment.payload.template_type == "receipt") ? true : false;
                                        receiptData = msgfulfill.payload.facebook.attachment.payload;
                                        //list template
                                        if (msgfulfill.payload.facebook.attachment.payload.template_type == "list") {
                                            isList = (msgfulfill.payload.facebook.attachment.payload.elements.length > 0) ? true : false;

                                        }
                                        //Airline Boarding Pass
                                        if ((msgfulfill.payload.facebook.attachment.payload.template_type === 'airline_boardingpass')) {
                                            isAirlineBoardingPass = (msgfulfill.payload.facebook.attachment.payload.boarding_pass.length > 0) ? true : false;

                                        }
                                        // View boarding Pass with barcode
                                        if ((response.result.metadata.intentName === 'AirLineWith_Barcode')) {
                                            isViewBoardingPassBarCode = (msgfulfill.payload.facebook.attachment.payload.boarding_pass.length > 0) ? true : false;
                                        }
                                        //Airline checkin template
                                        if ((msgfulfill.payload.facebook.attachment.payload.template_type === 'airline_checkin')) {
                                            isAirlineCheckin = (msgfulfill.payload.facebook.attachment.payload.flight_info.length > 0) ? true : false;
                                        }
                                        //Airline flight update template
                                        if ((msgfulfill.payload.facebook.attachment.payload.template_type === 'airline_update')) {
                                            // isAirlingFlightUpdate = response.result.fulfillment.messages[i].payload.facebook.attachment.payload.message.attachment.payload.update_flight_info;
                                            isAirlingFlightUpdate = true;

                                        }
                                        //Generic template
                                        if (response.result.metadata.intentName != 'Buy') {
                                            if (msgfulfill.payload.facebook.attachment.payload.template_type == 'generic') {
                                                genericTemplate = true;
                                                genericElement = msgfulfill.payload.facebook.attachment.payload.elements;
                                            }
                                        }
                                        else if (response.result.metadata.intentName == 'Buy') {
                                            genericCheckout = msgfulfill.payload.facebook.attachment.payload.elements;
                                            genericBuy = true;
                                        }
                                        //logout template
                                        if(response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type=='logout'){
                                            isLogOut=true;
                                        logoutData=response.result.fulfillment.messages[i].payload.facebook.attachment.payload;
                                        console.log(isLogOut);
                                        }
            
                                        //login template
                                        if(response.result.fulfillment.messages[i].payload.facebook.attachment.payload.template_type=='login'){
                                        login=response.result.fulfillment.messages[i].payload.facebook.attachment.payload.elements;
                                            isLogIn=true;
                
                                         }

                                    }

                                }


                            }
                        } else {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.speech,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "plaintext");
                            callback(null, cardHTML);
                        }
                        //Carousel
                        if (isCardorCarousel) {
                            if (count == 1) {
                                let cardHTML = cards({
                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "buttons": hasbutton,
                                    "className": ''
                                }, "card");
                                callback(null, cardHTML);
                            } else {
                                let carouselHTML = cards({

                                    "payload": response.result.fulfillment.messages,
                                    "senderName": config.botTitle,
                                    "senderAvatar": config.botAvatar,
                                    "time": utils.currentTime(),
                                    "buttons": hasbutton,
                                    "className": ''

                                }, "carousel");
                                callback(null, carouselHTML);
                            }
                        }
                        //Image Response
                        if (isImage) {
                            let cardHTML = cards(response.result.fulfillment.messages, "image");
                            callback(null, cardHTML);
                        }
                        //CustomPayload Quickreplies
                        if (isQuickReply) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "quickreplies");
                            callback(null, cardHTML);
                        }
                        //Apiai Quickreply
                        if (isQuickReplyFromApiai) {
                            let cardHTML = cards(response.result.fulfillment.messages, "quickreplyfromapiai");
                            callback(null, cardHTML);
                        }
                        //Video Attachment Payload callback
                        if (isVideo) {
                            let cardHTML = cards({
                                "payload": videoUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "video");
                            callback(null, cardHTML);
                        }
                        //Audio Attachment Payload callback
                        if (isAudio) {
                            let cardHTML = cards({
                                "payload": audioUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "audio");
                            callback(null, cardHTML);
                        }
                        //File Attachment Payload callback
                        if (isFile) {
                            let cardHTML = cards({
                                "payload": fileUrl,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "file");
                            callback(null, cardHTML);
                        }
                        // Receipt Attachment Payload callback
                        if (isReceipt) {
                            let cardHTML = cards({
                                "payload": receiptData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "receipt");
                            callback(null, cardHTML);
                        }
                        // airline Boarding Pass
                        if (isAirlineBoardingPass) {
                            let boardingPassHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineBoarding");
                            callback(null, boardingPassHTML);
                        }
                        // -----------------------------------

                        // airline Boarding Pass View bar code
                        if (isViewBoardingPassBarCode) {
                            let ViewBoardingPassBarCodeHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "ViewBoardingPassBarCode");
                            callback(null, ViewBoardingPassBarCodeHTML);
                        }
                        // airline Checkin
                        if (isAirlineCheckin) {
                            let CheckinHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineCheckin");
                            callback(null, CheckinHTML);
                        }

                        // airline flight update
                        if (isAirlingFlightUpdate) {
                            let CheckinHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "buttons": hasbutton,
                                "className": ''
                            }, "airlineFlightUpdate");
                            callback(null, CheckinHTML);
                        }

                        // generic template
                        if (genericTemplate) {
                            let cardHTML = cards({
                                "payload": genericElement,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "generic");
                            callback(null, cardHTML);
                        }
                        // List template
                        if (isList) {
                            let cardHTML = cards({
                                "payload": response.result.fulfillment.messages,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "list");
                            callback(null, cardHTML);
                        }
                        // Buy
                        if (genericBuy) {
                            let cardHTML = cards({
                                "payload": genericCheckout,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": ''
                            }, "buybutton");
                            callback(null, cardHTML);

                        }
                        //logout template
                        if (isLogOut) {
                            console.log("ISWEB logout:::"+$('#webchat').context.URL);
                            let cardHTML = cards({
                                "payload": logoutData,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": '',
                                "isWeb":$('#webchat').context.URL
                            }, "logout");
                            callback(null, cardHTML);
                        }
                        //login template
                        if (isLogIn) {
                            console.log("ISWEB:::"+$('#webchat').context.URL);
                            let cardHTML = cards({
                                "payload": login,
                                "senderName": config.botTitle,
                                "senderAvatar": config.botAvatar,
                                "time": utils.currentTime(),
                                "className": '',
                                "isWeb":$('#webchat').context.URL
                            }, "login");
                            callback(null, cardHTML);
                        }

                    },
                    error: function () {
                        callback("Internal Server Error", null);
                    }
                });
            }
        }

        return function (accessToken) {
            return new ApiHandler();
        }
    });
