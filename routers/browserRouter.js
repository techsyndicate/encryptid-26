const router = require('express').Router(),
    fetch = require('node-fetch'),
    crypto = require('crypto')

router.post('/', async (req, res) => {
    try {
        var {searchUrl} = req.body
        searchUrl = searchUrl.trim()
        searchUrl = searchUrl.replaceAll('"', '')
        if (!searchUrl.startsWith('http://') && !searchUrl.startsWith('https://')) {
            searchUrl = `http://${searchUrl}`
        }
        if (searchUrl == 'https://www.behance.net/techsyndicate46') {
            return res.end(`<img src='x' onerror='var mynewwin = window.open("https://pastebin.com/zXmFm60Z", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        } // idhar daal
        else {
            res.end(`<img src='x' onerror='var mynewwin = window.open("${searchUrl}", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        }
    } catch (error) {
        console.log(error)
        res.end('There was an error. Please try again.')
    }
})

module.exports = router