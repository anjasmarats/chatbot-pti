import { useState } from 'react';
import axios from 'axios';
import './App.css';

function App() {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState([]);
  const [message, setMessage] = useState('');

  const handleSearch = async () => {
    setResults([]);
    setMessage('');
    try {
      const res = await axios.post('http://localhost:5000/search', { query });
      if (res.data.message) {
        setMessage(res.data.message);
      } else {
        setResults(res.data.results);
      }
    } catch (error) {
      if (error.response) {console.log(error.response)}
      setMessage('Error searching');
    }
  };

  return (
    <div className="container">
      <h1>Semantic Search App</h1>
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Enter search query"
      />
      <button onClick={handleSearch}>Search</button>
      {message && <p>{message}</p>}
      <ul>
        {results.map((result) => (
          <li key={result.id}>
            <p>{result.text}</p>
            <small>Similarity: {result.similarity.toFixed(2)}</small>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;