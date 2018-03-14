// ==============================
// Data controller
// ==============================
const dataCtrl = (() => {
  let storedContacts = [];

  return {
    fetchContacts: fetchContacts,
    storedContacts: storedContacts,
    save: save,
    update: update,
    remove: remove
  };

  function fetchContacts() {
    const contacts = httpService.get('http://localhost:3000/contacts')
      .then(contacts => {
        contacts.forEach(contact => {
          storedContacts.push(contact);
        });
        uiCtrl.listAll(storedContacts);
      })
      .catch(err => console.log(err));
  }

  function save(e) {
    console.log('Saving new contact!');

    e.preventDefault();
  }

  function update(e) {
    const inputValues = document.querySelectorAll(uiCtrl.selectors.inputs);
    const contacts = dataCtrl.storedContacts;
    let [keys, values] = [[], []];
    let updatedContactDetails = {};

    inputValues.forEach(input => {
      keys.push(input.id);
      values.push(input.value);
    });

    keys.forEach((key, i) => {
      updatedContactDetails[key] = values[i];
    });

    contacts.forEach(contactDetails => {
      if(contactDetails.id === parseInt(updatedContactDetails.id)) {
        contactDetails = updatedContactDetails;
        debugger;
        httpService.put(`http://localhost:3000/contacts/${contactDetails.id}`, contactDetails);        
      }
    });

    e.preventDefault();
  }

  function remove(e) {
    confirm('Are you sure?');

    e.preventDefault();
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
    deleteBtn: '.deleteBtn',
    editBtn: '.editBtn',
    updateBtn: '.updateBtn',
    saveBtn: '.saveBtn',
    cancelBtn: '.cancelBtn',
    addCancelBtn: '.addCancelBtn',
    inputs: 'input'
  };

  return {
    selectors: selectors,
    listAll: listAll,
    displayCurrentDetails: displayCurrentDetails,
    changeCurrent: changeCurrent
  };

  function listAll(storedContacts) {
    const contactList = document.querySelector(selectors.contactList);
    let currentContact, content = '';

    storedContacts.forEach(contact => {
      content += `
        <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
          <span class="contact-name">${contact.firstName} <b>${contact.lastName}</b></span>
        </li>`;
    });

    contactList.innerHTML = content;
    
    document.getElementById('1').classList += ' active';
    currentContact = document.getElementById('1');
    displayCurrentDetails(currentContact.id);
  }

  function displayCurrentDetails(id) {
    const storedContacts = dataCtrl.storedContacts;
    const contactDetails = document.querySelector(selectors.contactDetails);
    const inputs = document.querySelectorAll(selectors.inputs);
    let currentContact, output;

    storedContacts.forEach(contact => {
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
                <input type="text" readonly class="form-control-plaintext h2 text-right" id="firstName" name="First Name" value="${currentContact.firstName}">
              </div>
              <div class="col">
                <input type="text" readonly class="form-control-plaintext h2 text-left" id="lastName" name="Last Name" value="${currentContact.lastName}">              
              </div>
            </div>
            <div class="d-flex justify-content-center">
              <button class="editBtn btn btn-outline-dark btn-sm">Edit</button>
              <button class="cancelBtn d-none">Cancel</button>       
              <button class="updateBtn d-none">Update</button>
              <button class="saveBtn d-none">Save</button>
              <button class="deleteBtn btn btn-outline-danger btn-sm ml-2">Delete</button>
            </div>
          </div>
        </div>
        <div class="row">
          <label for="phoneNumber" class="col-sm-3 col-form-label-sm font-weight-bold">Phone Number</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="phoneNumber" name="Phone Number" value="${currentContact.phoneNumber}">
          </div>
        </div>
        <div class="row">
          <label for="emailAddress" class="col-sm-3 col-form-label-sm font-weight-bold">Email Address</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="emailAddress" name="Email" value="${currentContact.emailAddress}">
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="dob" class="col-sm-3 col-form-label-sm font-weight-bold">Birthday</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="dob" name="Date of Birth" value="${currentContact.dob}">
          </div>
        </div>
        <div class="row">
          <label for="age" class="col-sm-3 col-form-label-sm font-weight-bold">Age</label>
          <div class="col-sm-9">
            <input type="text" readonly class="form-control-plaintext form-control-sm" id="age" name="Remove me!" value="${currentContact.age}">
          </div>
        </div>
        <hr>
        <div class="row">
          <label for="address" class="col-sm-3 col-form-label-sm font-weight-bold">Address</label>
          <div class="col-sm-9">
            <div class="row">
              <div class="col-sm-6">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="street" name="Street" value="${currentContact.street}">
              </div>
            </div>
            <div class="form-row">
              <div class="col-4 col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="city" name="City" value="${currentContact.city}">
              </div>
              <div class="col-4 col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="region" name="Region" value="${currentContact.region}">
              </div>
              <div class="col-4 col-sm-2">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="postalCode" name="Postal Code" value="${currentContact.postalCode}">
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12">
                <input type="text" readonly class="form-control-plaintext form-control-sm" id="country" name="Country" value="${currentContact.country}">
              </div>
            </div>
          </div>
        </div>
      </form>`;

    contactDetails.innerHTML = output;

    eCtrl.loadEventListeners();
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
// State controller
// ==============================
const stateCtrl = (() => {  
  return {
    add: add,
    edit: edit,
    cancel: cancel,
    addCancel: addCancel,
  };

  function add() {
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);
    const cancelBtn = document.querySelector(uiCtrl.selectors.cancelBtn);
    const saveBtn = document.querySelector(uiCtrl.selectors.saveBtn);

    const inputs = document.querySelectorAll(uiCtrl.selectors.inputs);

    // Hide
    editBtn.className = 'editBtn d-none';
    deleteBtn.className = 'deleteBtn d-none';

    // Show
    cancelBtn.classList = 'cancelBtn btn btn-outline-dark btn-sm d-block';
    saveBtn.classList = 'saveBtn btn btn-outline-success btn-sm d-block ml-2';

    inputs.forEach(input => {
      input.value = '';
      input.removeAttribute('readonly');
      input.setAttribute('placeholder', input.name);
    });
  }

  function edit(e) {
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);    
    const updateBtn = document.querySelector(uiCtrl.selectors.updateBtn);
    const cancelBtn = document.querySelector(uiCtrl.selectors.cancelBtn);

    const inputs = document.querySelectorAll(uiCtrl.selectors.inputs);

    inputs.forEach(input => {
      input.removeAttribute('readonly');
    });

    // Hide
    editBtn.className = 'editBtn d-none';
    deleteBtn.className = 'deleteBtn d-none';

    // Show
    updateBtn.classList = 'updateBtn btn btn-outline-success btn-sm d-block ml-2';
    cancelBtn.classList = 'cancelBtn btn btn-outline-dark btn-sm d-block';

    e.preventDefault();
  }

  function cancel(e) {
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);    
    const updateBtn = document.querySelector(uiCtrl.selectors.updateBtn);
    const cancelBtn = e.target;
    const saveBtn = document.querySelector(uiCtrl.selectors.saveBtn);    

    const inputs = document.querySelectorAll(uiCtrl.selectors.inputs);    

    inputs.forEach(input => {
      input.removeAttribute('placeholder');
      // input.value...      
      input.setAttribute('readonly', true);
    });

    // uiCtrl.displayCurrentDetails();
    
    editBtn.className = 'editBtn btn btn-outline-dark btn-sm d-block';
    deleteBtn.classList = 'deleteBtn btn btn-outline-danger btn-sm ml-2';
    updateBtn.classList = 'updateBtn d-none';
    cancelBtn.classList = 'cancelBtn d-none';
    saveBtn.classList = 'saveBtn d-none';
    
    e.preventDefault();
  }

  function addCancel() {
    console.log('Canceled adding a contact!');
  }
})();


// ==============================
// Events controller
// ==============================
const eCtrl = (() => {
  return {
    loadEventListeners: loadEventListeners
  };

  function loadEventListeners() {
    const contactList = document.querySelector(uiCtrl.selectors.contactList);
    const addBtn = document.querySelector(uiCtrl.selectors.addBtn);
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);

    const cancelBtn = document.querySelector(uiCtrl.selectors.cancelBtn);
    const updateBtn = document.querySelector(uiCtrl.selectors.updateBtn);
    const saveBtn = document.querySelector(uiCtrl.selectors.saveBtn);
    const addCancelBtn = document.querySelector(uiCtrl.selectors.addCancelBtn);
    
    contactList.addEventListener('click', uiCtrl.changeCurrent);
    addBtn.addEventListener('click', stateCtrl.add);
    editBtn.addEventListener('click', stateCtrl.edit);
    deleteBtn.addEventListener('click', dataCtrl.remove);

    cancelBtn.addEventListener('click', stateCtrl.cancel);
    updateBtn.addEventListener('click', dataCtrl.update);
    saveBtn.addEventListener('click', dataCtrl.save);
    addCancelBtn.addEventListener('click', stateCtrl.addCancel);
  }
})();


// ==============================
// App controller
// ==============================
const appCtrl = ((dataCtrl, stateCtrl, uiCtrl, eCtrl) => {
  dataCtrl.fetchContacts();
})(dataCtrl, stateCtrl, uiCtrl, eCtrl);