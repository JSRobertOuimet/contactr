// ==============================
// Data controller
// ==============================
const dataCtrl = (() => {
  let allContacts = [];

  return {
    allContacts: allContacts,
    fetchAll: fetchAll
  };

  function fetchAll() {
    const contacts = httpService.get('http://localhost:3000/contacts')
      .then(contacts => {
        contacts.forEach(contact => {
          allContacts.push(contact);
        });    
        uiCtrl.displayAll(contacts);
      })
      .catch(err => console.log(err));
  }
})();


// ==============================
// UI controller
// ==============================
const uiCtrl = (() => {
  const selectors = {
    contactList: '.contactList',
    contactListItem: '.contactListItem',
    contactListItemActive: '.active',
    contactDetails: '.contactDetails'
  };

  return {
    selectors: selectors,
    displayAll: displayAll,
    displayCurrentDetails: displayCurrentDetails,
    changeCurrent: changeCurrent
  };

  function displayAll(contacts) {
    const contactList = document.querySelector(selectors.contactList);
    let currentContact;
    let content = '';

    contacts.forEach(contact => {
      content += `
        <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
          <span class="contact-name">${contact.firstName} ${contact.middleName} <b>${contact.lastName}</b></span>
        </li>`;
    });

    contactList.innerHTML = content;
    
    // Display first contact details on load
    document.getElementById('1').classList += ' active';
    currentContact = document.getElementById('1');
    displayCurrentDetails(currentContact.id);

    contactList.addEventListener('click', changeCurrent);
  }

  function displayCurrentDetails(id) {
    const allContacts = dataCtrl.allContacts;
    const contactDetails = document.querySelector(uiCtrl.selectors.contactDetails);
    let currentContact;

    allContacts.forEach(contact => {
      if(contact.id === parseInt(id)) {
        currentContact = contact;
      }
    });

    let output = `
      <form>
        <div class="row">
          <label for="firstName" class="col-sm-3 col-form-label font-weight-bold">First Name</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="firstName" value="${currentContact.firstName}">
          </div>
        </div>
        <div class="row">
          <label for="middleName" class="col-sm-3 col-form-label font-weight-bold">Middle Name</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="middleName" value="${currentContact.middleName}">
          </div>
        </div>
        <div class="row">
          <label for="lastName" class="col-sm-3 col-form-label font-weight-bold">Last Name</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="lastName" value="${currentContact.lastName}">
          </div>
        </div>

        <hr>

        <div class="row">
          <label for="phoneNumber" class="col-sm-3 col-form-label font-weight-bold">Phone Number</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="phoneNumber" value="${currentContact.phoneNumber}">
          </div>
        </div>
        <div class="row">
          <label for="emailAddress" class="col-sm-3 col-form-label font-weight-bold">Email Address</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="emailAddress" value="${currentContact.emailAddress}">
          </div>
        </div>

        <hr>
        
        <div class="row">
          <label for="dob" class="col-sm-3 col-form-label font-weight-bold">Birthday</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="dob" value="${currentContact.dob}">
          </div>
        </div>
        <div class="row">
          <label for="age" class="col-sm-3 col-form-label font-weight-bold">Age</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext" id="age" value="${currentContact.age}">
          </div>
        </div>

        <hr>

        <div class="row">
          <label for="address" class="col-sm-3 col-form-label font-weight-bold">Address</label>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-sm-6">
                <input type="text" class="form-control-plaintext" id="street" value="${currentContact.physicalAddress.street}">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-2">
                <input type="text" class="form-control-plaintext" id="city" value="${currentContact.physicalAddress.city}">
              </div>
              <div class="col-sm-2">
                <input type="text" class="form-control-plaintext" id="region" value="${currentContact.physicalAddress.region}">
              </div>
              <div class="col-sm-2">
                <input type="text" class="form-control-plaintext" id="postalCode" value="${currentContact.physicalAddress.postalCode}">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <input type="text" class="form-control-plaintext" id="country" value="${currentContact.physicalAddress.country}">
              </div>
            </div>
          </div>
        </div>

        <div class="row">

        </div>
      </form>`;

    contactDetails.innerHTML = output;
  }

  function changeCurrent(e) {
    if(!e.target.classList.contains('active')) {
      document.querySelector(selectors.contactListItemActive).classList.remove('active');
      e.target.classList += ' active';
    }

    uiCtrl.displayCurrentDetails(e.target.id);
  }
})();


// ==============================
// App controller
// ==============================
const appCtrl = ((dataCtrl, uiCtrl) => {
  dataCtrl.fetchAll();
})(dataCtrl, uiCtrl);