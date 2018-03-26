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
        changeCurrentContact: changeCurrentContact
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
            uc.displayCurrentContact(storedContacts);
            uc.setActiveListItem(storedContacts);
          }
        });

        console.clear();
        console.log(JSON.stringify(storedContacts, ['lastName', 'active'], 2));
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
        setInitialState: setInitialState
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
        contactDetails: '.contactDetails'
      };

      return {
        selectors: selectors,
        populateContactList: populateContactList,
        setActiveListItem: setActiveListItem,
        displayCurrentContact: displayCurrentContact
      };

      function populateContactList(storedContacts) {
        const contactList = document.querySelector(selectors.contactList);
        let content = '';

        if(storedContacts.length === 0) {
          console.log('No contacts');
        }
        else {
          storedContacts.forEach(contact => {
            content += `
              <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
                <span class="contact-name">${contact.firstName} <b>${contact.lastName}</b></span>
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
        storedContacts.forEach(contact => {

          if(contact.active === true) {
            const contactDetails = document.querySelector(selectors.contactDetails);
            let formEl = document.createElement('form');

            for(let key in contact) {
              if(contact[key] !== '' && key !== 'id' && key !== 'active') {
                const inputEl = document.createElement('input');

                inputEl.id = key;
                inputEl.classList = 'form-control-plaintext form-control-sm';
                inputEl.setAttribute('value', contact[key]);
                inputEl.setAttribute('readonly', true);

                formEl.appendChild(inputEl);
              }
            }

            if(contactDetails.hasChildNodes() === false) {
              contactDetails.appendChild(formEl);
            }
            else {
              contactDetails.innerHTML = '';
              contactDetails.appendChild(formEl);
            }
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
        const contactList = document.querySelector(uc.selectors.contactList);

        contactList.addEventListener('click', dc.changeCurrentContact);
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
    const dc = DataCtrl.getInstance();
    const sc = StateCtrl.getInstance();
    const ec = EventCtrl.getInstance();
    const lh = LogHelper.getInstance();

    sc.setInitialState();
    ec.loadEventListeners();

    // lh.listAllContacts();
    // lh.listFunctions();
  }());

}(this));