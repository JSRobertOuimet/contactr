(function(window) {

  const HttpService = (function() {
    let instance;

    function init() {

      return {
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
        storedContacts: storedContacts
      };
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
      const apiUrl = 'http://localhost:3000/contacts';

      return {
        setInitialState: setInitialState
      };

      function _sortContacts(a, b) {
        if(a.lastName < b.lastName) {
          return -1;
        }
        if(a.lastName > b.lastName) {
          return 1;
        }

        return 0;
      }

      function setInitialState() {
        const httpS = HttpService.getInstance();
        const dc = DataCtrl.getInstance();
        const uic = UICtrl.getInstance();
        let storedContacts = dc.storedContacts;

        httpS.get(apiUrl)
          .then(contacts => {
            contacts.forEach(contact => {
              storedContacts.push(contact);
              storedContacts.sort(_sortContacts);
            });

            uic.populateContactList(storedContacts);
            // uic.displayCurrentDetails();
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
        contactList: '.contactList'
      };

      return {
        selectors: selectors,
        populateContactList: populateContactList
      };

      function populateContactList(allContacts) {
        const contactList = document.querySelector(selectors.contactList);
        let content = '';

        if(allContacts.length === 0) {
          console.log('No contacts');
        }
        else {
          allContacts.forEach(contact => {
            content += `
              <li id="${contact.id}" class="contactListItem list-group-item list-group-item-action">
                <span class="contact-name">${contact.firstName} <b>${contact.lastName}</b></span>
              </li>`;
          });

          contactList.innerHTML = content;
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
    }
  }());

  const AppCtrl = (function() {
    const sc = StateCtrl.getInstance();

    sc.setInitialState();
  }());

}(this));