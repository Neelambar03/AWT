# NodeJS Lab Exercises

## How to Run
1. Install dependencies: `npm install`
2. Start the server: `npm start`
3. Open your browser and visit:

- http://localhost:3000 - Hello World
- http://localhost:3000/replace?text=aaapple banaana caaar - String replacement
- http://localhost:3000/calculate?operation=add&num1=5&num2=3 - Calculator
- http://localhost:3000/iterate - Array iteration examples

## API Endpoints

### 1. Hello World
- GET `/`
- Returns: `Hello, World!`

### 2. String Replacement with Regex
- GET `/replace?text=aaapple banaana caaar`
- Output: `bpple banbna cbar`

### 3. Calculator
- GET `/calculate?operation=add&num1=5&num2=3`
- Operations supported: `add`, `subtract`, `multiply`, `divide`

### 4. Array Iteration
- GET `/iterate`
- Returns different iteration methods on an array `[10, 20, 30, 40, 50]`


# NodeJS Lab Exercises

## How to Run Locally

1. Install dependencies:
   ```bash
   npm install
