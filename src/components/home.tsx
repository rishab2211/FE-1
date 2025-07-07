import { useNavigate } from 'react-router-dom'

export default function HomePage() {
  const navigate = useNavigate()

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '16px', padding: '40px' }}>
      <h1>Student Portal</h1>

      <button
        onClick={() => navigate('/students')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#007bff',
          color: 'white',
        }}
      >
        Go to Students
      </button>

      <button
        onClick={() => navigate('/files')}
        style={{
          padding: '10px 20px',
          fontSize: '16px',
          cursor: 'pointer',
          borderRadius: '8px',
          border: '1px solid #ccc',
          backgroundColor: '#28a745',
          color: 'white',
        }}
      >
        Go to Image Upload
      </button>
    </div>
  )
}
