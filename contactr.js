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
    addBtn: '.addBtn',
    updateBtn: '.updateBtn',
    editBtn: '.editBtn',
    cancelBtn: '.cancelBtn',
    inputs: 'input'
  };

  return {
    selectors: selectors,
    displayAll: displayAll,
    displayCurrentDetails: displayCurrentDetails,
    changeCurrent: changeCurrent,
    edit: edit
  };

  function displayAll(contacts) {
    const contactList = document.querySelector(selectors.contactList);
    let currentContact, content = '';

    contacts.forEach(contact => {
      content += `
        <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
          <span class="contact-name">${contact.firstName} <b>${contact.lastName}</b></span>
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
    const contactDetails = document.querySelector(selectors.contactDetails);
    const inputs = document.querySelectorAll(selectors.inputs);
    let currentContact, output;

    allContacts.forEach(contact => {
      if(contact.id === parseInt(id)) {
        currentContact = contact;
      }
    });

    output = `
      <form>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <div class="d-flex justify-content-center">
              <img src="assets/img/avatar.jpeg" class="img-thumbnail rounded-circle avatar">
            </div>
            <div class="form-row">
              <input type="hidden" id="id" value="${currentContact.id}">
              <div class="col">
                <input type="text" readonly class="form-control-plaintext h2 text-right" id="firstName" value="${currentContact.firstName}">
              </div>
              <div class="col">
                <input type="text" readonly class="form-control-plaintext h2 text-left" id="lastName" value="${currentContact.lastName}">              
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <button class="editBtn btn btn-outline-dark btn-sm">Edit</button>
              <button class="cancelBtn d-none">Cancel</button>              
              <button class="updateBtn d-none">Update</button>
            </div>
          </div>
        </div>
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
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="street" value="${currentContact.street}">
              </div>
            </div>
            <div class="form-row">
              <div class="col-4 col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="city" value="${currentContact.city}">
              </div>
              <div class="col-4 col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="region" value="${currentContact.region}">
              </div>
              <div class="col-4 col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="postalCode" value="${currentContact.postalCode}">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="country" value="${currentContact.country}">
              </div>
            </div>
          </div>
        </div>
      </form>`;

    contactDetails.innerHTML = output;
    
    loadEventListeners();
  }

  function changeCurrent(e) {
    if(!e.target.classList.contains('active')) {
      document.querySelector(selectors.contactListItemActive).classList.remove('active');
      e.target.classList += ' active';
    }

    uiCtrl.displayCurrentDetails(e.target.id);
  }

  function add() {
    const contactDetails = document.querySelector(selectors.contactDetails);    
    let output;

    output = `
      <form>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <div class="d-flex justify-content-center">
              <img class="img-thumbnail rounded-circle avatar">
            </div>
            <div class="form-row">
              <input type="hidden" id="id" value="x">
              <div class="col">
                <input type="text" class="form-control-plaintext h2 text-right" id="firstName" placeholder="First Name">
              </div>
              <div class="col">
                <input type="text" class="form-control-plaintext h2 text-left" id="lastName" placeholder="Last Name">              
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <button class="cancelBtn btn btn-outline-danger btn-sm">Cancel</button>              
              <button class="saveBtn btn btn-outline-success btn-sm ml-2">Add</button>
            </div>
          </div>
        </div>
        <div class="row">
          <label for="phoneNumber" class="col-sm-3 col-form-label-sm font-weight-bold">Phone Number</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext form-control-sm" id="phoneNumber" placeholder="Phone Number">
          </div>
        </div>
        <div class="row">
          <label for="emailAddress" class="col-sm-3 col-form-label-sm font-weight-bold">Email Address</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext form-control-sm" id="emailAddress" placeholder="Email Address">
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="dob" class="col-sm-3 col-form-label-sm font-weight-bold">Birthday</label>
          <div class="col-sm-9">
            <input type="text" class="form-control-plaintext form-control-sm" id="dob" placeholder="Date of Birth">
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="address" class="col-sm-3 col-form-label-sm font-weight-bold">Address</label>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-sm-6">
                <input type="text" class="form-control-plaintext form-control-sm" id="street" placeholder="Street Number">
              </div>
            </div>
            <div class="form-row">
              <div class="col-4 col-sm-2">
                <input type="text" class="form-control-plaintext form-control-sm" id="city" placeholder="City">
              </div>
              <div class="col-4 col-sm-2">
                <input type="text" class="form-control-plaintext form-control-sm" id="region" placeholder="Region">
              </div>
              <div class="col-4 col-sm-2">
                <input type="text" class="form-control-plaintext form-control-sm" id="postalCode" placeholder="Postal Code">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <input type="text" class="form-control-plaintext form-control-sm" id="country" placeholder="Country">
              </div>
            </div>
          </div>
        </div>
      </form>`;

      contactDetails.innerHTML = output;
  }

  function edit(e) {
    const [inputs, editBtn, updateBtn, cancelBtn] = [
      document.querySelectorAll(selectors.inputs),
      document.querySelector(selectors.editBtn),
      document.querySelector(selectors.updateBtn),
      document.querySelector(selectors.cancelBtn)
    ];

    editBtn.className = 'editBtn d-none';
    updateBtn.classList = 'updateBtn btn btn-outline-success btn-sm d-block ml-2';
    cancelBtn.classList = 'cancelBtn btn btn-outline-danger btn-sm d-block';

    inputs.forEach(input => {
      input.removeAttribute('readonly')
    });
  }

  function update() {
    const inputValues = document.querySelectorAll(selectors.inputs);
    const allContacts = dataCtrl.allContacts;
    let [keys, values] = [[], []];
    let updatedContactDetails = {};

    inputValues.forEach(input => {
      keys.push(input.id);
      values.push(input.value);
    });

    keys.forEach((key, i) => {
      updatedContactDetails[key] = values[i];
    });

    allContacts.forEach(contactDetails => {
      if(contactDetails.id === parseInt(updatedContactDetails.id)) {
        contactDetails = updatedContactDetails;
        httpService.put(`http://localhost:3000/contacts/${contactDetails.id}`, contactDetails);        
      }
    });
  }

  function cancel(e) {
    const [inputs, editBtn, updateBtn, cancelBtn] = [
      document.querySelectorAll(selectors.inputs),
      document.querySelector(selectors.editBtn),
      document.querySelector(selectors.updateBtn),
      e.target
    ];

    inputs.forEach(input => {
      input.setAttribute('readonly', 'readonly')
    });
    
    editBtn.className = 'editBtn btn btn-outline-dark btn-sm d-block';
    updateBtn.classList = 'updateBtn d-none';
    cancelBtn.classList = 'cancelBtn d-none';
  }

  function loadEventListeners() {
    const [addBtn, editBtn, updateBtn, cancelBtn] = [
      document.querySelector(selectors.addBtn),
      document.querySelector(selectors.editBtn),
      document.querySelector(selectors.updateBtn),
      document.querySelector(selectors.cancelBtn)
    ];

    addBtn.addEventListener('click', add);
    editBtn.addEventListener('click', edit);
    updateBtn.addEventListener('click', update);
    cancelBtn.addEventListener('click', cancel);
  }
})();


// ==============================
// App controller
// ==============================
const appCtrl = ((dataCtrl, uiCtrl) => {
  dataCtrl.fetchAll();
})(dataCtrl, uiCtrl);