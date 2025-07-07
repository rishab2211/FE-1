import React, { useState } from 'react'

export default function LargeFiles() {
  const [file, setFile] = useState<File | null>(null)
  const [response, setResponse] = useState<any>(null)
  const [error, setError] = useState<string | null>(null)

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
          // Do NOT set Content-Type manually — browser does it with boundary
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

  return (
    <div style={{ maxWidth: 400, margin: 'auto', padding: 20 }}>
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

      {error && <p style={{ color: 'red' }}>{error}</p>}

      {response && (
        <div style={{ marginTop: 20 }}>
          <h4>Response:</h4>
          <pre>{JSON.stringify(response, null, 2)}</pre>
        </div>
      )}
    </div>
  )
}
