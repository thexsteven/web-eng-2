import './UserCard.css'

function UserCard({ name, age, imageUrl, isOnline }) {
  return (
    <article className="user-card">
      <div className="user-card__avatar">
        <img src={imageUrl} alt={`Profilbild von ${name}`} />
        <span
          className={`user-card__dot ${isOnline ? 'is-online' : 'is-offline'}`}
          aria-hidden="true"
        ></span>
      </div>

      <h2 className="user-card__name">{name}</h2>
      <p className="user-card__age">{age} Jahre</p>

      {isOnline ? (
        <span className="user-card__badge is-online">Online</span>
      ) : (
        <span className="user-card__badge is-offline">Offline</span>
      )}
    </article>
  )
}

export default UserCard
