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

        storedContacts.forEach(contact => {
          contact.active = false;
        });

        storedContacts.forEach(contact => {
          if(parseInt(e.target.id, 10) === contact.id) {
            contact.active = true;
            uc.setActiveListItem(storedContacts);
            uc.displayCurrentContact(storedContacts);
          }
        });
      }

      function update(e) {
        console.log(e.target);
        e.preventDefault();
      }

      function save(e) {
        console.log(e.target);
        e.preventDefault();
      }

      function del(e) {
        console.log(e.target);
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
        edit: edit,
        cancel: cancel
      };

      function setInitialState() {
        const hs = HttpService.getInstance();
        const dc = DataCtrl.getInstance();
        const uc = UICtrl.getInstance();
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

      function edit(e) {
        console.log(e.target);
        e.preventDefault();
      }

      function cancel(e) {
        console.log(e.target);
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

  const UICtrl = (function() {
    let instance;

    function init() {
      const selectors = {
        contactList: '.contactList',
        contactListItem: '.contactListItem',
        contactName: '.contactName',
        contactDetails: '.contactDetails',
        searchInput: '.searchInput',
        editBtn: '.editBtn',
        updateBtn: '.updateBtn',
        cancelBtn: '.cancelBtn',
        saveBtn: '.saveBtn',
        deleteBtn: '.deleteBtn'
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
          alert('Empty state needed!');
        }
        else {
          storedContacts.forEach(contact => {
            content += `
              <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
                <span class="contactName">${contact.firstName} <b>${contact.lastName}</b></span>
              </li>`;
          });

          contactList.innerHTML = content;

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
        const ec = EventCtrl.getInstance();

        storedContacts.forEach(contact => {

          // Display active contact
          if(contact.active === true) {
            const contactDetails = document.querySelector(selectors.contactDetails);
            const formEl = document.createElement('form');
            const jumbotronEl = document.createElement('div');
            const formBtn = _buildFormButtons();
            const contactDetailsBodyEl = document.createElement('div');

            // Discount id, active and empty properties
            for(let key in contact) {
              if(key !== 'id' && key !== 'active' && contact[key] !== '') {
                const fh = FormatHelper.getInstance();
                const containerEl = document.createElement('div');
                const rowEl = document.createElement('div');
                const inputColEl = document.createElement('div');
                const labelEl = document.createElement('label');
                const inputEl = document.createElement('input');
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
                }

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

        ec.loadEventListeners();

        function _buildFormButtons() {
          const rowEl = document.createElement('div');
          const btnsContent = ['Edit', 'Update', 'Cancel', 'Save', 'Delete'];

          for(let i = 0; i < btnsContent.length; i++) {
            const btnEl = document.createElement('button');

            btnEl.classList = 'btn btn-sm';

            switch(btnsContent[i]) {
              case 'Edit':
              btnEl.classList += ' editBtn btn-outline-dark mr-2';
              break;

              case 'Update':
              btnEl.classList += ' updateBtn btn-outline-dark mr-2 d-none';
              break;

              case 'Cancel':
              btnEl.classList += ' cancelBtn btn-outline-dark d-none';
              break;

              case 'Save':
              btnEl.classList += ' saveBtn btn-outline-success d-none';
              break;

              case 'Delete':
              btnEl.classList += ' deleteBtn btn-outline-danger';
              break;

              default:
              alert('Not a valid button.');
            }

            btnEl.textContent = btnsContent[i];

            rowEl.appendChild(btnEl);
          }

          rowEl.classList = 'd-flex justify-content-center';

          return rowEl;
        }
      }

      function searchContact(e) {
        const contactNames = document.querySelectorAll(selectors.contactName);
        let searchInput = e.target.value;
        let filteredContacts = document.querySelectorAll(selectors.contactListItem);

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
        loadEventListeners: loadEventListeners
      };

      function loadEventListeners() {
        const uc = UICtrl.getInstance();
        const dc = DataCtrl.getInstance();
        const sc = StateCtrl.getInstance();

        const contactList = document.querySelector(uc.selectors.contactList);
        const updateBtn = document.querySelector(uc.selectors.updateBtn);
        const saveBtn = document.querySelector(uc.selectors.saveBtn);
        const deleteBtn = document.querySelector(uc.selectors.deleteBtn);

        const searchInput = document.querySelector(uc.selectors.searchInput);

        const editBtn = document.querySelector(uc.selectors.editBtn);
        const cancelBtn = document.querySelector(uc.selectors.cancelBtn);

        contactList.addEventListener('click', dc.changeCurrentContact);
        updateBtn.addEventListener('click', dc.update);
        saveBtn.addEventListener('click', dc.save);
        deleteBtn.addEventListener('click', dc.delete);

        searchInput.addEventListener('keyup', uc.searchContact);

        editBtn.addEventListener('click', sc.edit);
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

  // To Add ==========
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