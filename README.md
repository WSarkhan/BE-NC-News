# **Northcoders Backend News API**

## **Project Summary**

### **TECH Stack** Javascript, Expres.js, Node.js, PostgreSQL

This RESTful API was built using **Test Driven Development (TDD)**. The API was built as the foundational backend structure for a News web application similar to [Reddit](https://www.reddit.com/). The project was built using **[Node.js](https://nodejs.org/en)** and **[Express.js](https://expressjs.com/)**, and uses **[PostgreSQL](https://www.postgresql.org/)** as its database. The database is hosted on **[ElephantSQL](https://www.elephantsql.com/)** and deployed on **[Render](https://render.com/)**.

The link to the live version of this API can be accessed [here](https://nc-news-6jgg.onrender.com/api)

## **API Endpoints list**

| Endpoints                                   | Description                                                                           |
| :------------------------------------------ | :------------------------------------------------------------------------------------ |
| **GET** /api                                | Serves up a json representation of all the available endpoints of the api             |
| **GET** /api/topics                         | Serves an array of all topics                                                         |
| **GET** /api/users                          | Serves an array of objects containing username, name and avatar_url                   |
| **GET** /api/articles                       | Serves an array of all articles                                                       |
| **GET** /api/articles/:article_id           | Serves an article object by article id                                                |
| **GET** /api/articles/:article_id/comments  | Serves an array of comments for given article_id requested with the most recent first |
| **POST** /api/articles/:article_id/comments | Adds comment to comment database and serves the added comment                         |
| **PATCH** /api/articles/:article_id         | Updates article with new vote by article ID                                           |
| **DELETE** /api/comments/:comment_id        | Deletes the comment by comment_id                                                     |

---

## **Instructions**

### **Minimum version**

- **[Node.js](https://nodejs.org/en)** v21.2.0
- **[PostgresSQL](https://www.postgresql.org/)** v14.9

Make sure you already have Node.js, PostgreSQL and NPM installed. To check run the following commands in your terminal:

```bash
node -v
```

```bash
npm -v
```

```bash
postgres -v
```

If you don't have these installed, you can download node here **[Node.js](https://nodejs.org/en)** installing node will install **[NPM](https://www.npmjs.com/)** automatically for you. Postgresql can be installed here **[PostgreSQL](https://www.postgresql.org/download/)**

---


### **Setup**

#### **1. Clone this repository locally in the terminal**

*Create a new directory*
```bash
 mkdir <new-directory-name>
```
*Navigate to this directory:*
```bash
cd <new-directory-name>
```
*Clone this repository:*
```bash
git clone https://github.com/WSarkhan/NC-News.git
```
*Navigate to the cloned git directory:*
```bash
cd NC-news
```

---

#### **2. Install dependencies**


*Install dependencies*
```bash
✗ npm i
```
*This should install the below:* 

Dependencies:

- **[husky](https://www.npmjs.com/package/husky)** v8.0.2,
- **[dotenv](https://www.npmjs.com/package/dotenv)** v16.0.0,
- **[express](https://expressjs.com/)**  v4.18.2,
- **[pg-format](https://www.npmjs.com/package/pg-format)** v1.0.4,
- **[pg](https://www.npmjs.com/package/pg)** ^8.7.3"

Developer dependencies:

- **[jest](https://jestjs.io/)** v27.5.1
- **[jest-extended](https://www.npmjs.com/package/jest-extended)** v2.0.0
- **[jest-sorted](https://www.npmjs.com/package/jest-sorted)** v1.0.14
- **[supertest](https://www.npmjs.com/package/supertest)** v6.3.4

Note: If you get vulnerabilities, follow the instruction given on the terminal. Use the following command to fix this:

```bash
npm audit fix
```

---

#### 3. **Create files for environment variables**

*Create a folder named **.env.development** and insert the following:-*
```
PGDATABASE=nc_news
```
*Create a folder named **.env.test** and insert the following:-*
```
PGDATABASE=nc_news_test
```
*Create a folder named **.env.production** and insert the following:-*
```
DATABASE_URL=<URL>
```

**NOTE: Make sure to add .env.* to your git ignore as env files usually contain sensitive information and should not be put in version control**

---

#### 4. **Setup, Seed the database and test the API endpoints**
*Setup the database*

```bash
npm run setub-dbs
```

*Seed the database*

```bash
npm run seed
```

*Test the API endpoints*

```bash
npm test app
```
**If all tests pass, the API is ready to be deployed**

---

## Author

**Ward Sarkhan** | **[GitHub](https://github.com/WSarkhan)** | **[LinkedIn](https://www.linkedin.com/in/wsarkhan/)**
