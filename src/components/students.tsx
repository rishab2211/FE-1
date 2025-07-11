import React, { useState } from 'react'

const API_URL = 'https://be-1.rishabraj2211.workers.dev/students'
const ETAG_URL = 'https://be-1.rishabraj2211.workers.dev/etag-student'

export default function Students() {
  const [students, setStudents] = useState<any[]>([])
  const [form, setForm] = useState({ name: '', age: '', email: '', department: '', year: '', gpa: '' })
  const [editId, setEditId] = useState<number | null>(null)
  const [responseMessage, setResponseMessage] = useState<string>('')
  const [etag, setEtag] = useState<string | null>(null)
  const [cachedStudent, setCachedStudent] = useState<any | null>(null)

  const fetchStudents = async () => {
    const res = await fetch(API_URL)
    const data = await res.json()
    setStudents(data)
    setResponseMessage('GET: Students fetched successfully')
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const method = editId ? 'PUT' : 'POST'
    const url = editId ? `${API_URL}/${editId}` : API_URL
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...form,
        age: Number(form.age),
        gpa: Number(form.gpa),
      })
    })
    const result = await res.json()
    setResponseMessage(`${method}: ${editId ? 'Updated' : 'Created'} student ${result.name}`)
    setForm({ name: '', age: '', email: '', department: '', year: '', gpa: '' })
    setEditId(null)
    fetchStudents()
  }

  const handleDelete = async (id: number) => {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' })
    setResponseMessage(`DELETE: Student with ID ${id} deleted`)
    fetchStudents()
  }

  const handleEdit = (student: any) => {
    setForm({
      name: student.name,
      age: student.age,
      email: student.email,
      department: student.department,
      year: student.year,
      gpa: student.gpa
    })
    setEditId(student.id)
    setResponseMessage(`PUT: Editing student with ID ${student.id}`)
  }

  const handlePatchGPA = async (id: number, gpa: number | string) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ gpa: Number(gpa) })
    })
    setResponseMessage(`PATCH: Updated GPA for student ID ${id}`)
    fetchStudents()
  }

  const fetchStudentWithETag = async (id: number) => {
    const res = await fetch(`${ETAG_URL}/${id}`, {
      headers: etag ? { 'If-None-Match': etag } : {}
    })

    if (res.status === 304) {
      setResponseMessage(`ETag: 304 Not Modified — Using cached data for ID ${id}`)
      return
    }

    const data = await res.json()
    const newEtag = res.headers.get('etag')

    setCachedStudent(data)
    setEtag(newEtag)
    setResponseMessage(`ETag: 200 OK — Fetched fresh data for ID ${id}`)
  }

  return (
    <div className="p-4 max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold mb-4">Student Management</h1>

      <div className="mb-4 flex gap-4">
        <button
          className="bg-gray-700 text-white px-4 py-2 rounded"
          onClick={fetchStudents}
        >
          Refresh Students (GET)
        </button>

        <button
          className="bg-purple-600 text-white px-4 py-2 rounded"
          onClick={() => fetchStudentWithETag(2)}
        >
          Fetch Student with ETag (ID: 2)
        </button>
      </div>

      <form onSubmit={handleSubmit} className="grid gap-2 mb-6">
        <input className="border p-2 rounded" placeholder="Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Age" type="number" value={form.age} onChange={e => setForm({ ...form, age: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Department" value={form.department} onChange={e => setForm({ ...form, department: e.target.value })} />
        <input className="border p-2 rounded" placeholder="Year" value={form.year} onChange={e => setForm({ ...form, year: e.target.value })} />
        <input className="border p-2 rounded" placeholder="GPA" type="number" value={form.gpa} onChange={e => setForm({ ...form, gpa: e.target.value })} />
        <button className="bg-blue-600 text-white px-4 py-2 rounded" type="submit">{editId ? 'Update Student (PUT)' : 'Add Student (POST)'}</button>
      </form>

      {responseMessage && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-2 rounded mb-4">
          {responseMessage}
        </div>
      )}

      <h2 className="text-xl font-semibold mb-2">Student List</h2>
      <ul>
        {students.map((student: any) => (
          <li key={student.id} className="border p-3 mb-2 rounded shadow-sm flex justify-between items-center">
            <div>
              <strong>{student.name}</strong> ({student.department}) - GPA: {student.gpa}
              <div className="text-sm text-gray-500">{student.email} • Year: {student.year} • Age: {student.age}</div>
            </div>
            <div className="flex gap-2">
              <button className="bg-green-500 text-white px-2 py-1 rounded" onClick={() => handleEdit(student)}>Edit</button>
              <button className="bg-yellow-500 text-white px-2 py-1 rounded" onClick={() => handlePatchGPA(student.id, Math.min(student.gpa + 0.1, 10).toFixed(1))}>Patch GPA</button>
              <button className="bg-red-600 text-white px-2 py-1 rounded" onClick={() => handleDelete(student.id)}>Delete</button>
            </div>
          </li>
        ))}
      </ul>

      {cachedStudent && (
        <div className="mt-6 bg-white p-4 border rounded shadow">
          <h3 className="font-semibold text-lg mb-2">Cached Student (from ETag)</h3>
          <p><strong>{cachedStudent.name}</strong> ({cachedStudent.department}) - GPA: {cachedStudent.gpa}</p>
          <p className="text-sm text-gray-500">
            {cachedStudent.email} • Year: {cachedStudent.year} • Age: {cachedStudent.age}
          </p>
          <p className="text-sm text-gray-400 mt-1">ETag: {etag}</p>
        </div>
      )}
    </div>
  )
}
