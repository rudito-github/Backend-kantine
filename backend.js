/*******************************************************************************
 * @Author                : rudito-github<rudi.neuss@t-online.de>              *
 * @CreatedDate           : 2026-04-24 20:30:52                                *
 * @LastEditors           : rudito-github<rudi.neuss@t-online.de>              *
 * @LastEditDate          : 2026-04-24 20:30:52                                *
 * @FilePath              : Online-speisplan/index.js                          *
 * @CopyRight             : MerBleueAviation                                   *
 ******************************************************************************/require('dotenv').config()
const express = require('express')
const crudRouter = require('./src/routes/crud')

const app = express()
const PORT = process.env.PORT || 3000

app.use(express.json())

app.get('/health', (req, res) => res.json({ status: 'ok' }))

app.use('/api', crudRouter)

app.listen(PORT, () => {
  console.log(`Server läuft auf http://localhost:${PORT}`)
})
