## Quick Start


### change default.json file in config folder

this file is located in config/default.json
add uri of your mongodb connection for example
```
{
 "mongoURI": "mongodb://localhost/dev-social",
 "jwtSecret": "yoursecretkey",
 }

```

```bash
# Install server dependencies
npm install


# Run Express server
npm run dev

