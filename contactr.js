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
    contactDetails: '.contactDetails',
    updateBtn: '.updateBtn',
    editBtn: '.editBtn',
    cancelBtn: '.cancelBtn',
    input: 'input'
  };

  return {
    selectors: selectors,
    displayAll: displayAll,
    displayCurrentDetails: displayCurrentDetails,
    changeCurrent: changeCurrent,
    toEditState: toEditState
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
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <div class="row">
              <img src="assets/img/avatar.jpeg" class="img-thumbnail rounded-circle avatar mx-auto">
            </div>
            <div class="d-flex justify-content-center row">
              <input type="text" readonly class="form-control-plaintext h2 text-center" id="name" value="${currentContact.firstName} ${currentContact.middleName} ${currentContact.lastName}">
              <button class="editBtn btn btn-outline-dark btn-sm">Edit</button>
              <button class="cancelBtn btn btn-outline-danger btn-sm d-none">Cancel</button>
            </div>
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="phoneNumber" class="col-sm-3 col-form-label-sm font-weight-bold">Phone Number</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="phoneNumber" value="${currentContact.phoneNumber}">
          </div>
        </div>
        <div class="row">
          <label for="emailAddress" class="col-sm-3 col-form-label-sm font-weight-bold">Email Address</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="emailAddress" value="${currentContact.emailAddress}">
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="dob" class="col-sm-3 col-form-label-sm font-weight-bold">Birthday</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="dob" value="${currentContact.dob}">
          </div>
        </div>
        <div class="row">
          <label for="age" class="col-sm-3 col-form-label-sm font-weight-bold">Age</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="age" value="${currentContact.age}">
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="address" class="col-sm-3 col-form-label-sm font-weight-bold">Address</label>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-sm-6">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="street" value="${currentContact.physicalAddress.street}">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="city" value="${currentContact.physicalAddress.city}">
              </div>
              <div class="col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="region" value="${currentContact.physicalAddress.region}">
              </div>
              <div class="col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="postalCode" value="${currentContact.physicalAddress.postalCode}">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="country" value="${currentContact.physicalAddress.country}">
              </div>
            </div>
          </div>
        </div>
      </form>`;

    contactDetails.innerHTML = output;

    const editBtn = document.querySelector(selectors.editBtn);
    const cancelBtn = document.querySelector(selectors.cancelBtn);

    editBtn.addEventListener('click', toEditState);
    cancelBtn.addEventListener('click', cancel);
  }

  function changeCurrent(e) {
    if(!e.target.classList.contains('active')) {
      document.querySelector(selectors.contactListItemActive).classList.remove('active');
      e.target.classList += ' active';
    }

    uiCtrl.displayCurrentDetails(e.target.id);
  }

  function toEditState(e) {
    const inputs = document.querySelectorAll(selectors.input);
    const editBtn = document.querySelector(selectors.editBtn);
    const cancelBtn = document.querySelector(selectors.cancelBtn);

    inputs.forEach(input => {
      input.removeAttribute('readonly')
    });

    editBtn.textContent = 'Update';
    editBtn.classList = 'updateBtn btn btn-outline-success btn-sm';
    cancelBtn.classList = 'cancelBtn btn btn-outline-danger btn-sm d-block ml-2';
  }

  function cancel(e) {
    const inputs = document.querySelectorAll(selectors.input);    
    const updateBtn = document.querySelector(selectors.updateBtn);

    inputs.forEach(input => {
      input.setAttribute('readonly', 'readonly')
    });
    
    updateBtn.textContent = 'Edit';
    updateBtn.classList = 'editBtn btn btn-outline-dark btn-sm';

    e.target.classList = 'cancelBtn btn btn-outline-danger btn-sm d-none ml-2';
  }
})();


// ==============================
// App controller
// ==============================
const appCtrl = ((dataCtrl, uiCtrl) => {
  dataCtrl.fetchAll();
})(dataCtrl, uiCtrl);