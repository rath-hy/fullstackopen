import { useState, useEffect } from 'react'
import axios from 'axios'

const App = () => {
  const [persons, setPersons] = useState([])

  useEffect(() => {
    axios
      .get('http://localhost:3001/persons')
      .then((response) => {
        setPersons(response.data)
      })
  }, []);

  const [newName, setNewName] = useState('Elena')
  const [newNumber, setNewNumber] = useState('0')
  const [filter, setFilter] = useState('')

  const personsToShow = filter === '' ? persons : persons.filter(individual => individual.name.toLowerCase().includes(filter.toLowerCase()))

  const handleClick = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber};

    if (persons.some((person) => areTheseObjectsEqual(person, newPerson))) {
      window.alert(`${newPerson.name} already exists!`);
    }

    else {

      axios
        .post('http://localhost:3001/persons', newPerson)
        .then(response => {
          console.log(response);
          setPersons(persons.concat(response.data));
          setNewName('');
          setNewNumber('');
        })


      // setPersons(persons.concat(newPerson));
      // setNewName('');
      // setNewNumber('');
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
      <Persons persons={personsToShow}></Persons>
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

const Persons = ({persons = [{}]}) => {
  return (
    <table>
      <tbody>
      {persons.map(person => 
        <tr key={person.name}>
          <td>
          {person.name}
          </td>
          
          <td>
          {person.number}
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

function areTheseObjectsEqual(first, second) {
  "use strict";

  if (
    first === null ||
    first === undefined ||
    second === null ||
    second === undefined
  ) {
    return first === second;
  }

  if (first.constructor !== second.constructor) {
    return false;
  }

  if (first instanceof Function || first instanceof RegExp) {
    return first === second;
  }

  if (first === second || first.valueOf() === second.valueOf()) {
    return true;
  }

  if (first instanceof Date) return false;

  if (Array.isArray(first) && first.length !== second.length) {
    return false;
  }

  if (!(first instanceof Object) || !(second instanceof Object)) {
    return false;
  }

  const firstKeys = Object.keys(first);

  const allKeysExist = Object.keys(second).every(
    (i) => firstKeys.indexOf(i) !== -1
  );

  const allKeyValuesMatch = firstKeys.every((i) =>
    areTheseObjectsEqual(first[i], second[i])
  );

  return allKeysExist && allKeyValuesMatch;
}

export default App
