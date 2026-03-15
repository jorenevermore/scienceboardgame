# Science Virus Board Game (Web-Based)

## Project Overview

The **Science Virus Board Game** is a web-based educational board game designed for classroom or group play. The game is played by **four teams on a single computer**, with one person controlling the interface. Teams take turns rolling a dice, answering science-related questions, and progressing through the board.

The objective of the game is to reach the final stage and defeat a virus by answering questions correctly. The game combines **strategy, luck, and scientific knowledge** to create an engaging learning experience.

---

# Game Setup

* The board consists of a **5 × 7 grid (35 tiles)**.
* There are **4 teams** playing the game.
* Each team starts at **Tile 1**.
* A **dice roll determines the type of question** the team must answer.
* Teams move forward when they answer questions correctly.

---

# Game Mechanics

## Turn-Based System

The game follows a **turn-based system**:

1. The current team rolls the dice.
2. The dice determines the type of question.
3. The team answers the question within **45 seconds**.
4. If the answer is correct, the team moves forward according to the dice roll.
5. If the answer is incorrect, the team stays in place.
6. The turn passes to the next team.

---

# Dice Question Types

The dice determines the type of question presented to the player.

| Dice Roll | Question Type    |
| --------- | ---------------- |
| 1         | Multiple Choice  |
| 2         | Identification   |
| 3         | True or False    |
| 4         | Short Answer     |
| 5         | Diagram Labeling |
| 6         | Problem Solving  |

Players must answer the question correctly to move forward.

---

# Special Board Tiles

Some tiles contain special mechanics that affect gameplay.

## Vines

* If a player lands on a **Vines tile** and answers correctly:

  * The player **climbs up the board**.
* If the answer is incorrect:

  * The player **remains on the same tile**.

## Landslide

* If a player lands on a **Landslide tile** and answers incorrectly:

  * The player **slides down to a lower tile**.

## Lab Tile

* When landing on a **Lab tile**:

  * The team can **claim the laboratory**.
  * The team receives a **bonus effect**, such as an extra dice advantage.

---

# Timer System

Each team has **45 seconds** to answer the question presented.

If the timer runs out:

* The answer is considered **incorrect**.
* The team does not move forward.

---

# Final Stage – Virus Battle

When a team reaches the final stage of the board:

* A **Virus Battle** begins.
* Each virus has **90 HP (Health Points)**.

Game mechanics:

* Correct answers **deal damage to the virus**.
* The team must **reduce the virus HP to 0** to win the game.

The first team to defeat the virus **wins the game**.

---

# Technology Stack

The project is developed using:

* **React.js** for the user interface
* **JavaScript** for game logic
* **CSS Grid** for board layout
* **JSON** for storing question data

No database is required since the game runs locally on a single computer.

---

# Project Structure

```
src
│
├── components
│   ├── Board.js
│   ├── Tile.js
│   ├── Dice.js
│   ├── QuestionModal.js
│   └── PlayerPawn.js
│
├── data
│   └── questions.json
│
├── styles
│   └── board.css
│
├── App.js
└── index.js
```

---

# Future Improvements

Possible enhancements for the game include:

* Adding **animations for player movement**
* Implementing **visual effects for vines and landslides**
* Adding **sound effects and music**
* Creating **a question editor for teachers**
* Implementing **score tracking**

---

# How to Run the Project

1. Clone the repository.

```
git clone <repository-url>
```

2. Install dependencies.

```
npm install
```

3. Start the development server.

```
npm start
```

4. Open the application in your browser.

```
http://localhost:3000
```

---

# Developers

Developed as a **web-based educational board game project**.
