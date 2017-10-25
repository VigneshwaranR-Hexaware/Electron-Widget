'use strict';

/* -------------------------------------------------------------------
Copyright (c) 2017-2017 Hexaware Technologies
This file is part of the Innovation LAB - Offline Bot.
------------------------------------------------------------------- */


define(["utils"], function (utils) {

    var methods = {};

//     <a href="javascript:void(0);" class="avatar-list-img">
//     <img class="img-responsive" src="${data.senderAvatar}">
//     </a>
// </div>
//
    //User Plain Text
    methods.userplaintext = (data) => {

        let html = `<li class="list-group-item background-color-custom">
            <div class="media-left pull-right">

            <div class="media-body user-txt-space">

                <div class="list-group-item-text-user"><p>${data.payload}</p></div>

            </div>
        </li>
          <p class="user-timestamp"><small>${data.time}</small></p>`;

        return html;
    }

    // <div class="media-left">
    //     <a href="javascript:void(0);" class="avatar-list-img">
    //     <img class="img-responsive" src="${data.senderAvatar}">
    //     </a>
    // </div>

    //Plain Text Template
    methods.plaintext = (data) => {
        let html = `<li class="list-group-item background-color-custom">

            <div class="media-body bot-txt-space">

                <div class="list-group-item-text-bot"><p>${data.payload}</p></div>

            </div>
        </li>
        <p class="bot-res-timestamp"><small>${data.time}</small></p>`;

        return html;
    }
    //Card Template
    //
    // <div class="media-left">
    //     <a class="avatar-list-img" href="javascript:void(0);">
    //         <img src="${data.senderAvatar}" class="img-responsive">
    //     </a>
    // </div>

    // <div class="media-body media-middle">
    //     <h3 class="pmd-card-title-text">${data.senderName}</h3>
    // </div>
    methods.card = (data) => {
        let html;
        let cardButtons = "";
        let cardBody;
        for (let i in data.payload) {
            cardBody = `<li class="list-group-item background-color-custom">
            <div class="pmd-card pmd-card-default pmd-z-depth custom-infocard">
                <!-- Card header -->
                <div class="pmd-card-title">


                </div>`

            if (data.payload[i].imageUrl != "" && data.payload[i].imageUrl != undefined) {
                cardBody += ` <div class="pmd-card-media">
                    <img src="${data.payload[i].imageUrl}" width="1184" height="666" class="img-responsive">
                    </div>`
            }

            cardBody += `<div class="pmd-card-title">
                <h3 class="card-body"><p class="card-title">${data.payload[i].title}</p>
                <p class="card-subtitle">${data.payload[i].subtitle}</p>
                </div>`

            if (data.buttons && data.payload[i].type == 1) {
                console.log("Buttons" + data);
                cardButtons = `<div class="pmd-card-actions">`
                for (var j = 0; j < data.payload[i].buttons.length; j++) {
                    cardButtons += ` <button type="button" class="btn btn-primary cardresponsepayload" data-cardpayloadButton = "${data.payload[i].buttons[j].postback}" >${data.payload[i].buttons[j].text}</button>`
                }
                cardButtons += `</div>`
            }
            html = cardBody + cardButtons + `</div></div><p class="bot-res-timestamp-card"><small>${data.time}</small></p></div></li>`;
        }
        return html;
    }
    // List template
    methods.list = (data) => {

        let html = '';

        let listBody = '';
        for (let i in data.payload) {
            if (data.payload[i].hasOwnProperty("platform") && data.payload[i].platform == "facebook" && data.payload[i].payload.facebook.hasOwnProperty("attachment") && data.payload[i].payload.facebook.attachment.payload.template_type == "list") {
                listBody += `<ul class="list-group pmd-z-depth pmd-list pmd-card-list">`;

                for (let j = 0; j < data.payload[i].payload.facebook.attachment.payload.elements.length; j++) {

                    listBody += `<li class="list-group-item">

        <a href="#"  class="listresponsepayload"  data = "${data.payload[i].payload.facebook.attachment.payload.elements[j].hasOwnProperty('buttons') ? data.payload[i].payload.facebook.attachment.payload.elements[j].buttons[0].payload : ''}" style="display:block;">
        <div class="media-body">
        <div class="col-xs-9">
            <h3 class="list-group-item-heading">${data.payload[i].payload.facebook.attachment.payload.elements[j].title}</h3>
            <span class="list-group-item-text">${data.payload[i].payload.facebook.attachment.payload.elements[j].subtitle}</span>
            </div>
            <div class="col-xs-3">
            <img src="${data.payload[i].payload.facebook.attachment.payload.elements[j].image_url}" width="100" height="100" class="img-responsive">
            </div>
         </div>
         </a>

    </li>`;
                }
                html += `<p class="bot-timestamp pull-left" style="padding:10px 5px;"><small>sent at ${data.time}</small></p></ul>`;
            }
        }
        return listBody + html;
    }
    // end of list


    // <div class="media-left">
    //     <a href="javascript:void(0);" class="avatar-list-img">
    //     <img class="img-responsive" src="${data.senderAvatar}">
    //     </a>
    // </div>
    //Quick Replies Template
    //
    methods.quickreplies = (data) => {
        var quickRepliesHtml = `<li class="list-group-item background-color-custom">

        <div class="media-body">`;

        for (let i in data.payload) {


            if (data.payload[i].platform == "facebook") {
                if (data.payload[i].payload.facebook.hasOwnProperty('quick_replies')) {
                    quickRepliesHtml += `<p class="list-group-item-quick-reply-space">${data.payload[i].payload.facebook.text}</p><div class="quick-replies-buttons">`;
                    for (var j = 0; j < data.payload[i].payload.facebook.quick_replies.length; j++) {
                        quickRepliesHtml += `<button type="button"  class="btn pmd-btn-outline pmd-ripple-effect btn-info QuickreplybtnPayload" data-quickRepliesPayload="${data.payload[i].payload.facebook.quick_replies[j].payload
                            }">${data.payload[i].payload.facebook.quick_replies[j].title}</button>`
                    }
                }
            }
        }
        quickRepliesHtml += `</div><p class="bot-res-timestamp-qr"><small>${data.time}</small></p></div></li>`
        return quickRepliesHtml;
    }

    methods.carousel = (data, uniqueId) => {
        var carousel = `<li class="list-group-item background-color-custom">
        <div id="${uniqueId}" class="carousel slide pmd-card pmd-card-default pmd-z-depth carousel-custom" data-ride="false">
        <!-- Carousel items -->
            <div class="carousel-inner">`;
        var index = 0;
        for (let i in data.payload) {

            if (data.payload[i].type == 1) {
                carousel += `<div class="item ${(index == 0) ? 'active' : ''}">
                    <div class="row">
                        <div class="col-md-3">
                            <a href="#" class="thumbnail custom-image-wrap">
                                <img class="img-circle" src="${data.payload[i].imageUrl}" alt="Image" style="max-width:100%;">
                            </a>
                            <h3 class="carousel-body"><p class="carousel-title">${data.payload[i].title}</p>
                            <p class="carousel-subtitle">${data.payload[i].subtitle}</p>`
                if (data.buttons && data.payload[i].type == 1) {
                    for (var j = 0; j < data.payload[i].buttons.length; j++) {
                        carousel += `<button type="button" class="btn-carousel btn-primary pmd-btn-outline caroselresponsepayload button-custom" data-carouselpayloadButton = "${data.payload[i].buttons[j].postback}" >${data.payload[i].buttons[j].text}</button>`
                    }
                }
                carousel += `</div>
                    </div><!--.row-->
                </div> <!--.item-->`;
                index = 1;
            }
        }

        carousel += ` </div><!--.carousel-inner-->
		<a data-slide="prev" href="#${uniqueId}" class="left carousel-control">‹</a>
		<a data-slide="next" href="#${uniqueId}" class="right carousel-control">›</a>
	  </div><!--.Carousel--></div><p class="bot-res-timestamp-card"><small>${data.time}</small></p></div></li>`;

        return carousel;
    }

    // airline Boarding pass
    methods.airlineBoarding = (data) => {
        let html;
        let cardButtons = "";
        for (let i in data.payload) {
            if (data.payload[i].hasOwnProperty("platform") && data.payload[i].platform == "facebook" && data.payload[i].payload.facebook.hasOwnProperty("attachment") && data.payload[i].payload.facebook.attachment.payload.template_type == "airline_boardingpass") {
                for (let j in data.payload[i].payload.facebook.attachment.payload.boarding_pass) {
                    let params = data.payload[i].payload.facebook.attachment.payload.boarding_pass[j];
                    let termialLabel = params.auxiliary_fields[0].label;
                    let termialValue = params.auxiliary_fields[0].value;
                    let gateLabel = params.secondary_fields[1].label;
                    let gateValue = params.secondary_fields[1].value;
                    let passengersName = params.passenger_name;
                    let passengersSeatLabel = params.secondary_fields[2].label;
                    let passengersSeatValue = params.secondary_fields[2].value;
                    let flightNumber = params.flight_info.flight_number;
                    let boardingValue = params.secondary_fields[0].value;
                    let departsValue = params.flight_info.flight_schedule.departure_time;
                    let departCity = params.flight_info.departure_airport.city;
                    let departCode = params.flight_info.departure_airport.airport_code;
                    let arrivalCity = params.flight_info.arrival_airport.city;
                    let arrivalCode = params.flight_info.arrival_airport.airport_code;

                    let arrName = passengersName.replace('/', ' ');
                    let departTime = utils.airlineTime(departsValue);
                    let boardingTime = utils.airlineTimeboarding(boardingValue);





                    // 2015-12-26T11:30
                    html = `<div class="pmd-card pmd-card-inverseblue pmd-z-depth">
    <!-- Card header -->
    <div class="container">
        <div class="row airlinePadding">
            <div class="col-xs-6">
                <a href="javascript:void(0);" class="avatar-list-img">
            <img width="40" height="40" src="https://previews.123rf.com/images/sn333g/sn333g1504/sn333g150400033/39063712-Avi-n-icono-de-vuelo-o-avi-n-logo-despegue-vector-s-mbolo-azul-Foto-de-archivo.jpg">
        </a>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${termialLabel}</h3>
                <span class="pmd-card-subtitle-text">${termialValue}</span>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${gateLabel}</h3>
                <span class="pmd-card-subtitle-text">${gateValue}</span>
            </div>
        </div>
        <hr style="margin:0px">
        <div class="row airlinePadding">
            <div class="col-xs-9">
                <h3 class="pmd-card-title-text">Passenger</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${passengersSeatLabel}</h3>
            </div>
        </div>
        <div class="row">
            <div class="col-xs-9">
                <span class="pmd-card-subtitle-text">${arrName}</span>
            </div>
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${passengersSeatValue}</span>
            </div>
        </div>
        <hr style="margin:0px">
        <div class="row airlinePadding ">
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Flight</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Boards</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Departs</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${flightNumber}</span>
            </div>
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${boardingTime}</span>
            </div>
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${departTime}</span>
            </div>
        </div>
          <div class="row airlinePadding">
            <div class="col-xs-9">
                <h3 class="pmd-card-title-text">${arrivalCity}</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${departCity}</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-5">
                <h2 class="pmd-display2" style="margin:0">${arrivalCode}</h2>
            </div>
            <div class="col-xs-4">
                <i class="material-icons pmd-lg">flight</i>
            </div>
            <div class="col-xs-3">
                <h2 class="pmd-display2" style="margin:0">${departCode}</h2>
            </div>
        </div>
    </div>
<div class="pmd-card-actions col-xs-12" style="text-align:center">
            <button class="btn pmd-btn-flat pmd-ripple-effect btn-primary airlineBoardingViewButton" type="button">View Boarding Pass</button>
        </div>
</div>`;
                }
            }
        }
        return html;
    }

    // airline Boarding pass view with bar code
    methods.ViewBoardingPassBarCode = (data) => {
        let html;
        let cardButtons = "";
        for (let i in data.payload) {
            if (data.payload[i].hasOwnProperty("platform") && data.payload[i].platform == "facebook" && data.payload[i].payload.facebook.hasOwnProperty("attachment") && data.payload[i].payload.facebook.attachment.payload.template_type == "airline_boardingpass") {
                for (let j in data.payload[i].payload.facebook.attachment.payload.boarding_pass) {
                    let params = data.payload[i].payload.facebook.attachment.payload.boarding_pass[j];
                    let termialLabel = params.auxiliary_fields[0].label;
                    let termialValue = params.auxiliary_fields[0].value;
                    let gateLabel = params.secondary_fields[1].label;
                    let gateValue = params.secondary_fields[1].value;
                    let passengersName = params.passenger_name;
                    let logoUrl = params.logo_image_url;
                    let barcodeUrl = params.above_bar_code_image_url;
                    let passengersSeatLabel = params.secondary_fields[2].label;
                    let passengersSeatValue = params.secondary_fields[2].value;
                    let flightNumber = params.flight_info.flight_number;
                    let boardingValue = params.secondary_fields[0].value;
                    let departsValue = params.flight_info.flight_schedule.departure_time;
                    let departCity = params.flight_info.departure_airport.city;
                    let departCode = params.flight_info.departure_airport.airport_code;
                    let arrivalCity = params.flight_info.arrival_airport.city;
                    let arrivalCode = params.flight_info.arrival_airport.airport_code;
                    let secValue = params.secondary_fields[3].value;
                    console.log(secValue);
                    let departTime = utils.airlineTime(departsValue);
                    let boardingTime = utils.airlineTimeboarding(boardingValue);
                    let arrName = passengersName.replace('/', ' ');

                    html = `<div class="pmd-card pmd-card-inverseblue pmd-z-depth">
    <!-- Card header -->
    <div class="container">
        <div class="row airlinePadding">
            <div class="col-xs-9">
                <a href="javascript:void(0);" class="avatar-list-img">
            <img width="40" height="40" src="${logoUrl}">
        </a>
            </div>
            <div class="col-xs-3">
               <span class="label label-info">Priority <br/> Boarding</span>
            </div>
        </div>
        <div class="row airlinePadding">
            <div class="col-xs-9">
                <h3 class="pmd-card-title-text">Passenger</h3>
            </div>
             <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Departure</h3>

            </div>

        </div>
        <div class="row">
            <div class="col-xs-9">
                <span class="pmd-card-subtitle-text">${arrName}</span>
            </div>
             <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${departTime}</span>
            </div>

        </div>
        <hr style="margin:0px">
        <div class="row airlinePadding">
            <div class="col-xs-9">
                <h3 class="pmd-card-title-text">${arrivalCity}</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${departCity}</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-5">
                <h2 class="pmd-display2" style="margin:0">${arrivalCode}</h2>
            </div>
            <div class="col-xs-4">
                <i class="material-icons pmd-lg">flight</i>
            </div>
            <div class="col-xs-3">
                <h2 class="pmd-display2" style="margin:0">${departCode}</h2>
            </div>
        </div>
        <div class="row airlinePadding ">
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Flight</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${termialLabel}</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Boarding</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">${gateLabel}</h3>
            </div>



        </div>
        <div class="row  ">
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${flightNumber}</span>
            </div>
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${termialValue}</span>

            </div>
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${boardingTime}</span>
            </div>

            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${gateValue}</span>

            </div>

        </div>
        <div class="row airlinePadding ">
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Zone</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Gate Closing</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Seat</h3>
            </div>
            <div class="col-xs-3">
                <h3 class="pmd-card-title-text">Sec</h3>
            </div>



        </div>
        <div class="row  ">
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">2</span>
            </div>
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${boardingTime}</span>
            </div>
          <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${passengersSeatValue}</span>
            </div>
            <div class="col-xs-3">
                <span class="pmd-card-subtitle-text">${secValue}</span>

            </div>

        </div>

        <div class="row">
            <div class="pmd-card-actions col-xs-offset-4">
                <button class="btn  btn-sm pmd-btn-flat button-info " type="button">Gold Status</button>
            </div>
            <div class="pmd-card-media col-xs-offset-4 pmd-card-media airlinePadding">
                <img width="152" height="152"  src=${barcodeUrl}>
            </div>
        </div>


    </div>
    <hr style="margin:0px">
    <div class="pmd-card-actions col-xs-12 " style="text-align:center">
        <button class="btn pmd-btn-flat pmd-ripple-effect btn-primary type=" button ">Share</button>
        <hr style="margin:0px ">
            <button class="btn pmd-btn-flat pmd-ripple-effect btn-primary type="button">Message Airline</button>
        <hr style="margin:0px">
        <button class="btn pmd-btn-flat pmd-ripple-effect btn-primary type=" button ">Add to Passbook</button>
        </div>
</div>`;
                }
            }
        }
        return html;
    }

    // airline Checkin

    methods.airlineCheckin = (data) => {
        let html;
        let cardButtons = "";
        for (let i in data.payload) {
            if (data.payload[i].hasOwnProperty("platform") && data.payload[i].platform == "facebook" && data.payload[i].payload.facebook.hasOwnProperty("attachment") && data.payload[i].payload.facebook.attachment.payload.template_type == "airline_checkin") {
                let params = data.payload[i].payload.facebook.attachment.payload;
                let flightNumber = params.flight_info[0].flight_number;
                let boardingValue = params.flight_info[0].flight_schedule.boarding_time;
                let arrivalValue = params.flight_info[0].flight_schedule.arrival_time;
                let departCity = params.flight_info[0].departure_airport.city;
                let departCode = params.flight_info[0].departure_airport.airport_code;
                let arrivalCity = params.flight_info[0].arrival_airport.city;
                let arrivalCode = params.flight_info[0].arrival_airport.airport_code;
                let pnrNumber = params.pnr_number;

                let arrivalTime = utils.airlineTime(arrivalValue);
                let boardingTime = utils.airlineTimeboarding(boardingValue);


                html = `<div class="pmd-card  pmd-z-depth airlinePadding">
    <!-- Card header -->
    <div class="container panel-heading">
        <div class="row pmd-card-inverseblue airlinePadding">
            <div class="col-xs-7">
                <a href="javascript:void(0);" class="avatar-list-img">
            <img width="40" height="40" src="https://previews.123rf.com/images/sn333g/sn333g1504/sn333g150400033/39063712-Avi-n-icono-de-vuelo-o-avi-n-logo-despegue-vector-s-mbolo-azul-Foto-de-archivo.jpg">
        </a>
            </div>

            <div class="col-xs-5">
                <h3 class="pmd-card-title-text">PNR Number</h3>
                <span class="pmd-card-subtitle-text">${pnrNumber}</span>
            </div>
        </div>
        <hr style="margin:0px">
        <div class="row airlinePadding ">
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Flight</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Boards</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Arrives</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${flightNumber}</span>
            </div>
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${boardingTime}</span>
            </div>
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${arrivalTime}</span>
            </div>
        </div>
          <div class="row airlinePadding">
            <div class="col-xs-8">
                <h3 class="pmd-card-title-text">${departCity}</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">${arrivalCity}</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-5">
                <h2 class="pmd-display2" style="margin:0">${departCode}</h2>
            </div>
            <div class="col-xs-3">
                <i class="material-icons pmd-lg">flight_takeoff</i>
            </div>
            <div class="col-xs-4">
                <h2 class="pmd-display2" style="margin:0">${arrivalCode}</h2>
            </div>
        </div>
    </div>
<div class="pmd-card-actions col-xs-12" style="text-align:center">
            <button class="btn pmd-btn-flat pmd-ripple-effect btn-primary" type="button">Checkin</button>
        </div>
</div>`;
            }
        }
        return html;

    }
    // -------------------------------------------------------------------------------
    // Airline flight update
    methods.airlineFlightUpdate = (data) => {
        let html;
        let cardButtons = "";
        for (let i in data.payload) {
            if (data.payload[i].hasOwnProperty("platform") && data.payload[i].platform == "facebook" && data.payload[i].payload.facebook.hasOwnProperty("attachment") && data.payload[i].payload.facebook.attachment.payload.template_type == "airline_update") {
                let params = data.payload[i].payload.facebook.attachment.payload;
                let flightStatus = params.update_type;
                let flightNumber = params.update_flight_info.flight_number;
                let departValue = params.update_flight_info.flight_schedule.departure_time;
                let arrivalValue = params.update_flight_info.flight_schedule.arrival_time;
                let departCity = params.update_flight_info.departure_airport.city;
                let departCode = params.update_flight_info.departure_airport.airport_code;
                let arrivalCity = params.update_flight_info.arrival_airport.city;
                let arrivalCode = params.update_flight_info.arrival_airport.airport_code;
                let arrivalTime = utils.airlineTime(arrivalValue);
                let departTime = utils.airlineTime(departValue);
                html = `<div class="pmd-card  pmd-z-depth airlinePadding">
    <!-- Card header -->
    <div class="container panel-heading">
        <div class="row pmd-card-inverseblue airlinePadding">
            <div class="col-xs-7">
                <a href="javascript:void(0);" class="avatar-list-img">
            <img width="40" height="40" src="https://previews.123rf.com/images/sn333g/sn333g1504/sn333g150400033/39063712-Avi-n-icono-de-vuelo-o-avi-n-logo-despegue-vector-s-mbolo-azul-Foto-de-archivo.jpg">
        </a>
            </div>

            <div class="col-xs-5">
                <h3 class="pmd-card-title-text">Flight Status</h3>
                <span class="pmd-card-subtitle-text text-color-red">${flightStatus}</span>
            </div>
        </div>
        <hr style="margin:0px">
        <div class="row airlinePadding ">
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Flight</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Departs</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">Arrives</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text">${flightNumber}</span>
            </div>
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text text-color-red">${departTime}</span>
            </div>
            <div class="col-xs-4">
                <span class="pmd-card-subtitle-text text-color-red">${arrivalTime}</span>
            </div>
        </div>
          <div class="row airlinePadding">
            <div class="col-xs-8">
                <h3 class="pmd-card-title-text">${departCity}</h3>
            </div>
            <div class="col-xs-4">
                <h3 class="pmd-card-title-text">${arrivalCity}</h3>
            </div>
        </div>
        <div class="row  ">
            <div class="col-xs-5">
                <h2 class="pmd-display2" style="margin:0">${departCode}</h2>
            </div>
            <div class="col-xs-3">
                <i class="material-icons pmd-lg">flight_takeoff</i>
            </div>
            <div class="col-xs-4">
                <h2 class="pmd-display2" style="margin:0">${arrivalCode}</h2>
            </div>
        </div>
    </div>
</div>`;
            }
        }
        return html;

    }
    // -------------------------------------------------------------------------------
    methods.generic = (data) => {
        let generichtml;
        let genericcardButtons = "";
        let genericcardBody;

        genericcardBody = `<li class="list-group-item ">

         <table class="table table-bordered rounded col-md-8 col-md-pull-3 ">
         <div class="row">
         <div class="col-lg-1 col-centered">
           </div>`
        for (let i in data.payload) {
            if (data.payload[i].image_url != "" && data.payload[i].image_url != undefined) {
                genericcardBody += ` <div class="pmd-card-media float-center">
                    <img src="${data.payload[i].image_url}" width="180" height=120" class="img-responsive center-block">
                    </div>`
            }

            genericcardBody += `<div class="pmd-card-title" style="padding:0px;">
                    <h3 style="text-align:center;">${data.payload[i].title}</h3>
                    <h6  style="text-align:center;">${data.payload[i].subtitle}</h6>
                </div>`
            if (data.payload[i].buttons) {

                genericcardButtons = `<div class="pmd-card-actions centered col-sm-offset-5 col-sm-2 text-center">`
                for (var j = 0; j < data.payload[i].buttons.length; j++) {
                    if (data.payload[i].buttons[j].url != null && data.payload[i].buttons[j].url != undefined) {
                        console.log(data.payload[i].buttons[j]);
                        genericcardButtons += ` <button type="button " style="margin-left:0px;" class="btn btn-sm btn-primary genericTemplateClick" data= "${data.payload[i].buttons[j].url}" >&nbsp;&nbsp;&nbsp;${data.payload[i].buttons[j].title}&nbsp;&nbsp;&nbsp;</button> <br>`
                    }

                    else if (data.payload[i].buttons[j].type != null && data.payload[i].buttons[j].type != undefined && data.payload[i].buttons[j].type != 'element_share' && data.payload[i].buttons[j].type != 'payment') {
                        console.log(data.payload[i].buttons[j].type);
                        genericcardButtons += ` <button type="button " class="btn btn-sm btn-primary genericTemplate" data= "${data.payload[i].buttons[j].type}" >${data.payload[i].buttons[j].title}</button>`
                    }

                    else if (data.payload[i].buttons[j].type == "element_share") {
                        for (var x in data.payload[i].buttons[j].share_contents.attachment.payload.elements) {
                            let shareElement = data.payload[i].buttons[j].share_contents.attachment.payload.elements[x].buttons[0];
                            genericcardButtons += ` <button type="button  " class="btn btn-sm btn-primary genericTemplateClick" data= "${data.payload[i].buttons[j].share_contents.attachment.payload.elements[x].buttons[0].url}" >${data.payload[i].buttons[j].share_contents.attachment.payload.elements[x].buttons[0].title}</button> <br>`
                        }

                    }

                }
                genericcardButtons += `</div>`
            }
            generichtml = genericcardBody + genericcardButtons + `</div>
             </div>
             </div>
             </<table class="table table-bordered">
             </li>`;
        }

        return generichtml;
    }


    // buy botton view ui
    methods.buybutton = (data) => {
        let buyhtml;
        let buyBody;


        buyBody = `<div class="pmd-card  pmd-z-depth">
                   <div class="container rounded">
                   <div class="row">
                   </div>`
        for (let i in data.payload) {
            if (data.payload[i].image_url != "" && data.payload[i].image_url != undefined) {
                buyBody += ` <div class="pmd-card-media center-block">
                    <img src="${data.payload[i].image_url}" width="150" height=90" class="img-responsive center-block">
                    </div>`
            }

            buyBody += `<div class="pmd-card-title ">
                    <h4 class="list-group-item-heading text-center">${data.payload[i].title}</h4>
                    <h6 class="list-group-item-heading text-center">${data.payload[i].subtitle}</h6>
                </div>`

            if (data.payload[i].buttons) {
                for (var j = 0; j < data.payload[i].buttons.length; j++) {
                    console.log(data.payload[i].buttons[j].payment_summary.price_list);
                    for (var x in data.payload[i].buttons[j].payment_summary.price_list) {


                        buyBody += `<div class="row" style="padding:5px 0px"> 
           <div class="col-xs-offset-2 col-xs-5">
          <span>${"$" + data.payload[i].buttons[j].payment_summary.price_list[x].amount}</span>
          </div>
          <div class="col-xs-3"><button type="button"  data-positionY="bottom" class="btn btn-info btn-sm btn-space pull-right" data-toggle="modal" data-target="#Chechkout">${data.payload[i].buttons[j].title}</button> </div>

             <div class="modal fade" id="Chechkout" role="dialog">
    <div class="modal-dialog">

      <!-- Modal content-->
      <div class="modal-content">
        <div class="modal-header">
          <button type="button" class="close" data-dismiss="modal">&times;</button>
          <h4 class="modal-title">Checkout</h4>
        </div>


      </div>

    </div>

  </div>
                </div>`;



                        break;

                    }

                }
            }
            `</div>`

            buyhtml = buyBody + `</div>
             </div>

             </div>`;
        }

        return buyhtml;
    }

    //video template
    methods.video = (data, uniqueId) => {
        let videohtml = `<li class="list-group-item">
        <div class="media-body">

            <video width="300" height="200" controls>
            <source src="${data.payload}" type=video/mp4>
            </video>

            <p class="bot-timestamp"><small>sent at ${data.time}</small></p>
        </div>
    </li>`;

        return videohtml;
    }
    //audio template
    methods.audio = (data, uniqueId) => {
        let audiohtml = `<li class="list-group-item">
        <div class="media-body">
            <audio width="300" height="200" controls>
            <source src="${data.payload}" type=audio/mp3>
            </audio>
            <p class="bot-timestamp"><small>sent at ${data.time}</small></p>
        </div>
    </li>`;

        return audiohtml;
    }

    //file template
    methods.file = (data, uniqueId) => {
        let filehtml = `<li class="list-group-item">

    <div class="media-body">
    <div class="pmd-chip pmd-chip-contact">
    <i style="font-size:24px" class="fa">&#xf016;</i>  <a href="${data.payload}" target="_blank">Receipt.pdf </a>
    </div>
    </div>
    </li>`;

        return filehtml;
    }
    //receipt template

    methods.receipt = (data, uniqueId) => {
        let receipthtml = '';
        let receiptBody = '';
        receiptBody += `<li class="list-group-item"><p><div class="media-left col-md-8 col-md-pull-2">Order Confirmation</div></p>`
        //listBody+=`<ul class="list-group pmd-z-depth pmd-list receiptbody">`;
        for (let j = 0; j < data.payload.elements.length; j++) {
            receiptBody += `<li class="list-group-item">
                           <div class="media-body">
                               <div class="col-xs-3">
                                   <img src="${data.payload.elements[j].image_url}" width="100" height="100" class="img-responsive">
                               </div>
                               <div class="col-xs-9">
                                   <h3 class="list-group-item-heading">${data.payload.elements[j].title}</h3>
                                   <span class="list-group-item-text">${data.payload.elements[j].subtitle}</span>
                                   <span class="list-group-item-text">Qnty ${data.payload.elements[j].quantity}</span>
                               </div>
                           </div>
                        </li>`;
        }
        receiptBody += ` <span class="list-group-item-text col-md-8 col-md-pull-3">Paid with</span>`
        receiptBody += `<h3 class="list-group-item-heading col-md-8 col-md-pull-3"> ${data.payload.payment_method}</h3>`
        receiptBody += `<span class="list-group-item-text col-md-8 col-md-pull-3">Ship to</span>`
        receiptBody += `<h3 class="list-group-item-heading col-md-8 col-md-pull-3"> ${data.payload.address.street_1}</h3>`
        receiptBody += `<h3 class="list-group-item-heading col-md-8 col-md-pull-3"> ${data.payload.address.city},${data.payload.address.state}${data.payload.address.postal_code}</h3>`
        receipthtml += `<li class="list-group-item" style="padding:10px 0px">
                           <div class="col-xs-12">
                                   <span class="list-group-item-text">Total</span>
                                   <h3 class="list-group-item-heading pull-right">$ ${data.payload.summary.total_cost}</h3>
                           </div>
                       `;
        receipthtml += `<p style="padding-left:15px;"><small>sent at ${data.time}</small></p></li>`;
        return receiptBody + receipthtml;
    }

    //login and logout template for facebook googile and custome

    methods.logout=(data, uniqueId)=>{
        
                let logouthtml='';
                for(let j=0;j<data.payload.elements.length;j++){
                logouthtml+= `<div class="pmd-card pmd-card-default pmd-z-depth" >
                     <div class="pmd-card-media">
                        <img width="100" height="100" class="img-responsive" style="margin: 11px 80px;" src="${data.payload.elements[j].image_url}">
                     </div>    
                    <div class="pmd-card-title">
                        <h2 class="pmd-card-title-text">${data.payload.elements[j].title}</h2>
                       
                    </div>`;
                  
               for(let k=0;k<data.payload.elements[j].buttons.length;k++){
               logouthtml+= `<div class="col-xs-offset-3 col-xs-8"><button data-target="#alert-dialog-1" data-toggle="modal" class="btn btn-sm pmd-ripple-effect btn-primary pmd-z-depth col-xs-12" type="button" style="margin: 11px 10px;">${data.payload.elements[j].buttons[k].title}</button>`
               if(data.isWeb.indexOf("http://localhost:3000/") !== -1){  
                logouthtml += `<a href="#" onclick="signOut()" class="col-xs-12" style="padding:0px 0px">Google Sign out <div class="col-xs-12" style="padding:10px 0px"> 
                <div class="fb-login-button" data-max-rows="1" data-size="medium" 
data-button-type="continue_with" data-show-faces="false" 
data-auto-logout-link="true" data-use-continue-as="false"></div>
  <script>
  function fbLogoutUser() {
  FB.getLoginStatus(function(response) {
  if (response && response.status === 'connected') {
   FB.logout(function(response) {
     }); 
    }});}
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      testAPI();
    } else {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }}
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
        statusChangeCallback(response);
    }); }
  window.fbAsyncInit = function() {
      FB.init({
      appId      : '142030889871896',
      xfbml      : true,
      version    : 'v2.10'
    });
    FB.AppEvents.logPageView();
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_GB/sdk.js#xfbml=1&version=v2.10&appId=142030889871896";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));
  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
        document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
 }
</script></a><div class="signoutuserContent"></div>`
               }else{
                logouthtml+=`<a href="#" class="btn btn-danger btn-block" onclick="signOutElectron()">Google Sign Out </a><div class="signoutuserContentElectron">`
                logouthtml+='<a href="#" class="btn btn-primary btn-block" onclick="fbLogoutUser();">Facebook Sign Out</a><div class ="signoutuserFbElectron">'
                            }
                    
                logouthtml+=`<div tabindex="-1" class="modal fade" id="alert-dialog-1" style="display: none;" aria-hidden="true">
                   <div class="modal-dialog">
                       <div class="modal-content">
                           <div class="modal-body"> Do you want to logout of the account? </div>
                           <div class="pmd-modal-action " >
                               <button data-dismiss="modal"  class="btn pmd-ripple-effect btn-primary pmd-btn-flat" type="button" >Cancel</button>
                               <button data-dismiss="modal"  class="btn pmd-ripple-effect btn-default pmd-btn-flat" type="button" >LogOut</button>
                           </div>
                       </div>
                   </div>
               </div>
               </div>`;
                
            }
            logouthtml+= `</div>`;
        
                        }
        
            return logouthtml;
        
            }
        
        
            methods.login = (data)=> {
                let loginHTML='';
                for(let i in data.payload){
                loginHTML+= `<div class="pmd-card pmd-card-default pmd-z-depth" >
                    <div class="pmd-card-media center-block">
                        <img width="100" height="100" class="img-responsive center-block" src="${data.payload[i].image_url}">
                    </div>
                    <div class="pmd-card-title text-center ">
                        <h2 class="pmd-card-title-text text-center">${data.payload[i].title}</h2>
                    </div>`;
                for(var j=0 ; j < data.payload[i].buttons.length;j++){
                loginHTML+= ` 
                <div class="col-xs-offset-3 col-xs-8">  <button data-target="#alert-dialog" data-toggle="modal" class="btn btn-sm pmd-ripple-effect btn-primary pmd-z-depth col-xs-12" type="button">Log In</button><br></br>`
        
                if(data.isWeb.indexOf("http://localhost:3000/") !== -1){                        
                loginHTML+=`<div id="my-signin3" class="col-xs-12"></div><br></br> 
                <div class="fb-login-button" data-max-rows="1" data-size="medium" 
data-button-type="continue_with" data-show-faces="false" 
data-auto-logout-link="false" data-use-continue-as="false"></div>

   <script>
  function statusChangeCallback(response) {
    if (response.status === 'connected') {
      testAPI();
    } else {
      document.getElementById('status').innerHTML = 'Please log ' +
        'into this app.';
    }  }
 
  function checkLoginState() {
    FB.getLoginStatus(function(response) {
      statusChangeCallback(response);
    });
  }
  window.fbAsyncInit = function() {
      FB.init({
      appId      : '142030889871896',
      xfbml      : true,
      version    : 'v2.10'
    });
    FB.AppEvents.logPageView();
  };
  (function(d, s, id){
     var js, fjs = d.getElementsByTagName(s)[0];
     if (d.getElementById(id)) {return;}
     js = d.createElement(s); js.id = id;
     js.src = "https://connect.facebook.net/en_GB/sdk.js";
     fjs.parentNode.insertBefore(js, fjs);
   }(document, 'script', 'facebook-jssdk'));

  function testAPI() {
    console.log('Welcome!  Fetching your information.... ');
    FB.api('/me', function(response) {
      console.log('Successful login for: ' + response.name);
      document.location.reload();
      document.getElementById('status').innerHTML =
        'Thanks for logging in, ' + response.name + '!';
    });
     }
       </script> <div class="userContent"></div>`
                }else{
                loginHTML+=`<a  href="#" class="btn btn-danger btn-block" onclick="googleauthlogin();" id="google_oauth_login">Google Sign In</a>`; 
                loginHTML+=`<a  href="#" class="btn btn-primary btn-block" onclick="facebooklogin();" id="facebook_oauth_login">Facebook Sign In</a>`     
                }
                
               
                loginHTML+= `</div>`;
                
                loginHTML+=`<div tabindex="-1" class="modal fade " id="alert-dialog" style="display: none;" aria-hidden="true">
                                <div class="modal-dialog">
                                <div class="modal-content col-md-4 col-md-offset-7">
                                    <div class="modal-body"> Please log in </div>
                                    <div class="form-group ">
                                        <table><tr><td>
                                            <label for="inputEmail3" class="col-sm-2 control-label">Username</label>
                                            </td>
                                            <td>
                                            <div class="col-sm-9">
                                            <input type="email" class="form-control" id="inputEmail3" placeholder="Username" required="">
                                            </div>
                                        </td></tr></table>
                                    </div>
                                    <div class="form-group">
                                        <table><tr><td>
                                            <label for="inputPassword3" class="col-sm-2 control-label">Password</label>
                                            </td>
                                            <td>
                                            <div class="col-sm-9">
                                            <input type="password" class="form-control" id="inputPassword3" placeholder="Password" required="">
                                            </div></td></tr>
                                        </table>
                                    </div>
                                    <div class="pmd-modal-action centered text-center">
                                        <button data-dismiss="modal" class="btn btn-sm pmd-ripple-effect btn-primary pmd-z-depth" type="button">Submit</button>
                                    </div>
                                </div>
                                </div>
                            </div>`;
                }
                loginHTML+= `</div>`;
                }
                return loginHTML;
                }


    return methods;
});
