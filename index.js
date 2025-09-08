const express = require('express');
const cors = require('cors');
const { pipeline } = require('@xenova/transformers');

const app = express();
const port = 5000;

app.use(cors());
app.use(express.json());

// Data: Array of documents. Add your documents here.
let documents = require("./data.json")

// Initialize embedding model (Xenova's MiniLM for semantic search).
let embedder;
async function initEmbedder() {
  try {
    embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2');
    console.log('Embedding model loaded successfully');
  } catch (error) {
    console.error('Failed to load embedding model:', error);
    process.exit(1); // Exit if model fails to load
  }
}
initEmbedder();

// Convert text to embedding vector.
async function getEmbedding(text) {
  try {
    const output = await embedder(text, { pooling: 'mean', normalize: true });
    // Ensure output.data is an array (convert Float32Array if needed).
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    throw new Error('Embedding generation failed');
  }
}

// Compute cosine similarity between two vectors.
function cosineSimilarity(vecA, vecB) {
  // Validate inputs
  if (!Array.isArray(vecA) || !Array.isArray(vecB) || vecA.length !== vecB.length) {
    throw new Error('Invalid vectors for cosine similarity');
  }

  let dotProduct = 0;
  for (let i = 0; i < vecA.length; i++) {
    dotProduct += vecA[i] * vecB[i];
  }
  const magA = Math.sqrt(vecA.reduce((sum, val) => sum + val ** 2, 0));
  const magB = Math.sqrt(vecB.reduce((sum, val) => sum + val ** 2, 0));
  
  // Avoid division by zero
  if (magA === 0 || magB === 0) return 0;
  return dotProduct / (magA * magB);
}

// Search API endpoint.
app.post('/search', async (req, res) => {
  const { query } = req.body;
  if (!query) {
    return res.status(400).json({ error: 'Query required' });
  }

  try {
    const queryEmbedding = await getEmbedding(query);
    const results = await Promise.all(
      documents.map(async (doc) => {
        const docEmbedding = await getEmbedding(doc.text);
        const similarity = cosineSimilarity(queryEmbedding, docEmbedding);
        return { ...doc, similarity };
      })
    );

    // Filter results with similarity > 0.5 and sort by relevance
    const sorted = results
      .filter((r) => r.similarity > 0.5)
      .sort((a, b) => b.similarity - a.similarity)
    
    let queryResult = "" 
    
    for (let i = 0; i < sorted.length; i++) {
      // console.log(sorted[i].text)
      queryResult = `${queryResult} ${sorted[i].text}`
    }

    console.log(queryResult)

    if (sorted.length === 0 || queryResult.length === 0) {
      return res.json({ message: 'No results found', results: [] });
    }
    res.json({ results: queryResult });
  } catch (error) {
    console.error('Search error:', error);
    res.status(500).json({ error: 'Search failed' });
  }
});

app.listen(port, () => console.log(`Backend running on port ${port}`));