(function(window) {

  const HttpService = (function() {
    let instance;

    function init() {
      const apiUrl = 'http://localhost:3000/contacts';

      return {
        apiUrl: apiUrl,
        get: get,
        post: post,
        put: put,
        delete: del
      };

      function get(url) {
        return new Promise((res, rej) => {
          fetch(url)
            .then(res => res.json())
            .then(data => res(data))
            .catch(err => rej(err));
        });
      }

      function post(url, data) {
        return new Promise((res, rej) => {
          fetch(url, {
            method: 'POST',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(res => res.json())
            .then(data => res(data))
            .catch(err => rej(err));
        });
      }

      function put(url, data) {
        return new Promise((res, rej) => {
          fetch(url, {
            method: 'PUT',
            headers: {
              'Content-type': 'application/json'
            },
            body: JSON.stringify(data)
          })
            .then(res => res.json())
            .then(data => res(data))
            .catch(err => rej(err));
        });
      }

      function del(url) {
        return new Promise((res, rej) => {
          fetch(url, {
            method: 'DELETE',
            headers: {
              'Content-type': 'application/json'
            }
          })
            .then(res => res.json())
            .then(() => res('Resource deleted.'))
            .catch(err => rej(err));
        });
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const DataCtrl = (function() {
    let instance;

    function init() {
      const storedContacts = [];

      return {
        storedContacts: storedContacts, // Array
        sortContacts: sortContacts,
        setCurrentContact: setCurrentContact,
        changeCurrentContact: changeCurrentContact,
        update: update,
        save: save,
        delete: del
      };

      function sortContacts(a, b) {
        if(a.lastName < b.lastName) return -1;
        if(a.lastName > b.lastName) return 1;

        return 0;
      }

      function setCurrentContact(storedContacts) {
        storedContacts.forEach((contact, i) => {
          if(i === 0) {
            contact.active = true;
          }
          else {
            contact.active = false;
          }
        });
      }

      function changeCurrentContact(e) {
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const storedContacts = dc.storedContacts;
        let currentContact;

        storedContacts.forEach(contact => {
          contact.active = false;
        });

        if(e.key) {
          // switch(e.key) {
          //   case 'ArrowDown':
          //     console.log('Next in line.');
          //     break;
          //   case 'ArrowUp':
          //     console.log('Previous one.');
          //     break;
          //   default:
          //     console.log('Not a valid keyboard action.');
          // }

          // e.preventDefault();
        }
        else {
          storedContacts.forEach(contact => {
            if(parseInt(e.target.id, 10) === contact.id) {
              contact.active = true;
              currentContact = contact;
              uc.setActiveListItem(storedContacts);
              uc.displayCurrentContact(storedContacts);
            }
          });
        }
      }

      function update(e) {
        const hs = HttpService.getInstance();
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const apiUrl = hs.apiUrl;
        const storedContacts = dc.storedContacts;
        const inputs = document.querySelectorAll(uc.selectors.input);
        let [keys, values] = [[], []];
        let updatedContactDetails = {};

        inputs.forEach(input => {
          if(input.dataset.contactRelated === 'true') {
            keys.push(input.id);
            values.push(input.value);
          }
        });

        keys.forEach((key, i) => {
          updatedContactDetails[key] = values[i];
        });

        storedContacts.forEach(contact => {
          if(contact.id === parseInt(updatedContactDetails.id, 10)) {
            hs.put(`${apiUrl}/${contact.id}`, updatedContactDetails);
          }
        });

        e.preventDefault();
      }

      function save(e) {
        const hs = HttpService.getInstance();
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const apiUrl = hs.apiUrl;
        const storedContacts = dc.storedContacts;
        const inputs = document.querySelectorAll(uc.selectors.input);
        let [keys, values] = [[], []];
        let newContactDetails = {};

        inputs.forEach(input => {
          if(input.dataset.contactRelated === 'true') {
            keys.push(input.id);
            values.push(input.value);
          }
        });

        keys.forEach((key, i) => {
          newContactDetails[key] = values[i];
        });

        hs.post(apiUrl, newContactDetails);

        e.preventDefault();
      }

      function del(e) {
        const hs = HttpService.getInstance();
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const apiUrl = hs.apiUrl;
        const storedContacts = dc.storedContacts;
        const currentContactId = parseInt(document.querySelector(uc.selectors.currentContactId).value, 10);

        if(confirm('Are you sure you want to delete this contact?')) {
          storedContacts.forEach(contact => {
            if(contact.id === currentContactId) {
              hs.delete(`${apiUrl}/${contact.id}`);
            }
          });
        }

        e.preventDefault();
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const StateCtrl = (function() {
    let instance;

    function init() {

      return {
        setInitialState: setInitialState,
        toAddState: toAddState,
        toEditState: toEditState,
        cancel: cancel
      };

      function setInitialState() {
        const hs = HttpService.getInstance();
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const ec = EventCtrl.getInstance();
        let storedContacts = dc.storedContacts;

        hs.get(hs.apiUrl)
          .then(contacts => {
            contacts.forEach(contact => {
              storedContacts.push(contact);
              storedContacts.sort(dc.sortContacts);
            });
            dc.setCurrentContact(storedContacts);
            uc.populateContactList(storedContacts);
            uc.displayCurrentContact(storedContacts);
          });
      }

      function toAddState() {
        dc = DataCtrl.getInstance();
        uc = UICtrl.getInstance();
        ec = EventCtrl.getInstance();
        let defaultForm = document.querySelector(uc.selectors.defaultForm);
        let saveBtn = document.querySelector(uc.selectors.saveBtn);
        let cancelBtn = document.querySelector(uc.selectors.cancelBtn);
        let editBtn = document.querySelector(uc.selectors.editBtn);
        let deleteBtn = document.querySelector(uc.selectors.deleteBtn);
        let inputs = document.querySelectorAll(uc.selectors.input);

        defaultForm.removeEventListener('submit', dc.delete);
        defaultForm.classList = 'addForm';
        ec.loadAddEvtListeners();

        [saveBtn, cancelBtn] = [
          saveBtn.classList = 'btn btn-sm saveBtn btn-outline-success',
          cancelBtn.classList = 'btn btn-sm cancelBtn btn-outline-dark mr-2'
        ];

        [editBtn, deleteBtn] = [
          editBtn.classList += ' d-none',
          deleteBtn.classList += ' d-none'
        ];

        inputs.forEach(input => {
          if(input.dataset.contactRelated === 'true') {
            input.value = '';
            input.removeAttribute('readonly');
            input.classList = 'form-control form-control-sm';

            if(input.id === 'firstName') {
              input.select();
            }
          }
        });
      }

      function toEditState() {
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const ec = EventCtrl.getInstance();
        const storedContacts = dc.storedContacts;
        let defaultForm = document.querySelector(uc.selectors.defaultForm);
        let updateBtn = document.querySelector(uc.selectors.updateBtn);
        let cancelBtn = document.querySelector(uc.selectors.cancelBtn);
        let editBtn = document.querySelector(uc.selectors.editBtn);
        let deleteBtn = document.querySelector(uc.selectors.deleteBtn);
        let inputs = document.querySelectorAll(uc.selectors.input);

        defaultForm.removeEventListener('submit', dc.delete);
        defaultForm.classList = 'editForm';
        ec.loadEditEvtListeners();

        [updateBtn, cancelBtn] = [
          updateBtn.classList = 'btn btn-sm updateBtn btn-outline-success',
          cancelBtn.classList = 'btn btn-sm cancelBtn btn-outline-dark mr-2'
        ];

        [editBtn, deleteBtn] = [
          editBtn.classList += ' d-none',
          deleteBtn.classList += ' d-none'
        ];

        inputs.forEach(input => {
          if(input.dataset.contactRelated === 'true') {
            input.removeAttribute('readonly');
            input.classList = 'form-control form-control-sm';

            if(input.id === 'firstName') {
              input.select();
            }
          }
        });
      }

      function cancel() {
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
        const ec = EventCtrl.getInstance();
        const storedContacts = dc.storedContacts;
        let defaultForm = document.querySelector(uc.selectors.defaultForm);
        let addForm = document.querySelector(uc.selectors.addForm);
        let editForm = document.querySelector(uc.selectors.editForm);
        let editBtn = document.querySelector(uc.selectors.editBtn);
        let saveBtn = document.querySelector(uc.selectors.saveBtn);
        let deleteBtn = document.querySelector(uc.selectors.deleteBtn);
        let updateBtn = document.querySelector(uc.selectors.updateBtn);
        let cancelBtn = document.querySelector(uc.selectors.cancelBtn);
        let inputs = document.querySelectorAll(uc.selectors.input);

        if(confirm('Are you sure you want to cancel? All changes will be lost.')) {
          if(addForm) {
            addForm.removeEventListener('submit', dc.save);
            addForm.classList = 'defaultForm';

            [saveBtn, cancelBtn] = [
              saveBtn.classList += ' d-none',
              cancelBtn.classList += ' d-none'
            ];
          }
          else {
            editForm.removeEventListener('submit', dc.update);
            editForm.classList = 'defaultForm';

            [updateBtn, cancelBtn] = [
              updateBtn.classList += ' d-none',
              cancelBtn.classList += ' d-none'
            ];
          }

          [editBtn, deleteBtn] = [
            editBtn.classList = 'btn btn-sm editBtn btn-outline-dark mr-2',
            deleteBtn.classList = 'btn btn-sm deleteBtn btn-outline-danger'
          ];

          ec.loadDefaultEvtListeners();

          inputs.forEach(input => {
            if(input.dataset.contactRelated === 'true') {
              input.setAttribute('readonly', true);
              input.classList = 'form-control-plaintext form-control-sm';
              document.location.reload();
            }
          });
        }
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const UICtrl = (function() {
    let instance;

    function init() {
      const selectors = {
        contactList: '.contactList',
        contactListItem: '.contactListItem',
        contactName: '.contactName',
        contactDetails: '.contactDetails',
        currentContactId: '#id',
        searchInput: '.searchInput',

        defaultForm: '.defaultForm',
        addForm: '.addForm',
        editForm: '.editForm',

        editBtn: '.editBtn',
        cancelBtn: '.cancelBtn',

        addBtn: '.addBtn',
        saveBtn: '.saveBtn',
        updateBtn: '.updateBtn',
        deleteBtn: '.deleteBtn',

        input: 'input'
      };

      return {
        selectors: selectors, // Object
        populateContactList: populateContactList,
        setActiveListItem: setActiveListItem,
        displayCurrentContact: displayCurrentContact,
        searchContact: searchContact
      };

      function populateContactList(storedContacts) {
        const contactList = document.querySelector(selectors.contactList);
        let content = '';

        if(storedContacts.length === 0) {
          for(let i = 0; i < 20; i++) {
            const liEl = document.createElement('li');
            liEl.classList = 'contactListItem list-group-item';
            liEl.style.height = 50 + 'px';
            contactList.appendChild(liEl);
          }
        }
        else {
          storedContacts.forEach(contact => {
            const spanEl = document.createElement('span');
            const bEl = document.createElement('b');
            const liEl = document.createElement('li');
            let bufferedLastName;

            bufferedLastName = ` ${contact.lastName}`;
            bEl.textContent = bufferedLastName;

            spanEl.classList = 'contactName';
            spanEl.textContent = contact.firstName;
            spanEl.insertAdjacentElement('beforeend', bEl);

            liEl.id = contact.id;
            liEl.classList = 'contactListItem list-group-item list-group-item-action';
            liEl.appendChild(spanEl);
            contactList.appendChild(liEl);
          });

          setActiveListItem(storedContacts);
        }
      }

      function setActiveListItem(storedContacts) {
        const contactListItems = document.querySelectorAll(selectors.contactListItem);
        let activeContact;

        storedContacts.forEach(contact => {
          if(contact.active === true) {
            activeContact = contact;
          }
        });

        contactListItems.forEach(contactListItem => {
          if(parseInt(contactListItem.id, 10) === activeContact.id) {
            contactListItem.classList += ' active';
          }
          else {
            contactListItem.classList = 'contactListItem list-group-item list-group-item-action';
          }
        });
      }

      function displayCurrentContact(storedContacts) {
        const uc = UICtrl.getInstance();
        const ec = EventCtrl.getInstance();

        if(storedContacts.length === 0) {
          const contactDetails = document.querySelector(uc.selectors.contactDetails);
          const divEl = document.createElement('div');
          const message = 'You have no contacts. Add one!';

          divEl.classList += ' my-auto mx-auto text-center text-muted h4';
          divEl.textContent = message;
          contactDetails.appendChild(divEl);
        }
        else {
          storedContacts.forEach(contact => {

            // Display active contact
            if(contact.active === true) {
              const contactDetails = document.querySelector(selectors.contactDetails);
              const formEl = document.createElement('form');
              const jumbotronEl = document.createElement('div');
              const formBtn = _buildFormButtons();
              const contactDetailsBodyEl = document.createElement('div');

              // Discount active, id, and empty properties
              for(let key in contact) {
                if(key !== 'active' && contact[key] !== '') {
                  const fh = FormatHelper.getInstance();
                  const containerEl = document.createElement('div');
                  const rowEl = document.createElement('div');
                  const inputColEl = document.createElement('div');
                  const labelEl = document.createElement('label');
                  const inputEl = document.createElement('input');
                  const contactRelated = (
                    key === 'id' ||
                    key === 'firstName' ||
                    key === 'lastName' ||
                    key === 'phoneNumber' ||
                    key === 'emailAddress' ||
                    key === 'dateOfBirth' ||
                    key === 'street' ||
                    key === 'city' ||
                    key === 'region' ||
                    key === 'postalCode' ||
                    key === 'country'
                  );
                  let forVal;

                  // Build labels
                  labelEl.classList = 'col-sm-3 col-form-label-sm font-weight-bold';
                  labelEl.setAttribute('for', key);
                  labelEl.textContent = key;

                  rowEl.classList = 'row';
                  rowEl.insertAdjacentElement('afterbegin', labelEl);
                  rowEl.insertAdjacentElement('beforeend', inputColEl);

                  // Build inputs
                  inputEl.id = key;
                  inputEl.classList = 'form-control-plaintext form-control-sm';
                  inputEl.setAttribute('value', contact[key]);
                  inputEl.setAttribute('readonly', true);

                  if(contactRelated) {
                    inputEl.setAttribute('data-contact-related', true);
                  }
                  else {
                    inputEl.setAttribute('data-contact-related', false);
                  }

                  inputColEl.classList = 'col-sm-9';
                  inputColEl.insertAdjacentElement('afterbegin', inputEl);

                  // Insert into form sections
                  forVal = rowEl.firstChild.attributes[1].value;
                  if(forVal === 'firstName' || forVal === 'lastName') {
                    jumbotronEl.classList = 'jumbotron jumbotron-fluid';
                    jumbotronEl.appendChild(rowEl);
                    jumbotronEl.appendChild(formBtn);
                  }
                  else {
                    contactDetailsBodyEl.classList = 'contactDetailsBody';
                    contactDetailsBodyEl.appendChild(rowEl);

                    if(rowEl.children[1].children[0].id === 'id') {
                      rowEl.classList += ' d-none';
                    }
                  }

                  formEl.classList = 'defaultForm';
                  formEl.appendChild(jumbotronEl);
                  formEl.appendChild(contactDetailsBodyEl);
                }
              }

              // Insert sections into form
              if(contactDetails.hasChildNodes() === false) {
                contactDetails.appendChild(formEl);
              }
              else {
                contactDetails.innerHTML = '';
                contactDetails.appendChild(formEl);
              }
            }
          });

          ec.loadDefaultEvtListeners();
        }

        function _buildFormButtons() {
          const rowEl = document.createElement('div');
          const btnsContent = ['Edit', 'Cancel'];
          const inputsContent = ['Update',  'Save', 'Delete'];

          for(let i = 0; i < btnsContent.length; i++) {
            const btnEl = document.createElement('button');

            btnEl.setAttribute('type', 'button');
            btnEl.classList = 'btn btn-sm';

            switch(btnsContent[i]) {
              case 'Edit':
                btnEl.classList += ' editBtn btn-outline-dark mr-2';
                break;
              case 'Cancel':
                btnEl.classList += ' cancelBtn btn-outline-dark d-none';
                break;
              default:
                alert('Not a valid input[type="button"].');
            }

            btnEl.textContent = btnsContent[i];

            rowEl.appendChild(btnEl);
          }

          for(let j = 0; j < inputsContent.length; j++) {
            const inputEl = document.createElement('input');

            inputEl.setAttribute('type', 'submit');
            inputEl.classList = 'btn btn-sm';

            switch(inputsContent[j]) {
              case 'Update':
                inputEl.classList += ' updateBtn btn-outline-dark mr-2 d-none';
                break;
              case 'Save':
                inputEl.classList += ' saveBtn btn-outline-success d-none';
                break;
              case 'Delete':
                inputEl.classList += ' deleteBtn btn-outline-danger';
                break;
              default:
                alert('Not a valid input[type="submit"].');
            }

            inputEl.value = inputsContent[j];
            rowEl.appendChild(inputEl);
          }

          rowEl.classList = 'd-flex justify-content-center';

          return rowEl;
        }
      }

      function searchContact(e) {
        const dc = DataCtrl.getInstance();
        const storedContacts = dc.storedContacts;
        const contactList = document.querySelector(selectors.contactList);
        const contactNames = document.querySelectorAll(selectors.contactName);
        let searchInput = e.target.value.toUpperCase();
        let results = 0;

        // Ignore these
        switch(e.key) {
          case 'Shift':
          case 'Control':
          case 'Alt':
          case 'Meta':
            return;
        }

        contactNames.forEach(contactName => {
          if(contactName.textContent.toUpperCase().indexOf(searchInput) === -1) {
            contactName.parentElement.style.display = 'none';
          }
          else {
            contactName.parentElement.style.display = 'block';
            results++;

            if(document.querySelector('.noResult')) {
              document.querySelector('.noResult').remove();
            }
          }
        });

        if(results === 0) {
          const divEl = document.createElement('div');
          const message = 'No results.';

          divEl.classList = 'mx-auto text-muted noResult';
          divEl.textContent = message;
          contactList.insertAdjacentElement('afterbegin', divEl);
        }
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const EventCtrl = (function() {
    let instance;

    function init() {

      return {
        loadDefaultEvtListeners: loadDefaultEvtListeners,
        loadAddEvtListeners: loadAddEvtListeners,
        loadEditEvtListeners: loadEditEvtListeners
      };

      function loadDefaultEvtListeners() {
        const dc = DataCtrl.getInstance();
        const sc = StateCtrl.getInstance();
        const uc = UICtrl.getInstance();

        const storedContacts = dc.storedContacts;

        const searchInput = document.querySelector(uc.selectors.searchInput);
        const contactList = document.querySelector(uc.selectors.contactList);

        const defaultForm = document.querySelector(uc.selectors.defaultForm);
        const addBtn = document.querySelector(uc.selectors.addBtn);
        const editBtn = document.querySelector(uc.selectors.editBtn);

        searchInput.addEventListener('keyup', uc.searchContact);
        contactList.addEventListener('click', dc.changeCurrentContact);

        // CRUD
        defaultForm.addEventListener('submit', dc.delete);

        // State swaping
        addBtn.addEventListener('click', sc.toAddState);
        editBtn.addEventListener('click', sc.toEditState);

        // Navigation
        window.addEventListener('keydown', dc.changeCurrentContact);
      }

      function loadAddEvtListeners() {
        const dc = DataCtrl.getInstance();
        const sc = StateCtrl.getInstance();
        const uc = UICtrl.getInstance();

        const addForm = document.querySelector(uc.selectors.addForm);
        const cancelBtn = document.querySelector(uc.selectors.cancelBtn);

        // CRUD
        addForm.addEventListener('submit', dc.save);

        // State swaping
        cancelBtn.addEventListener('click', sc.cancel);
      }

      function loadEditEvtListeners() {
        const dc = DataCtrl.getInstance();
        const sc = StateCtrl.getInstance();
        const uc = UICtrl.getInstance();

        const editForm = document.querySelector(uc.selectors.editForm);
        const cancelBtn = document.querySelector(uc.selectors.cancelBtn);

        // CRUD
        editForm.addEventListener('submit', dc.update);

        // State swaping
        cancelBtn.addEventListener('click', sc.cancel);
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const FormatHelper = (function() {
    let instance;

    function init() {

      return {
        toTitleCase: toTitleCase
      };

      function toTitleCase(input) {
        let output;

        return output;
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const LogHelper = (function() {
    let instance;

    function init() {
      const [hs, dc, sc, uc, ec] = [
        HttpService.getInstance(),
        DataCtrl.getInstance(),
        StateCtrl.getInstance(),
        UICtrl.getInstance(),
        EventCtrl.getInstance()
      ];

      return {
        listAllContacts: listAllContacts,
        listFunctions: listFunctions
      };

      function listAllContacts() {
        console.log(dc.storedContacts);
      }

      function listFunctions() {
        console.log(hs);
        console.log(dc);
        console.log(sc);
        console.log(uc);
        console.log(ec);
      }
    }

    return {
      getInstance: () => {
        if(!instance) {
          instance = init();
        }

        return instance;
      }
    };
  }());

  const AppCtrl = (function() {
    const sc = StateCtrl.getInstance();
    const lh = LogHelper.getInstance();

    sc.setInitialState();

    // lh.listAllContacts();
    // lh.listFunctions();
  }());

}(this));