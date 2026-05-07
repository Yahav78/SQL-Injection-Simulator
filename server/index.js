const express = require('express');
const sqlite3 = require('sqlite3').verbose();
const cors = require('cors');

const app = express();
const PORT = 3001;

// Enable CORS so the React app can communicate with this server
app.use(cors());
// Parse JSON request bodies
app.use(express.json());

// Initialize in-memory SQLite database
const db = new sqlite3.Database(':memory:', (err) => {
    if (err) {
        console.error('Error connecting to the database:', err.message);
    } else {
        console.log('Connected to the in-memory SQLite database.');
        
        // Create the users table
        db.serialize(() => {
            db.run(`CREATE TABLE users (
                id INTEGER PRIMARY KEY AUTOINCREMENT,
                username TEXT NOT NULL,
                password TEXT NOT NULL
            )`);

            // Insert the admin user on startup
            db.run(`INSERT INTO users (username, password) VALUES ('admin', 'supersecret123')`, (err) => {
                if (err) {
                    console.error('Error inserting admin user:', err.message);
                } else {
                    console.log('Admin user created successfully.');
                }
            });
        });
    }
});

/**
 * VULNERABLE ENDPOINT: /api/login-vulnerable
 * 
 * הסבר למראיין:
 * נקודת קצה זו מדגימה כיצד הזרקת SQL (SQL Injection) מתבצעת.
 * אנו משתמשים בשרשור מחרוזות ישיר (String Concatenation) כדי להרכיב את השאילתה:
 * `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`
 * 
 * אם תוקף מכניס לשדה שם המשתמש את הערך: ' OR '1'='1
 * השאילתה שתורכב תיראה כך:
 * SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '...'
 * 
 * מאחר והתנאי '1'='1' תמיד נכון (True), ומשתמשים באופרטור OR, התנאי הכולל יהיה תמיד נכון.
 * כתוצאה מכך, המסד יחזיר את כל הרשומות בטבלה (או את הרשומה הראשונה במקרה שלנו - האדמין), 
 * והתוקף יעקוף את מערכת ההזדהות לחלוטין ללא צורך לדעת את הסיסמה.
 */
app.post('/api/login-vulnerable', (req, res) => {
    const { username, password } = req.body;

    // Vulnerable SQL query using string concatenation
    const query = `SELECT * FROM users WHERE username = '${username}' AND password = '${password}'`;
    
    console.log('[Vulnerable API] Executing query:', query);

    db.get(query, (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (row) {
            // Login successful
            return res.json({ 
                success: true, 
                message: 'Login successful (Vulnerable)', 
                user: { id: row.id, username: row.username } 
            });
        } else {
            // Login failed
            return res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

/**
 * SECURE ENDPOINT: /api/login-secure
 * 
 * הסבר למראיין:
 * נקודת קצה זו מאובטחת מפני התקפות SQL Injection.
 * אנו משתמשים בשאילתות פרמטריות (Parameterized Queries / Prepared Statements).
 * 
 * בשאילתה אנו שמים סימני שאלה (?) במקום לשרשר מחרוזות:
 * `SELECT * FROM users WHERE username = ? AND password = ?`
 * 
 * את הערכים האמיתיים אנו מעבירים כמערך בפונקציה של ספרית ה-SQL.
 * מסד הנתונים מתייחס לערכים אלו כאל נתונים בלבד (Data), ולא כחלק מפקודות ה-SQL (Code).
 * לכן, גם אם התוקף יעביר פיילואוד כמו ' OR '1'='1, המסד יחפש במדויק משתמש ששמו הוא מחרוזת זו.
 * מכיוון שאין משתמש כזה, ההתחברות תיכשל והמערכת תישאר בטוחה.
 */
app.post('/api/login-secure', (req, res) => {
    const { username, password } = req.body;

    // Secure SQL query using parameterized query (?)
    const query = `SELECT * FROM users WHERE username = ? AND password = ?`;
    
    console.log('[Secure API] Executing parameterized query with values:', [username, password]);

    db.get(query, [username, password], (err, row) => {
        if (err) {
            console.error('Database error:', err.message);
            return res.status(500).json({ success: false, message: 'Database error' });
        }
        
        if (row) {
            // Login successful
            return res.json({ 
                success: true, 
                message: 'Login successful (Secure)', 
                user: { id: row.id, username: row.username } 
            });
        } else {
            // Login failed
            return res.json({ success: false, message: 'Invalid username or password' });
        }
    });
});

app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});

// Export the app for Vercel serverless deployment
module.exports = app;
