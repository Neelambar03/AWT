// ===== IMPORT DEPENDENCIES =====
const express = require('express');
const mongoose = require('mongoose');
const app = express();

app.use(express.json());

// ===== MONGODB CONNECTION =====
mongoose.connect('mongodb://127.0.0.1:27017/schoolDB')
    .then(() => console.log('✅ MongoDB connected'))
    .catch(err => console.error('❌ MongoDB connection error:', err));

// ===== SCHEMA & MODEL =====
const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    age: Number,
    grade: String,
    email: String,
    subjects: [String],
    status: String,
    enrolled: Boolean,
    createdAt: { type: Date, default: Date.now },
    updatedAt: Date
});

const Student = mongoose.model('Student', studentSchema);

// ===== ROUTES =====

// Home
app.get('/', (req, res) => {
    res.send('Welcome to School API with full MongoDB operations!');
});

// ===== CREATE =====
app.post('/students', async (req, res) => {
    try {
        const student = new Student(req.body);
        await student.save();
        res.status(201).json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ===== READ =====
app.get('/students', async (req, res) => {
    try {
        const students = await Student.find();
        res.json(students);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

app.get('/students/:id', async (req, res) => {
    try {
        const student = await Student.findById(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== UPDATE =====
app.put('/students/:id', async (req, res) => {
    try {
        req.body.updatedAt = new Date();
        const student = await Student.findByIdAndUpdate(req.params.id, req.body, { new: true });
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ===== DELETE =====
app.delete('/students/:id', async (req, res) => {
    try {
        const student = await Student.findByIdAndDelete(req.params.id);
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== AGGREGATION =====
app.get('/students/aggregate/grade', async (req, res) => {
    try {
        const result = await Student.aggregate([
            { $group: { _id: "$grade", count: { $sum: 1 }, averageAge: { $avg: "$age" } } },
            { $sort: { count: -1 } }
        ]);
        res.json(result);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== INDEX MANAGEMENT =====
app.get('/students/create-index', async (req, res) => {
    try {
        await Student.collection.createIndex({ email: 1 }, { unique: true });
        res.send('✅ Unique index on email created');
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== UTILITY COMMANDS =====
app.get('/students/stats', async (req, res) => {
    try {
        const stats = await Student.collection.stats();
        res.json(stats);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// ===== BULK OPERATIONS =====
app.post('/students/bulk', async (req, res) => {
    try {
        const operations = req.body.operations; // Array of bulk operations
        const result = await Student.bulkWrite(operations);
        res.json(result);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// ===== START SERVER =====
const PORT = 3000;
app.listen(PORT, () => console.log(`🚀 Server running at http://localhost:${PORT}`));
