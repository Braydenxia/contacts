import { useEffect, useState } from 'react';
import Web3 from 'web3';
import { CONTACT_ABI, CONTACT_ADDRESS } from './config';

function App() {
  const [account, setAccount] = useState();
  const [contactList, setContactList] = useState();
  const [contacts, setContacts] = useState([]);
  
  useEffect(() => {
    async function load() {
      const web3 = new Web3(Web3.givenProvider || 'https://ropsten.infura.io/v3/6b165dae869a415bbc4a6c1dd99c92ad');
      const accounts = await web3.eth.requestAccounts();
      setAccount(accounts[0]);
      // Instantiate smart contract using ABI and address.
      const contactList = new web3.eth.Contract(CONTACT_ABI, CONTACT_ADDRESS);
      // set contact list to state variable.
      setContactList(contactList);
      //
      // create a new contact
      // const counter = await contactList.methods.createContact('Apple', web3.utils.asciiToHex('123456789')).call();
      
      // const counter = await contactList.methods.createContact('hello kitty', '666666666').send({"from": account});
      // const counter = await contactList.createContactWithNumber(2);
      // Then we get total number of contacts for iteration
      const counter = await contactList.methods.count().call();
      console.log(counter);
      //const counter = 0;
      // iterate through the amount of time of counter
      for (var i = 1; i <= counter; i++) {
        // call the contacts method to get that particular contact from smart contract
        const contact = await contactList.methods.contacts(i).call();
        const msg = await contactList.methods.messages(i).call();
        console.log(msg);
        // add recently fetched contact to state variable.
        setContacts((contacts) => [...contacts, contact]);
      }
    }

    load();
    
  }, []);

  console.log(contacts);
  return (
    <div>
      Your account is: {account}
      <h1>Contacts</h1>
      
      <ul>
      {
        Object.keys(contacts).map((contact, index) => (
          <li key={`${contacts[index].name}-${index}`}>
            <h4>{contacts[index].name}</h4>
            <span><b>Phone: </b>{contacts[index].phone}</span>
          </li>
        ))
      }
      </ul>
    </div>
  );
}

export default App;