import React, { useState } from 'react'

export default function LargeFiles() {
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)
  const [streamData, setStreamData] = useState<string[]>([])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0] || null
    setFile(selectedFile)
    setError(null)
    setResponse(null)
  }

  const handleUpload = async () => {
    if (!file) {
      setError('Please select an image file.')
      return
    }

    const formData = new FormData()
    formData.append('image', file)

    try {
      const res = await fetch('https://be-1.rishabraj2211.workers.dev/image', {
        method: 'POST',
        body: formData,
        headers: {
          Accept: 'application/json',
        },
      })

      if (!res.ok) {
        const err = await res.json()
        setError(err.error || 'Upload failed.')
        return
      }

      const data = await res.json()
      setResponse(data)
    } catch (err: any) {
      setError('Error uploading image.')
    }
  }

  const handleStartStreaming = () => {
    const events = new EventSource('https://be-1.rishabraj2211.workers.dev/stream')

    events.onmessage = (event) => {
      setStreamData((prev) => [...prev, event.data])
    }

    events.onerror = () => {
      setStreamData((prev) => [...prev, '❌ Stream connection error'])
      events.close()
    }
  }

  return (
    <div style={{ maxWidth: 500, margin: 'auto', padding: 20 }}>
      <h2>Upload an Image (multipart/form-data)</h2>

      <input
        type="file"
        accept="image/*"
        onChange={handleFileChange}
        style={{ marginBottom: 12 }}
      />

      <br />
      <button onClick={handleUpload} disabled={!file}>
        Upload
      </button>

      <br />
      <br />

      <h2>Stream data(Real time updates)</h2>
      <button onClick={handleStartStreaming}>
        Start Streaming Data
      </button>

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div style={{ marginTop: 20 }}>
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}

      {streamData.length > 0 && (
        <div style={{ marginTop: 20 }}>
          <h4>Live Stream Data:</h4>
          <pre style={{ background: '#f4f4f4', padding: 10, borderRadius: 4 }}>
            {streamData.map((line, i) => (
              <div key={i}>{line}</div>
            ))}
          </pre>
        </div>
      )}
    </div>
  )
}
