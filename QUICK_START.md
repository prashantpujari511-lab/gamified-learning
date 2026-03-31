# Quick Setup Guide - Curriculum Integration

## ⚡ Quick Start (5 minutes)

### Step 1: Ensure MongoDB is Running
```powershell
# MongoDB should be running at mongodb://127.0.0.1:27017
# Verify connection with Compass or MongoDB CLI
```

### Step 2: Seed the Curriculum Data
```powershell
cd backend
node seed.js
```

Expected output:
```
✅ MongoDB connected for seeding
🗑️  Cleared existing curriculum data
✅ Successfully seeded 7 subjects
   📚 Mathematics: 4 grades, 21 total subtopics
   📚 English: 4 grades, 17 total subtopics
   📚 Environmental Studies: 4 grades, 16 total subtopics
   📚 General Knowledge: 4 grades, 15 total subtopics
   📚 Logical Reasoning: 4 grades, 12 total subtopics
   📚 Computer Basics: 4 grades, 11 total subtopics
   📚 Moral Values & Life Skills: 4 grades, 15 total subtopics

✨ Curriculum seeding completed!
```

### Step 3: Start Backend Server
```powershell
npm run dev
```

Your backend is now running with curriculum endpoints!

---

## 📊 What Gets Seeded?

### 7 Subjects with Complete Curriculum:
| Subject | Grades | Subtopics | Total XP |
|---------|--------|-----------|----------|
| Mathematics | 1-4 | 21 | ~4500 |
| English | 1-4 | 17 | ~3800 |
| Environmental Studies | 1-4 | 16 | ~3600 |
| General Knowledge | 1-4 | 15 | ~3400 |
| Logical Reasoning | 1-4 | 12 | ~2700 |
| Computer Basics | 1-4 | 11 | ~2400 |
| Moral Values | 1-4 | 15 | ~3200 |
| | | **117 Total** | **~23,600 XP** |

---

## 🚀 Test the API

### 1. Get All Subjects
```bash
curl http://localhost:5000/api/curriculum/subjects
```

### 2. Get Grade 1 Dashboard
```bash
curl http://localhost:5000/api/curriculum/dashboard/1
```

### 3. Get Mathematics Grade 2
```bash
curl http://localhost:5000/api/curriculum/subjects/MATH_P/grades/2
```

### 4. Get Easy Difficulty Activities
```bash
curl "http://localhost:5000/api/curriculum/by-difficulty?difficulty=Easy"
```

### 5. Search for Multiplication
```bash
curl "http://localhost:5000/api/curriculum/search?q=multiplication"
```

---

## 📁 Files Created/Modified

### New Files
```
backend/
├── data/curriculum.json           # Complete curriculum data (117 subtopics)
├── models/Curriculum.js           # MongoDB schema
├── routes/curriculumRoutes.js      # 11 API endpoints
└── seed.js                         # Database seeding script
```

### Modified Files
```
backend/
└── index.js                        # Added curriculum routes
```

---

## 🎮 Available API Endpoints

| Endpoint | Method | Purpose |
|----------|--------|---------|
| `/api/curriculum/subjects` | GET | Get all subjects |
| `/api/curriculum/subjects/:subjectId` | GET | Get specific subject |
| `/api/curriculum/subjects/:subjectId/grades/:grade` | GET | Get grade curriculum |
| `/api/curriculum/subtopic/:subtopicId` | GET | Get subtopic details |
| `/api/curriculum/by-difficulty` | GET | Filter by difficulty |
| `/api/curriculum/by-tag` | GET | Filter by tags |
| `/api/curriculum/by-activity` | GET | Filter by game activity |
| `/api/curriculum/game-activities` | GET | Get all game types |
| `/api/curriculum/dashboard/:grade` | GET | Grade dashboard |
| `/api/curriculum/search` | GET | Search curriculum |

---

## 💡 Frontend Integration Examples

### Show All Subjects
```javascript
fetch('/api/curriculum/subjects')
  .then(r => r.json())
  .then(data => console.log(data.data))
```

### Get Grade 1 Dashboard with Stats
```javascript
fetch('/api/curriculum/dashboard/1')
  .then(r => r.json())
  .then(data => {
    data.data.forEach(subject => {
      console.log(`${subject.subject.name}: ${subject.stats.totalSubtopics} topics, ${subject.stats.totalXP} XP`)
    })
  })
```

### Display Subtopics for a Grade
```javascript
fetch('/api/curriculum/subjects/MATH_P/grades/3')
  .then(r => r.json())
  .then(data => {
    data.grade.subtopics.forEach(topic => {
      console.log(`${topic.subtopicName} (${topic.difficulty}) - ${topic.xpValue} XP`)
    })
  })
```

### Create Game Selection Menu
```javascript
fetch('/api/curriculum/game-activities')
  .then(r => r.json())
  .then(data => {
    // data.activities contains all 25+ game types
    // Use to create game selection UI
  })
```

---

## 🔧 Curriculum Structure

Each **Subtopic** contains:

```javascript
{
  subtopicId: "MATH_P_G2_001",
  subtopicName: "Numbers (1-100)",
  description: "Extended number recognition and place value",
  xpValue: 150,
  difficulty: "Easy",
  microConcepts: [
    "Counting 1-100",
    "Tens and ones",
    "Place value (T and U)",
    "Number names (1-100)",
    "Skip counting by 2, 5, 10"
  ],
  gameActivityTypes: [
    "number-sequence",
    "place-value-game",
    "skip-count-race"
  ],
  tags: ["numbers", "place-value", "counting"],
  estimatedTime: "20-25 mins"
}
```

---

## 📚 Grades & Difficulty Progression

### Grade 1: Foundation
- **Difficulty**: Easy
- **XP Multiplier**: 1.0x
- **Focus**: Basic concepts, recognition, fundamentals

### Grade 2: Building
- **Difficulty**: Easy-Medium  
- **XP Multiplier**: 1.2x
- **Focus**: Extending knowledge, simple operations

### Grade 3: Advancing
- **Difficulty**: Medium
- **XP Multiplier**: 1.4x
- **Focus**: Complex concepts, analysis, application

### Grade 4: Challenging
- **Difficulty**: Medium-Hard
- **XP Multiplier**: 1.6x
- **Focus**: Advanced concepts, problem-solving, strategic thinking

---

## 🎯 XP System

**Each subtopic awards XP based on:**

```
Final XP = Base XP × Grade Multiplier

Example (Grade 2 Mathematics - Numbers 1-100):
150 XP × 1.2 = 180 XP earned upon completion
```

**Grade 1 Dashboard Total**: ~3,300 XP
**Grade 2 Dashboard Total**: ~3,960 XP
**Grade 3 Dashboard Total**: ~4,620 XP
**Grade 4 Dashboard Total**: ~5,720 XP

---

## 🎨 Game Activity Types

Currently supporting **25+ game types**:

### Puzzle Games
- number-puzzle, shape-sequence-puzzle, pattern-puzzle, analogy-puzzle

### Quiz Games
- quiz-challenge, rapid-fire-quiz, grammar-ninja-quiz, fact-match

### Interactive Games
- drag-and-drop, matching-game, sorting-game, memory-cards

### Story Games
- story-completion, picture-story, scenario-based, dialogue-builder

### Racing/Challenge Games
- typing-racer, number-race, counting-challenge, speed-builder

---

## ✅ What's Included

- ✅ 7 subjects with complete curriculum
- ✅ 4 grades (1-4) per subject
- ✅ 117 total subtopics
- ✅ 1000+ micro-concepts
- ✅ 25+ game activity types
- ✅ Difficulty progression
- ✅ XP value system
- ✅ Tag-based filtering
- ✅ Search functionality
- ✅ Dashboard views
- ✅ Progress tracking structure

---

## 🚨 Troubleshooting

### "MongoDB connection error"
```bash
# Ensure MongoDB is running
# Check MONGO_URI in .env file
```

### "Curriculum routes not found"
```bash
# Restart backend: npm run dev
# Verify curriculumRoutes.js exists
```

### "No data returned from API"
```bash
# Verify seeding completed successfully
# Check MongoDB: db.curriculum.find().count()
# Should return 7 documents
```

### "Seed script errors"
```bash
# Delete any incomplete seed: db.curriculum.deleteMany({})
# Re-run seed: node seed.js
```

---

## 📖 Documentation Files

- **CURRICULUM_GUIDE.md** - Comprehensive curriculum documentation
- **QUICK_START.md** - This file
- **API_ENDPOINTS.md** - Detailed API reference (optional)

---

## 🎓 Next Steps

1. **Seed the database** ✅
2. **Start backend server** ✅
3. **Create subject selection UI** 
4. **Create grade selection UI**
5. **Create subtopic list UI**
6. **Implement game modules** (using gameActivityTypes)
7. **Track progress** (using MongoDB progress fields)
8. **Award XP & badges** (using xpValue)

---

**Ready to build awesome games! 🚀**
