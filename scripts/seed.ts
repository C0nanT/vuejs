import { MongoClient } from 'mongodb';
import { initialItems } from '../src/data/mockItems';
import * as dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'vue_testes';
const collectionName = 'items';

async function seed() {
  const client = new MongoClient(uri);

  try {
    await client.connect();
    console.log('Conectado ao MongoDB');

    const db = client.db(dbName);
    const collection = db.collection(collectionName);

    // Limpa a coleção antes de inserir (opcional, dependendo da necessidade)
    await collection.deleteMany({});
    console.log('Coleção limpa');

    // Insere os dados mockados
    const result = await collection.insertMany(initialItems);
    console.log(`${result.insertedCount} itens inseridos com sucesso!`);

  } catch (error) {
    console.error('Erro ao semear o banco de dados:', error);
  } finally {
    await client.close();
  }
}

seed();
