import { useQuery } from "@tanstack/react-query"
import axios from "axios"
import { Link } from 'react-router-dom'


const Users = ({users}) => {
  return (
    <table>
      <thead>
        <tr>
          <th>Name</th>
          <th>Blogs created</th>
        </tr>
      </thead>

      <tbody>
        {users.map(user => (
            <tr key={user.id}>
              <td><Link to={`/users/${user.id}`} > {user.name}</Link></td>
              <td style={{textAlign:'center'}}>{user.blogs.length}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default Users