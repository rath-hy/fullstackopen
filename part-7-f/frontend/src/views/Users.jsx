import { useQuery } from "@tanstack/react-query"
import axios from "axios"

const Users = () => {
  const result = useQuery({
    queryKey: ['users'],
    queryFn: () => axios.get('http://localhost:3001/api/users').then(response => response.data)
  })

  const users = result.data

  if (!users) {
    return (
      <div>
        Fetching data...
      </div>
    )
  }

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
              <td>{user.name}</td>
              <td style={{textAlign:'center'}}>{user.blogs.length}</td>
            </tr>
          ))
        }
      </tbody>
    </table>
  )
}

export default Users