import { useEffect, useState } from 'react';
import Pusher from 'pusher-js';
import Head from 'next/head';
import styles from '../styles/MessageBox.module.css';

interface Message {
  username: string;
  message: string;
  date: string;
}

export default function MessageBox() {
  const [username, setUsername] = useState<string>('');
  const [messages, setMessages] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');

  useEffect(() => {
    Pusher.logToConsole = true;

    const pusher = new Pusher('56d0ad2a5a08355cfb9d', {
      cluster: 'eu',
    });

    const channel = pusher.subscribe('chat');
    channel.bind('message', (data: Message) => {
      setMessages((prevMessages) => [...prevMessages, data]);
    });

    return () => {
      pusher.unsubscribe('chat');
    };
  }, []);

  const submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (!username || !message) {
      alert('Both username and message are required!');
      return;
    }

    const currentDate = new Date();

    let hours = currentDate.getHours();
    const minutes = currentDate.getMinutes().toString().padStart(2, '0');
    const day = currentDate.getDate().toString().padStart(2, '0');
    const month = (currentDate.getMonth() + 1).toString().padStart(2, '0');
    const year = currentDate.getFullYear();

    const ampm = hours >= 12 ? 'PM' : 'AM';
    hours = hours % 12;
    hours = hours ? hours : 12;

    const formattedDateTime = `${hours}:${minutes} ${ampm} ${day}/${month}/${year}`;
    const usernameWithDate = `${username} - ${formattedDateTime}`;

    await fetch('/api/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        username: usernameWithDate,
        message: message,
        date: formattedDateTime,
      }),
    });

    setMessage('');
  };

  return (
    <div className={styles.container}>
      <Head>
        <title>Chat App</title>
        <meta name="description" content="Real-time chat application using Pusher" />
      </Head>
      <div className={styles.header}>
        <input
          className={styles.usernameInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          placeholder="Enter username"
        />
      </div>
      <div className={styles.chatContainer}>
        <div className={styles.messages}>
          {messages.map((msg, index) => (
            <div key={index} className={styles.message}>
              <strong>{msg.username || 'Anonymous'}</strong>
              <small className={styles.messageTime}>{msg.date}</small>
              <p>{msg.message}</p>
            </div>
          ))}
        </div>
        <form onSubmit={submit} className={styles.messageBox}>
          <div className={styles.fileUploadWrapper}>
            <label htmlFor="file">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 337 337">
                <circle
                  strokeWidth="20"
                  stroke="#6c6c6c"
                  fill="none"
                  r="158.5"
                  cy="168.5"
                  cx="168.5"
                ></circle>
                <path
                  strokeLinecap="round"
                  strokeWidth="25"
                  stroke="#6c6c6c"
                  d="M167.759 79V259"
                ></path>
                <path
                  strokeLinecap="round"
                  strokeWidth="25"
                  stroke="#6c6c6c"
                  d="M79 167.138H259"
                ></path>
              </svg>
              <span className={styles.tooltip}>Add an image</span>
            </label>
            <input type="file" id="file" name="file" />
          </div>
          <input
            required
            placeholder="Message..."
            type="text"
            className={styles.messageInput}
            value={message}
            onChange={(e) => setMessage(e.target.value)}
          />
          <button type="submit" className={styles.sendButton}>
            Send
          </button>
        </form>
      </div>
    </div>
  );
}
