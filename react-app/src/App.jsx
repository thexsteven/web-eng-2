import UserCard from './components/UserCard/UserCard.jsx'
import Counter from './components/Counter/Counter.jsx'
import AlertInput from './components/AlertInput/AlertInput.jsx'
import './App.css'

const users = [
  { id: 1, name: 'Anna Schmidt', age: 24, imageUrl: 'https://i.pravatar.cc/150?img=47', isOnline: true },
  { id: 2, name: 'Max Müller', age: 31, imageUrl: 'https://i.pravatar.cc/150?img=12', isOnline: false },
  { id: 3, name: 'Lena Weber', age: 27, imageUrl: 'https://i.pravatar.cc/150?img=32', isOnline: true },
  { id: 4, name: 'Tom Becker', age: 45, imageUrl: 'https://i.pravatar.cc/150?img=68', isOnline: false },
]

function App() {
  return (
    <main className="app">
      <h1>Hello World</h1>

      <h2>Counter</h2>
      <Counter />

      <h2>Eingabe mit Alert</h2>
      <AlertInput />

      {/* Einzelne Instanz mit direkt übergebenen Props */}
      <UserCard
        name="Erika Mustermann"
        age={29}
        imageUrl="https://i.pravatar.cc/150?img=15"
        isOnline={true}
      />

      <h2>Alle Benutzer</h2>
      <section className="user-grid">
        {users.map((user) => (
          <UserCard
            key={user.id}
            name={user.name}
            age={user.age}
            imageUrl={user.imageUrl}
            isOnline={user.isOnline}
          />
        ))}
      </section>
    </main>
  )
}

export default App
