import express from 'express';
import cors from 'cors';
import { MongoClient, ObjectId } from 'mongodb';
import * as dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 3000;
const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017';
const dbName = 'vue_testes';
const collectionName = 'items';

app.use(cors());
app.use(express.json());

let client: MongoClient;
let db: any;
let collection: any;

async function connectDB() {
  try {
    client = new MongoClient(mongoUri);
    await client.connect();
    db = client.db(dbName);
    collection = db.collection(collectionName);
    console.log('Connected to MongoDB');
  } catch (error) {
    console.error('Failed to connect to MongoDB', error);
    process.exit(1);
  }
}

// GET /api/items
app.get('/api/items', async (req, res) => {
  try {
    const {
		search,
		sortBy,
		order = "asc",
		page = "1",
		limit = "10",
		tags,
	} = req.query;
    
    let query: any = {};
    const conditions: any[] = [];
    
    if (search) {
		conditions.push({
			$or: [
				{ name: { $regex: search, $options: "i" } },
				{ description: { $regex: search, $options: "i" } },
			],
		});
	}

	// Filter by tags
	if (tags) {
		const tagArray = Array.isArray(tags) ? tags : [tags];
		conditions.push({ tags: { $in: tagArray } });
	}

	if (conditions.length > 0) {
		query = { $and: conditions };
	}

    const sortField = sortBy as string;
    const sortOrder = order === 'asc' ? 1 : -1;
    const sortOptions: any = {};
    if (sortField) {
      sortOptions[sortField] = sortOrder;
    } else {
      sortOptions.createdAt = -1; // Default sort
    }

    const pageNum = parseInt(page as string);
    const limitNum = parseInt(limit as string);
    const skip = (pageNum - 1) * limitNum;

    const total = await collection.countDocuments(query);
    const items = await collection.find(query)
      .sort(sortOptions)
      .skip(skip)
      .limit(limitNum)
      .toArray();

    // Mapping _id to id if necessary, but we already have id field from seeder
    const formattedItems = items.map((item: any) => {
      const { _id, ...rest } = item;
      return { ...rest };
    });

    res.json({
      data: formattedItems,
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum)
    });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch items' });
  }
});

// POST /api/items
app.post('/api/items', async (req, res) => {
  try {
    const newItem = {
      ...req.body,
      id: Date.now(),
      createdAt: new Date().toISOString()
    };
    await collection.insertOne(newItem);
    const { _id, ...rest } = newItem as any;
    res.status(201).json(rest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create item' });
  }
});

// PUT /api/items/:id
app.put('/api/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const updatedData = req.body;
    const result = await collection.findOneAndUpdate(
      { id },
      { $set: updatedData },
      { returnDocument: 'after' }
    );
    
    if (!result) {
      return res.status(404).json({ error: 'Item not found' });
    }
    
    const { _id, ...rest } = result as any;
    res.json(rest);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update item' });
  }
});

// DELETE /api/items/:id
app.delete('/api/items/:id', async (req, res) => {
  try {
    const id = parseInt(req.params.id);
    const result = await collection.deleteOne({ id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ error: 'Item not found' });
    }
    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete item' });
  }
});

connectDB().then(() => {
  app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
  });
});
