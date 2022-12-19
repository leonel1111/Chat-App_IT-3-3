const users = []

// add user, remove user, getUser, getUsersinRoom

const addUser = ({ id, username, room }) => {
    // clean the data
    username = username.trim().toLowerCase()
    room = room.trim().toLowerCase()

    //validate the data
    if (!username || !room) {
        return {
            error: 'Username and Room are required!'
        }
    }
    //check for existing users
    const existingUser = users.find((user) => {
        return user.room === room && user.username === username
    })

    //validate username
    if (existingUser) {
        return {
            error: 'Username is taken'
        }
    }

    //store user
    const user = { id, username, room }
    users.push(user)
    return { user }
}

const removeUser = (id) => {
    const index = users.findIndex((user) => user.id === id)
    if (index !== -1) {
        return users.splice(index, 1)[0]
    }
 }

addUser({
    id: 10,
    username: 'leonel',
    room: 'kk'
})

console.log(users)

const removedUser = removeUser(10)

console.log(removeUser)
console.log(users)