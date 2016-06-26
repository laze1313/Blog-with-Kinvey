const appID = 'kid_H1X_dTPH';
const appBaseURL = 'https://baas.kinvey.com/';
const appSecret = '81895dc2d385481f9b3c9fe34fd9cb7d';


function showView(viewId) {
  $('main>section').hide();
  $('#' + viewId).show();
}

function showSectionInfo() {
  'use strict';
  let logged = sessionStorage.authToken != null;
  if (logged) {
    $("#linkHome").show();
    $("#linkLogin").hide();
    $("#linkRegister").hide();
    $("#linkSale").show();
    $("#linkBuy").show();
    $("#linkLogout").show();
  } else {
    $("#linkHome").show();
    $("#linkLogin").show();
    $("#linkRegister").show();
    $("#linkSale").hide();
    $("#linkBuy").hide();
    $("#linkLogout").hide();

  }
}

function showHomeView() {
  showView('viewHome');
}

function showLoginView() {
  showView('viewLogin');
}

function login() {
  let authBase64 = btoa(appID + ':' + appSecret);
  let loginURL = appBaseURL + 'user/' + appID + '/login';
  let loginData = {
    username: $('#loginUser').val(),
    password: $('#loginPass').val(),
  };
  $.ajax({
    method: 'POST',
    url: loginURL,
    data: loginData,
    headers: {
      'Authorization': 'Basic ' + authBase64
    },
    success: loginSuccess,
    error: showError
  });
}

function showError(data, status) {
  let errorMessage = '';
  if (typeof(data.readyState) != 'undefined' && data.readyState == 0) {
    errorMessage = 'Network not found';
  } else if (data.responseJSON && data.responseJSON.description) {
    errorMessage = data.responseJSON.description;
  } else {
    errorMessage = 'Error: ' + JSON.stringify(data);
  }
  $('#errorBox').text(errorMessage).show();
}

function loginSuccess(data, status) {
  sessionStorage.authToken = data._kmd.authtoken;
  showSaleView();
  showSectionInfo();
  showInfo('Your login was successful!');
}

function showInfo(messageAfterLogin) {
  $('#infoBox').text(messageAfterLogin)
    .show()
    .delay(5000)
    .fadeOut();
}

function showRegisterView() {
  showView('viewRegister');
}

function register() {
  let authBase64 = btoa(appID + ':' + appSecret);
  let loginURL = appBaseURL + 'user/' + appID + '/';
  let loginData = {
    username: $('#registerUser').val(),
    password: $('#registerPass').val(),
  };
  $.ajax({
    method: 'POST',
    url: loginURL,
    data: loginData,
    headers: {
      'Authorization': 'Basic ' + authBase64
    },
    success: registerSuccess,
    error: showError
  });

  function registerSuccess(data, status) {
    sessionStorage.authToken = data._kmd.authtoken;
    showSaleView();
    showSectionInfo();
    showInfo('Registration complete!');
  }

}

function showSaleView() {
  showView('viewSale');
  $('#cars').text(' ');
  let authBase64 = btoa(appID + ':' + appSecret);
  let carStoreURL = appBaseURL + 'appdata/' + appID + '/Cars';
  let headerAuthentication = {
    'Authorization': 'Kinvey ' + sessionStorage.authToken,
  };
  $.ajax({
    method: 'GET',
    url: carStoreURL,
    headers: headerAuthentication,
    success: loadedList,
    error: showError
  });

  function loadedList(data, status) {
    showInfo('All cars are loaded!');
    let listOfCars = $('<table>')
      .append($('<tr>')
        .append($('<th>Car Brand</th>'))
        .append($('<th>Car Model</th>'))
        .append($('<th>Year of manufacture</th>'))
        .append($('<th>Additional information</th>'))
      );
    for (car of data) {
      listOfCars.append($('<tr>')
        .append($('<td></td>').text(car.brand))
        .append($('<td></td>').text(car.model))
        .append($('<td></td>').text(car.year))
        .append($('<td></td>').text(car.information))
      );
    }
    $('#cars').append(listOfCars);
  }
}

function showBuyView() {
  showView('viewOur');
}

function addCar() {
  let authBase64 = btoa(appID + ':' + appSecret);
  let carStoreURL = appBaseURL + 'appdata/' + appID + '/Cars';
  let headerAuthentication = {
    'Authorization': 'Kinvey ' + sessionStorage.authToken,
    'Content-Type': 'application/json'
  };
  let newCar = {
    brand: $('#carMark').val(),
    model: $('#carModel').val(),
    year: $('#carYear').val(),
    information: $('#carDescription').val()
  };
  $.ajax({
    method: 'POST',
    url: carStoreURL,
    data: JSON.stringify(newCar),
    headers: headerAuthentication,
    success: addNewCar,
    error: showError
  });

  function addNewCar(data) {
    showSaleView();
  }
}

function logout() {
  sessionStorage.clear();
  showHomeView();
  showSectionInfo();
}
$(function() {
  $("#linkHome").click(showHomeView);
  $("#linkLogin").click(showLoginView);
  $("#linkRegister").click(showRegisterView);
  $("#linkSale").click(showSaleView);
  $("#linkBuy").click(showBuyView);
  $("#linkLogout").click(logout);

  $("#formLogin").submit(login);
  $("#formRegister").submit(register);
  $("#formAddCar").submit(addCar);
  showHomeView();
  showSectionInfo();

  $(document)
    .ajaxStart(function() {
      $('#loadingBox').show();
    })
    .ajaxStop(function() {
      $('#loadingBox').hide();
    });
});
