# Gamified Learning Platform - Primary Class Curriculum Guide

## Overview

This comprehensive curriculum structure is designed for Primary Class (Grades 1-4) aligned with Indian CBSE and State Board syllabus. The curriculum is divided into 7 subjects with progressive difficulty from Grade 1 to Grade 4.

## Subjects Included

1. **Mathematics** - Numeracy, arithmetic operations, geometry, measurement
2. **English** - Phonics, grammar, vocabulary, reading comprehension
3. **Environmental Studies (EVS)** - Nature, family, society, environment
4. **General Knowledge (GK)** - Facts, geography, Indian symbols, heritage
5. **Logical Reasoning** - Pattern recognition, puzzles, critical thinking
6. **Computer Basics** - Hardware, typing, digital literacy, internet safety
7. **Moral Values & Life Skills** - Character development, ethics, social skills

## Curriculum Structure

```
Subject
├── Grade 1-4
│   ├── Subtopic 1
│   │   ├── Micro Concepts
│   │   ├── Game Activity Types
│   │   ├── XP Value
│   │   ├── Difficulty Level
│   │   ├── Tags
│   │   └── Estimated Time
│   └── Subtopic 2
│       └── ...
```

## Directory Structure

```
backend/
├── data/
│   └── curriculum.json          # Complete curriculum data
├── models/
│   ├── User.js
│   └── Curriculum.js            # MongoDB schema
├── routes/
│   ├── authRoutes.js
│   ├── gameRoutes.js
│   └── curriculumRoutes.js      # New curriculum API endpoints
├── seed.js                       # Database seeding script
└── index.js
```

## Setup Instructions

### 1. Seed the Database

**Ensure MongoDB is running first**

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

### 2. Add Curriculum Routes to Backend

Update `backend/index.js` to include curriculum routes:

```javascript
const curriculumRoutes = require("./routes/curriculumRoutes");

// Add after other route declarations
app.use("/api/curriculum", curriculumRoutes);
```

### 3. Verify API

Test the API endpoints:

```bash
curl http://localhost:5000/api/curriculum/subjects
```

## API Endpoints

### Get All Subjects

**GET** `/api/curriculum/subjects`

Returns list of all 7 subjects with metadata.

```json
{
  "success": true,
  "count": 7,
  "data": [
    {
      "subjectId": "MATH_P",
      "subjectName": "Mathematics",
      "description": "Fundamental mathematical concepts...",
      "icon": "calculator",
      "color": "#FF6B6B",
      "grades": [
        { "grade": 1 },
        { "grade": 2 },
        { "grade": 3 },
        { "grade": 4 }
      ]
    }
    // ... more subjects
  ]
}
```

### Get Specific Subject

**GET** `/api/curriculum/subjects/:subjectId`

Example: `/api/curriculum/subjects/MATH_P`

Returns complete subject data with all grades and subtopics.

### Get Grade Curriculum

**GET** `/api/curriculum/subjects/:subjectId/grades/:grade`

Example: `/api/curriculum/subjects/MATH_P/grades/2`

Returns curriculum for Grade 2 Mathematics.

```json
{
  "success": true,
  "subject": "Mathematics",
  "grade": {
    "grade": 2,
    "gradeLabel": "Grade 2",
    "difficulty": "Easy-Medium",
    "xpMultiplier": 1.2,
    "subtopics": [
      {
        "subtopicId": "MATH_P_G2_001",
        "subtopicName": "Numbers (1-100)",
        "xpValue": 150,
        "difficulty": "Easy",
        "microConcepts": ["Counting 1-100", "Tens and ones", ...],
        "gameActivityTypes": ["number-sequence", "place-value-game", ...],
        "tags": ["numbers", "place-value", "counting"],
        "estimatedTime": "20-25 mins"
      }
      // ... more subtopics
    ]
  }
}
```

### Get Single Subtopic

**GET** `/api/curriculum/subtopic/:subtopicId`

Example: `/api/curriculum/subtopic/MATH_P_G2_001`

### Filter by Difficulty

**GET** `/api/curriculum/by-difficulty?difficulty=Easy,Medium,Hard`

Returns curriculum filtered by difficulty levels.

### Filter by Tags

**GET** `/api/curriculum/by-tag?tags=numbers,counting`

Returns curriculum filtered by tags.

### Filter by Game Activity Type

**GET** `/api/curriculum/by-activity?activityType=puzzle,quiz,matching`

Returns curriculum filtered by game activity types.

### Get All Game Activity Types

**GET** `/api/curriculum/game-activities`

```json
{
  "success": true,
  "totalActivities": 25,
  "activities": [
    "addition-challenge",
    "alphabet-puzzle",
    "animal-identification-game",
    "array-puzzle",
    // ... all activity types
  ]
}
```

### Dashboard View for a Grade

**GET** `/api/curriculum/dashboard/:grade`

Example: `/api/curriculum/dashboard/2`

Returns all subjects with statistics for Grade 2.

```json
{
  "success": true,
  "grade": 2,
  "data": [
    {
      "subject": {
        "id": "MATH_P",
        "name": "Mathematics",
        "icon": "calculator",
        "color": "#FF6B6B"
      },
      "stats": {
        "totalSubtopics": 6,
        "totalXP": 1000,
        "difficultyCounts": {
          "Easy": 2,
          "Medium": 3,
          "Hard": 1
        }
      },
      "subtopics": [
        {
          "id": "MATH_P_G2_001",
          "name": "Numbers (1-100)",
          "xpValue": 150,
          "difficulty": "Easy",
          "estimatedTime": "20-25 mins"
        }
        // ... more subtopics
      ]
    }
    // ... more subjects
  ]
}
```

### Search Curriculum

**GET** `/api/curriculum/search?q=multiplication`

Searches for subtopics, topics, and subjects matching the query.

## Game Activity Types

Each subtopic includes suggested game activity types that can be developed:

### Mathematics Activities
- number-puzzle, counting-drag-drop, number-matching, addition-quiz, number-battle, combo-challenge, shape-matching, comparison-quiz, carrier-puzzle, times-table-master, multiplication-race, array-puzzle, division-puzzle, sharing-game, grouping-challenge, fraction-pizza-game, word-problem-quest, real-world-challenge

### English Activities
- alphabet-puzzle, word-builder, grammar-ninja-quiz, story-completion-game, spelling-challenge, rhyme-match-game, rhy-muning-puzzle, word-family-sort, describe-and-match, pronoun-replace-game, article-puzzle, story-builder-game, picture-story-game

### EVS Activities
- family-tree-game, body-labeling-game, plant-labeling, animal-match-game, bird-identification-game, food-sorting-game, eco-challenge, recycle-sorter, conservation-quest

### General Knowledge Activities
- symbol-match-game, state-capital-match, india-map-puzzle, festival-match, world-map-puzzle, planet-match-game, space-explorer

### Logical Reasoning Activities
- logic-puzzle, pattern-challenge, memory-flip-cards, deduction-puzzle, clue-solver, analogy-puzzle, relationship-finder

### Computer Activities
- keyboard-navigator, mouse-control-game, typing-racer, browser-explorer, safety-quiz, file-organizer

### Moral Values Activities
- manners-story-game, courage-challenge, brave-hero-game, decision-maker-game, eco-guardian-game

## Difficulty Levels and XP Values

### XP Progression by Difficulty

```
Easy:         100-160 XP (Base level)
Medium:       160-220 XP (1.5x base)
Hard:         220-300 XP (2x base)
```

### Grade Multipliers

- Grade 1: 1.0x (base multiplier)
- Grade 2: 1.2x
- Grade 3: 1.4x
- Grade 4: 1.6x

Example: A "Medium" difficulty activity in Grade 2 would earn:
```
Base XP (200) × Difficulty (1.5) × Grade Multiplier (1.2) = 360 XP
```

## Micro Concepts

Each subtopic includes specific micro-concepts that break down the learning into granular units:

**Example - Multiplication Basics (Grade 2):**
- Concept of multiplication
- Arrays and groups
- Repeated addition
- Times tables (2, 5, 10)
- Skip counting

These micro-concepts can be used to:
1. Create lecture/tutorial content
2. Design practice problems
3. Generate quiz questions
4. Track progress at granular level

## Frontend Integration

### Games Hub - Primary Class Card

```html
<div class="grade-card">
  <h3>Primary Class (Grades 1-4)</h3>
  <div class="subjects-preview">
    <!-- Call /api/curriculum/dashboard/:grade -->
    <div class="subject" style="color: #FF6B6B">
      <span>📐 Mathematics | 21 Topics</span>
    </div>
    <div class="subject" style="color: #4ECDC4">
      <span>📚 English | 17 Topics</span>
    </div>
    <!-- More subjects... -->
  </div>
</div>
```

### Subject Selection Page

```javascript
// Fetch all subjects
fetch('/api/curriculum/subjects')
  .then(res => res.json())
  .then(data => {
    // Render subject cards with icons and colors
  })
```

### Grade Selection Interface

```javascript
// Get curriculum for selected grade
fetch('/api/curriculum/dashboard/2')
  .then(res => res.json())
  .then(data => {
    // Show all subjects with subtopic counts
    // Display total XP available
    // Show difficulty distribution
  })
```

### Subtopic List

```javascript
// Get subtopics for specific subject/grade
fetch('/api/curriculum/subjects/MATH_P/grades/2')
  .then(res => res.json())
  .then(data => {
    // Render subtopic cards with:
    // - Name and description
    // - XP value and difficulty badge
    // - Estimated time
    // - Game activity icons
  })
```

### Game Selection

```javascript
// Get games by activity type
fetch('/api/curriculum/by-activity?activityType=number-puzzle,counting-drag-drop')
  .then(res => res.json())
  .then(data => {
    // Show available games for this activity type
  })
```

## Progress Tracking Integration

The Curriculum model includes fields for progress tracking:

```javascript
{
  isCompleted: false,
  completedBy: [
    {
      userId: ObjectId,
      completedAt: Date,
      score: Number
    }
  ]
}
```

You can extend the Progress model to track:
- Subtopic completion percentage
- XP earned per subtopic
- Game attempt history
- Badges earned
- Streak information

## Tagging System

Each subtopic includes tags for filtering and organization:

**Example Tags:**
- `numbers`, `counting`, `place-value` (Math)
- `phonics`, `grammar`, `spelling` (English)
- `animals`, `environment`, `nature` (EVS)
- `logic`, `reasoning`, `patterns` (Logical Reasoning)
- `safety`, `health`, `hygiene` (Values)

This enables:
- Custom curriculum paths
- Targeted learning interventions
- Content recommendations
- Remedial learning paths

## Data Validation

The curriculum data includes:
- ✅ All micro-concepts clearly defined
- ✅ Age-appropriate difficulty progression
- ✅ Game activity suggestions for each topic
- ✅ Realistic time estimates
- ✅ XP values balanced across grades
- ✅ Diverse game types (puzzle, quiz, matching, story, interactive)
- ✅ Alignment with Indian CBSE syllabus
- ✅ Learning objectives for each subject

## Extending the Curriculum

### Adding New Subtopics

To add a new subtopic:

```javascript
{
  subtopicId: "MATH_P_G3_009",
  subtopicName: "Percentages Basics",
  description: "Understanding percentages as parts of 100",
  xpValue: 240,
  difficulty: "Hard",
  microConcepts: [
    "What is percentage",
    "Percentage notation",
    "Converting fractions to percentage",
    "Real-world percentage applications"
  ],
  gameActivityTypes: ["percentage-puzzle", "discount-game", "percentage-match"],
  tags: ["percentage", "fractions", "advanced-math"],
  estimatedTime: "25-30 mins"
}
```

### Adding New Game Types

Game activity types should follow naming convention:
- Format: `[action]-[object]-[gameType]`
- Examples: `color-sort-puzzle`, `word-build-racing`, `math-battle-multiplayer`

## Performance Considerations

- **Indexing**: SubjectId and Tags are indexed for fast queries
- **Caching**: Consider caching the /dashboard/:grade endpoint
- **Pagination**: Search results are limited to 50 items

## Future Enhancements

1. **Video Tutorials**: Link to tutorial videos for each subtopic
2. **Practice Problems**: Store problem templates in a separate collection
3. **Adaptive Learning**: Recommend topics based on student performance
4. **Multilingual Support**: Add translations for titles and descriptions
5. **Teacher Analytics**: Track class-wide progress and performance
6. **Badges & Achievements**: Define badges for topic mastery
7. **Parent Reports**: Generate progress reports for parents

## Troubleshooting

### Seed Script Fails
```bash
# Check MongoDB is running
# Check MONGO_URI in .env
# Verify curriculum.json exists
```

### API Returns Empty Results
```bash
# Verify data was seeded: db.curriculum.find().count()
# Check subjectId format (case-sensitive)
# Verify MongoDB index: db.curriculum.getIndexes()
```

### Slow Queries
```bash
# Create index: db.curriculum.createIndex({ "grades.subtopics.tags": 1 })
# Monitor with: db.curriculum.aggregate([...]).explain("executionStats")
```

---

**Last Updated:** March 31, 2026
**Curriculum Version:** 1.0
**Subjects:** 7 | **Grades:** 4 | **Total Subtopics:** 117
