import { useState } from 'react'

const App = () => {
  // const [persons, setPersons] = useState([
  //   { name: 'James Bond', number: '123-456-007' }
  // ]) 


  const [persons, setPersons] = useState([
    { name: 'Arto Hellas', number: '040-123456', id: 1 },
    { name: 'Ada Lovelace', number: '39-44-5323523', id: 2 },
    { name: 'Dan Abramov', number: '12-43-234345', id: 3 },
    { name: 'Mary Poppendieck', number: '39-23-6423122', id: 4 }
  ])


  const [newName, setNewName] = useState('Elena')

  const [newNumber, setNewNumber] = useState('0')

  const [filter, setFilter] = useState('')

  const handleClick = (event) => {
    event.preventDefault();
    const newPerson = { name: newName, number: newNumber};

    if (persons.some((person) => areTheseObjectsEqual(person, newPerson))) {
      window.alert(`${newPerson.name} already exists!`);
    }

    else {
      setPersons(persons.concat(newPerson));
      setNewName('');
      setNewNumber('');
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


  const personsToShow = filter === '' ? persons : persons.filter( individual => individual.name.toLowerCase().includes(filter.toLowerCase()) )

  return (
    <div>
      <h2>Phonebook</h2>

      {/* filter */}
      filter shown with 
      <input value={filter} onChange={handleFilterInputChange}/>



      <h3>Add a new</h3>

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


      <h2>Numbers</h2>
      <Persons persons={personsToShow}></Persons>
    </div>
  );
}

// are the outside tags necessary?
const PersonForm = () => {
  return (
    <>

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




const Filter = () => {
  return (
    <>

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
