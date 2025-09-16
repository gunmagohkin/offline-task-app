import { KintoneRestAPIClient } from "@kintone/rest-api-client";

// Initialize the Kintone client from environment variables
const client = new KintoneRestAPIClient({
  baseUrl: process.env.KINTONE_BASE_URL,
  auth: { apiToken: process.env.KINTONE_API_TOKEN },
});

const APP_ID = process.env.KINTONE_APP_ID;

// Helper to format Kintone records into the simple task object your client expects
const formatRecord = (record) => ({
  id: parseInt(record.$id.value, 10), // Kintone's record ID
  text: record.task_text.value,
});

export async function handler(event) {
  const method = event.httpMethod;
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'GET, POST, PATCH, DELETE, OPTIONS'
  };

  if (method === 'OPTIONS') {
    return { statusCode: 200, headers, body: '' };
  }

  // GET all tasks
  if (method === 'GET') {
    try {
      const resp = await client.record.getRecords({ app: APP_ID });
      const tasks = resp.records.map(formatRecord);
      return { statusCode: 200, headers, body: JSON.stringify(tasks) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  // CREATE a new task
  if (method === 'POST') {
    try {
      const task = JSON.parse(event.body);
      const addRecordResponse = await client.record.addRecord({
        app: APP_ID,
        record: {
          task_text: { value: task.text },
        },
      });
      // The client needs to know the ID Kintone assigned
      const newTask = { id: parseInt(addRecordResponse.id, 10), text: task.text };
      return { statusCode: 200, headers, body: JSON.stringify(newTask) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  // UPDATE an existing task
  if (method === 'PATCH') {
    try {
      const updateData = JSON.parse(event.body);
      await client.record.updateRecord({
        app: APP_ID,
        id: updateData.id,
        record: {
          task_text: { value: updateData.text },
        },
      });
      return { statusCode: 200, headers, body: JSON.stringify(updateData) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  // DELETE a task
  if (method === 'DELETE') {
    try {
      const id = parseInt(event.queryStringParameters?.id);
      await client.record.deleteRecords({ app: APP_ID, ids: [id] });
      return { statusCode: 200, headers, body: JSON.stringify({ message: 'Task deleted' }) };
    } catch (err) {
      return { statusCode: 500, headers, body: JSON.stringify({ error: err.message }) };
    }
  }

  return { 
    statusCode: 405, 
    headers,
    body: JSON.stringify({ error: 'Method Not Allowed' })
  };
}