import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export default function Home() {
  const [todos, setTodos] = useState(null)

  useEffect(() => {
    fetchTodos()
  }, [])

  async function fetchTodos() {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + '/todos')
    const json = await res.json()
    setTodos(json)
  }

  const debouncedUpdateTodo = useCallback(debounce(updateTodo, 500), [])

  function handleToDoChange(e, id) {
    const target = e.target
    const value = target.type === 'checkbox' ? target.checked : target.value
    const name = target.name
    const copy = [...todos]
    const idx = todos.findIndex((todo) => todo.id === id)
    const changedToDo = {
      ...todos[idx],
      [name]: value
    }
    copy[idx] = changedToDo
    debouncedUpdateTodo(changedToDo)
    setTodos(copy)
  }



  async function updateTodo(todo) {
    const data = {
      name: todo.name,
      completed: todo.completed
    }
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${todo.id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json'
      }
    })
  }

  return (
    <div>
      <Head>
        <title>Full Stack Book To Do Next.js</title>
        <meta name="description" content="Full Stack Book To Do Next.js" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>To Do</h1>
        {!todos && (
          <div>Loading...</div>
        )}
        {todos && (
          <div>
            {todos.map((todo) => {
              return (
                <div key={todo.id}>
                  <input name="completed" type="checkbox" checked={todo.completed} value={todo.completed} onChange={(e) => handleToDoChange(e, todo.id)}></input>
                  <input name="name" type="text" className={styles.todo} value={todo.name} onChange={(e) => handleToDoChange(e, todo.id)}></input>
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
