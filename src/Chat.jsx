import React, { useState } from 'react';
import axios from 'axios';

const Chat = () => {
    const [query, setQuery] = useState('');
    const [contexts, setContexts] = useState([]);
    const [answer, setAnswer] = useState('');
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchContexts = async () => {
        try {
            const response = await axios.post('https://backendapi-dq5x.onrender.com/get_contexts/', {
                query: query,
            });
            setContexts(response.data.contexts);
            return response.data.contexts;
        } catch (error) {
            console.error('Error fetching contexts:', error);
            setError('Error fetching contexts');
        }
    };

    const fetchAnswer = async (contexts) => {
        let content = 'context : ' + contexts.join(' ').replace(/"/g, "'").replace(/\n/g, ' ') + 'question : ' + query
    
        const options = {
            method: 'POST',
            url: 'https://simple-chatgpt-api.p.rapidapi.com/ask/gpt4',
            headers: {
              'x-rapidapi-key': 'bb3aaddf06mshcd63601f15f2325p1412f6jsnfe345a3926da',
              'x-rapidapi-host': 'simple-chatgpt-api.p.rapidapi.com',
              'Content-Type': 'application/json'
            },
            data: {
                question: content
            }   
            };
            
            try {
                const response = await axios.request(options);
                setAnswer(response.data['answer'])
            } catch (error) {
                console.error(error);
            }
    };

    const handleSubmit = async (event) => {
        event.preventDefault();
        setLoading(true);
        const fetchedContexts = await fetchContexts();
        await fetchAnswer(fetchedContexts);
        setLoading(false);
    };

    return (
        <div className="chat-container">
        <form onSubmit={handleSubmit}>
            <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder="Ask your question..."
            />
            <button type="submit" disabled={loading}>Submit</button>
        </form>
        <div className="response">
            <h5>Answer:</h5>
            <p>{answer}</p>
        </div>
    </div>
  );
};

export default Chat;
