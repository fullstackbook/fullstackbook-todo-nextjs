import Head from 'next/head'
import Image from 'next/image'
import styles from '../styles/Home.module.css'
import { useState, useEffect, useCallback } from 'react';
import { debounce } from 'lodash';

export default function Home() {
  const [todos, setTodos] = useState(null)
  const [mainInput, setMainInput] = useState('')

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

  async function addToDo(name) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/`, {
      method: 'POST',
      body: JSON.stringify({
        name: name,
        completed: false
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      const json = await res.json();
      const copy = [...todos, json]
      setTodos(copy)
    }
  }

  async function handleDeleteToDo(id) {
    const res = await fetch(process.env.NEXT_PUBLIC_API_URL + `/todos/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json'
      }
    })
    if (res.ok) {
      const idx = todos.findIndex((todo) => todo.id === id)
      const copy = [...todos]
      copy.splice(idx, 1)
      setTodos(copy)
    }
  }

  function handleMainInputChange(e) {
    setMainInput(e.target.value)
  }

  function handleKeyDown(e) {
    if (e.key === 'Enter') {
      if (mainInput.length > 0) {
        addToDo(mainInput)
        setMainInput('')
      }
    }
  }

  return (
    <div>
      <Head>
        <title>Full Stack Book To Do</title>
        <meta name="description" content="Full Stack Book To Do" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <div className={styles.container}>
        <h1 className={styles.title}>To Do</h1>
        <div className={styles.mainInputContainer}>
          <input className={styles.mainInput} placeholder="What needs to be done?" value={mainInput} onChange={(e) => handleMainInputChange(e)} onKeyDown={handleKeyDown}></input>
        </div>
        {!todos && (
          <div>Loading...</div>
        )}
        {todos && (
          <div>
            {todos.map((todo) => {
              return (
                <div className={styles.toDoRow} key={todo.id}>
                  <input className={styles.toDoCheckbox} name="completed" type="checkbox" checked={todo.completed} value={todo.completed} onChange={(e) => handleToDoChange(e, todo.id)}></input>
                  <input className={styles.todoInput} autoComplete='off' name="name" type="text" value={todo.name} onChange={(e) => handleToDoChange(e, todo.id)}></input>
                  <button className={styles.deleteBtn} onClick={() => handleDeleteToDo(todo.id)}><Image src="/material-symbols_delete-outline-sharp.svg" width="24px" height="24px" /></button>
                </div>
              )
            })}
          </div>
        )}
        <div className={styles.filters}>
          <button>All</button>
          <button>Active</button>
          <button>Completed</button>
        </div>
      </div>
    </div>
  )
}
