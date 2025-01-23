import { useState, useEffect } from 'react'
import phonebookService from './services/phonebook'


const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    phonebookService
      .getAll()
      .then((response) => {
        setPersons(response.data)
      })
  }, []);

  const [newName, setNewName] = useState('Elena')
  const [newNumber, setNewNumber] = useState('0')
  const [filter, setFilter] = useState('')


  const [message, setMessage] = useState(null)


  const successsMessageStyle = {
    color: 'green',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const failureMessageStyle = {
    color: 'red',
    background: 'lightgrey',
    fontSize: 20,
    borderStyle: 'solid',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  }

  const [messageStyle, setMessageStyle] = useState(successsMessageStyle);


  const personsToShow = filter === '' ? persons : persons.filter(individual => individual.name.toLowerCase().includes(filter.toLowerCase()))


  const deletePerson = (person) => {
    if (window.confirm(`Are you sure you want to delete ${person.name}?`))
    phonebookService
      .remove(person.id)
      .then( () => {
        setPersons(persons.filter( thisPerson => thisPerson.id !== person.id) )
      })
  }

  const samePerson = (personA, personB) => {
    return ((personA.name.toLowerCase() === personB.name.toLowerCase())
      && (personA.number === personB.number)
    );
  }

  const handleClick = (event) => {
    event.preventDefault();
    const newPerson = {name: newName, number: newNumber};

    //same name (case insensitive) AND same number
    if (persons.some((thisPerson) => samePerson(thisPerson, newPerson))) {
      window.alert(`${newPerson.name} already exists!`);
    }

    else {
      //same name but different number
      const existingPerson = persons.find(thisPerson => thisPerson.name.toLowerCase() === newPerson.name.toLowerCase());

      if (existingPerson) {
        if (window.confirm(`${existingPerson.name} is already added to the phonebook. Replace old number with new one?`)) {
          
          setMessageStyle(successsMessageStyle);
          setMessage(`${newPerson.name}'s number successfully changed.`);
          setTimeout(() => {setMessage(null)}, 1200);


          phonebookService
            .update(existingPerson.id, newPerson)
            .then(response => {
              setPersons(persons.map(person => person.id === existingPerson.id ? response.data : person))
            })
            .catch(error => {
              setMessageStyle(failureMessageStyle);
              setMessage(`${existingPerson.name} does not exist.`);
              setTimeout(() => {setMessage(null)}, 3000);
            })

          setNewName('');
          setNewNumber('');
        }
      } 

      else {
        phonebookService
        .create(newPerson)
        .then(response => {
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
        })

        setMessage(`${newPerson.name} successfully added.`);
        setTimeout(() => {setMessage(null)}, 1200);
      }
    }
  }

  const handleNameInputChange = (event) => {
    const nameToAdd = event.target.value;
    setNewName(nameToAdd);
  }

  const handleNumberInputChange = (event) => {
    const numberToAdd = event.target.value;
    setNewNumber(numberToAdd);
  }

  const handleFilterInputChange = (event) => {
    setFilter(event.target.value);
  }

  return (
    <div>
      {/* messageType might be redundant lmao */}
      <Notification message={message} messageStyle={messageStyle}/>


      <h2>Phonebook</h2>
      <Filter filter={filter} handleFilterInputChange={handleFilterInputChange}/>

      <h3>Add a new</h3>
      <PersonForm newName={newName}
        handleNameInputChange={handleNameInputChange}
        newNumber={newNumber}
        handleNumberInputChange={handleNumberInputChange}
        handleClick={handleClick}
      />

      <h2>Numbers</h2>
      <Persons persons={personsToShow} deletePerson={deletePerson}></Persons>
    </div>
  );
}

const PersonForm = ({newName, handleNameInputChange, newNumber, handleNumberInputChange, handleClick}) => {
  return (
    <>
      <form>
        <div>
          name: <input value={newName} onChange={handleNameInputChange}/>
        </div>

        <div>
          number: <input value={newNumber} onChange={handleNumberInputChange}/>
        </div>
    
        <div>
          <button type="submit" onClick={handleClick}>add</button>
        </div>
      </form>
    </>
  );
}

const Persons = ({persons = [{}], deletePerson}) => {
  return (
    <table>
      <tbody>
      {persons.map(person => 
        <tr key={person.id}>
          <td>
          {person.name}
          </td>
          
          <td>
          {person.number}
          </td>

          <td>
            <button onClick={() => deletePerson(person)}>Delete</button>
          </td>


        </tr>)}
      </tbody>
    </table>
  );
}

const Filter = ({filter, handleFilterInputChange}) => {
  return (
    <>
      filter shown with 
      <input value={filter} onChange={handleFilterInputChange}/>
    </>
  );
}

// function areTheseObjectsEqual(first, second) {
//   "use strict";

//   if (
//     first === null ||
//     first === undefined ||
//     second === null ||
//     second === undefined
//   ) {
//     return first === second;
//   }

//   if (first.constructor !== second.constructor) {
//     return false;
//   }

//   if (first instanceof Function || first instanceof RegExp) {
//     return first === second;
//   }

//   if (first === second || first.valueOf() === second.valueOf()) {
//     return true;
//   }

//   if (first instanceof Date) return false;

//   if (Array.isArray(first) && first.length !== second.length) {
//     return false;
//   }

//   if (!(first instanceof Object) || !(second instanceof Object)) {
//     return false;
//   }

//   const firstKeys = Object.keys(first);

//   const allKeysExist = Object.keys(second).every(
//     (i) => firstKeys.indexOf(i) !== -1
//   );

//   const allKeyValuesMatch = firstKeys.every((i) =>
//     areTheseObjectsEqual(first[i], second[i])
//   );

//   return allKeysExist && allKeyValuesMatch;
// }

const Notification = ({message, messageType, messageStyle}) => {
  if (message === null) {
    return null;
  }

  return (
    <div className={messageType} style={messageStyle}>
      {message}
    </div>
  );
}

export default App
