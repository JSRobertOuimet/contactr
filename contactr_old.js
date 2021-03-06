// ==============================
// Data controller
// ==============================
const dataCtrl = (() => {
  const apiUrl = 'http://localhost:3000/contacts';
  let storedContacts = [];

  return {
    fetchContacts: fetchContacts,
    storedContacts: storedContacts,
    getAge: getAge,
    save: save,
    update: update,
    delete: del
  };

  function fetchContacts() {
    const contacts = httpService.get(apiUrl)
      .then(contacts => {
        contacts.forEach(contact => {
          storedContacts.push(contact);
          storedContacts.sort(sortContactsByLastName);
        });
        uiCtrl.populateContactList(storedContacts);
      })
      .catch(err => console.log(err));
  }

  function sortContactsByLastName(a, b) {
    if(a.lastName < b.lastName) {
      return -1;
    }
    if(a.lastName > b.lastName) {
      return 1;
    }

    return 0;
  }

  function getAge(date) {
    const dob = new Date(date);
    const dobMs = dob.getTime();
    const ageMs = Date.now() - dobMs;
    const ageDate = new Date(ageMs);

    return Math.abs(ageDate.getUTCFullYear() - 1970);
  }

  function save() {
    const inputValues = document.querySelectorAll(uiCtrl.selectors.inputs);
    const contacts = dataCtrl.storedContacts;
    let [keys, values] = [[], []];
    let newContactDetails = {};

    inputValues.forEach(input => {
      keys.push(input.id);
      values.push(input.value);
    });

    keys.forEach((key, i) => {
      newContactDetails[key] = values[i];
    });

    httpService.post(apiUrl, newContactDetails);
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
        httpService.put(`${apiUrl}/${contactDetails.id}`, contactDetails);
      }
    });

    e.preventDefault();
  }

  function del() {
    const contacts = dataCtrl.storedContacts;
    const currentContactId = document.getElementById('id').value;

    if(confirm('Are you sure?')) {
      contacts.forEach(contactDetails => {
        if(contactDetails.id === parseInt(currentContactId)) {
          httpService.delete(`${apiUrl}/${contactDetails.id}`);
        }
      });
    }
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
    searchInput: '.searchInput',
    contactName: '.contact-name',
    contactDetails: '.contactDetails',
    addBtn: '.addBtn',
    avatar: '.avatar',
    uploadBtn: '.uploadBtn',
    deleteBtn: '.deleteBtn',
    editBtn: '.editBtn',
    updateBtn: '.updateBtn',
    saveBtn: '.saveBtn',
    cancelBtn: '.cancelBtn',
    addCancelBtn: '.addCancelBtn',
    inputs: '.contactDetail'
  };

  return {
    selectors: selectors,
    populateContactList: populateContactList,
    displayCurrentDetails: displayCurrentDetails,
    changeCurrent: changeCurrent,
    search: search
  };

  function populateContactList(storedContacts) {
    const contactList = document.querySelector(selectors.contactList);
    const contactName = document.querySelector(selectors.contactName);
    let currentContact;
    let content = '';

    if(storedContacts.length === 0) {
      displayEmptyList(20);
      displayEmptyDetails('You have no contact yet.');
    }
    else {
      storedContacts.forEach(contact => {
        content += `
          <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
            <span class="contact-name">${contact.firstName} <b>${contact.lastName}</b></span>
          </li>`;
      });

      contactList.innerHTML = content;

      currentContact = selectFirstContact();
      displayCurrentDetails(currentContact.id);
    }
  }

  function selectFirstContact() {
    const firstContact = document.querySelectorAll(selectors.contactListItem)[0];

    firstContact.classList += ' active';

    return firstContact;
  }

  function displayEmptyList(listItems) {
    const contactList = document.querySelector(selectors.contactList);
    let content = '';

    for(let i = 0; i < listItems; i++) {
      content += '<li class="list-group-item empty-contact-list-item"></li>';
    }

    contactList.innerHTML = content;
  }

  function displayEmptyDetails(message) {
    const contactDetails = document.querySelector(selectors.contactDetails);

    contactDetails.innerHTML = `<div class="my-auto mx-auto text-center text-muted h3">${message}</div>`;
  }

  function displayCurrentDetails(id) {
    const storedContacts = dataCtrl.storedContacts;
    const contactDetails = document.querySelector(selectors.contactDetails);
    const inputs = document.querySelectorAll(selectors.inputs);
    let currentContact, age, output;

    storedContacts.forEach(contact => {
      if(contact.id === parseInt(id)) {
        currentContact = contact;
      }
    });

    if(currentContact.dob) {
      currentContact.age = dataCtrl.getAge(currentContact.dob);
    }

    output = `
      <form>
        <div class="jumbotron jumbotron-fluid">
          <div class="container">
            <div class="d-flex justify-content-center">
              <img src="assets/img/avatar.jpeg" class="img-thumbnail rounded-circle avatar">
              <label class="uploadBtn btn btn-default d-none">
                <input type="file" id="avatar" class="contactDetail">
              </label>
            </div>
            <div class="form-row">
              <input type="hidden" id="id" class="contactDetail" value="${currentContact.id}">
              <div class="col">
                <input type="text" readonly class="form-control-plaintext h2 text-right contactDetail" id="firstName" name="First Name" value="${currentContact.firstName}">
              </div>
              <div class="col">
                <input type="text" readonly class="form-control-plaintext h2 text-left contactDetail" id="lastName" name="Last Name" value="${currentContact.lastName}">
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
        <div class="contactDetailsBody">
          <div class="row">
            <label for="phoneNumber" class="col-sm-3 col-form-label-sm font-weight-bold">Phone Number</label>
            <div class="col-sm-9">
              <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="phoneNumber" name="Phone Number" value="${currentContact.phoneNumber}">
            </div>
          </div>
          <div class="row">
            <label for="emailAddress" class="col-sm-3 col-form-label-sm font-weight-bold">Email Address</label>
            <div class="col-sm-9">
              <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="emailAddress" name="Email" value="${currentContact.emailAddress}">
            </div>
          </div>
          <hr>
          <div class="row">
            <label for="dob" class="col-sm-3 col-form-label-sm font-weight-bold">Birthday</label>
            <div class="col-sm-9">
              <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="dob" name="Date of Birth" value="${currentContact.dob}">
            </div>
          </div>
          <div class="row">
            <label for="age" class="col-sm-3 col-form-label-sm font-weight-bold">Age</label>
            <div class="col-sm-9">
              <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="age" name="Remove me!" value="${currentContact.age}">
            </div>
          </div>
          <hr>
          <div class="row">
            <label for="address" class="col-sm-3 col-form-label-sm font-weight-bold">Address</label>
            <div class="col-sm-9">
              <div class="row">
                <div class="col-sm-6">
                  <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="street" name="Street" value="${currentContact.street}">
                </div>
              </div>
              <div class="form-row">
                <div class="col col-lg-2">
                  <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="city" name="City" value="${currentContact.city}">
                </div>
                <div class="col col-lg-2">
                  <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="region" name="Region" value="${currentContact.region}">
                </div>
                <div class="col col-lg-2">
                  <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="postalCode" name="Postal Code" value="${currentContact.postalCode}">
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12">
                  <input type="text" readonly class="form-control-plaintext form-control-sm contactDetail" id="country" name="Country" value="${currentContact.country}">
                </div>
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

    displayCurrentDetails(e.target.id);
  }

  function search(e) {
    const contactNames = document.querySelectorAll(selectors.contactName);
    let searchInput = e.target.value;
    let filteredContacts = document.querySelectorAll(selectors.contactListItem);

    if(e.shiftKey === false) {
      contactNames.forEach(contactName => {
        if(contactName.textContent.indexOf(searchInput) === -1) {
          contactName.parentElement.style.display = 'none';
        }
        else {
          contactName.parentElement.style.display = 'block';
        }
      });
    }
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
  };

  function add() {
    const avatar = document.querySelector(uiCtrl.selectors.avatar);
    const uploadBtn = document.querySelector(uiCtrl.selectors.uploadBtn);
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);
    const cancelBtn = document.querySelector(uiCtrl.selectors.cancelBtn);
    const saveBtn = document.querySelector(uiCtrl.selectors.saveBtn);
    const inputs = document.querySelectorAll(uiCtrl.selectors.inputs);

    // Hide
    avatar.className = 'avatar d-none';
    editBtn.className = 'editBtn d-none';
    deleteBtn.className = 'deleteBtn d-none';

    // Show
    uploadBtn.classList = 'uploadBtn btn';
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
    const avatar = document.querySelector(uiCtrl.selectors.avatar);
    const uploadBtn = document.querySelector(uiCtrl.selectors.uploadBtn);
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);
    const updateBtn = document.querySelector(uiCtrl.selectors.updateBtn);
    const cancelBtn = e.target;
    const saveBtn = document.querySelector(uiCtrl.selectors.saveBtn);
    const inputs = document.querySelectorAll(uiCtrl.selectors.inputs);
    const currentContact = document.querySelector('.active');

    uiCtrl.displayCurrentDetails(currentContact.id);

    avatar.className = 'img-thumbnail rounded-circle avatar d-block';
    uploadBtn.className = 'uploadBtn d-none';
    editBtn.className = 'editBtn btn btn-outline-dark btn-sm d-block';
    deleteBtn.classList = 'deleteBtn btn btn-outline-danger btn-sm ml-2';
    updateBtn.classList = 'updateBtn d-none';
    cancelBtn.classList = 'cancelBtn d-none';
    saveBtn.classList = 'saveBtn d-none';

    e.preventDefault();
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
    const searchInput = document.querySelector(uiCtrl.selectors.searchInput);
    const addBtn = document.querySelector(uiCtrl.selectors.addBtn);
    const editBtn = document.querySelector(uiCtrl.selectors.editBtn);
    const deleteBtn = document.querySelector(uiCtrl.selectors.deleteBtn);

    const cancelBtn = document.querySelector(uiCtrl.selectors.cancelBtn);
    const updateBtn = document.querySelector(uiCtrl.selectors.updateBtn);
    const saveBtn = document.querySelector(uiCtrl.selectors.saveBtn);

    contactList.addEventListener('click', uiCtrl.changeCurrent);
    searchInput.addEventListener('keyup', uiCtrl.search);
    addBtn.addEventListener('click', stateCtrl.add);
    editBtn.addEventListener('click', stateCtrl.edit);
    deleteBtn.addEventListener('click', dataCtrl.delete);

    cancelBtn.addEventListener('click', stateCtrl.cancel);
    updateBtn.addEventListener('click', dataCtrl.update);
    saveBtn.addEventListener('click', dataCtrl.save);
  }
})();


// ==============================
// App controller
// ==============================
const appCtrl = ((dataCtrl, stateCtrl, uiCtrl, eCtrl) => {
  dataCtrl.fetchContacts();
})(dataCtrl, stateCtrl, uiCtrl, eCtrl);