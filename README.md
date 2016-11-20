## Test work with angular and angular-material

### External dependencies
Node v6.8.1

MySQL 5.7.16

### Installation
```
npm i // install dependencies
```

### Setup
```
npm run setup       // create tables in db (check config for settings), populate with fake data, and build in dev mode
```

### Build
```
npm run build       // build in dev mode
npm run build:prod  // build in production mode (minification, no source maps, unused code removal)
```

### Server start
```
npm start
```


## API

### Get items and categories
```
GET /items

application/json

response:
{
	items:
  {
    id: number,
    sku: string,
    name: string,
    description: string,
    amount: number,
    img: string,
    category: number,
    created: number       // UNIX timestamp
  } [],
  categories:
  {
    [id: string] : string
  }
}
```