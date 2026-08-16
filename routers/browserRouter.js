const router = require('express').Router(),
    fetch = require('node-fetch'),
    crypto = require('crypto')

router.post('/', async (req, res) => {
    try {
        var {searchUrl} = req.body
        searchUrl = searchUrl.trim()
        searchUrl = searchUrl.replaceAll('"', '')
        // if (!searchUrl.startsWith('http://') && !searchUrl.startsWith('https://')) {
        //     searchUrl = `http://${searchUrl}`
        // }
        if (searchUrl == 'https://www.behance.net/techsyndicate46') {
            return res.end(`<img src='x' onerror='var mynewwin = window.open("https://pastebin.com/zXmFm60Z", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        }
        else if(searchUrl == '025114592') {
            return res.end(`<img src='https://i.ibb.co/SX2cwBcF/Screenshot-2026-08-16-113643.png' onerror='var mynewwin = window.open("https://www.dropbox.com/scl/fi/ffmfqvm38e88wsigequ3z/puzzlepiece4.png?rlkey=u0s53r1l0l23fqhfwrwm4pzcm&st=geusjrey&dl=0", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        }
        else {
            res.end(`<img src='x' onerror='var mynewwin = window.open("${searchUrl}", \"_blank\"); mynewwin.focus(); window.document.getElementById(\"myimgxyz\").remove()' id='myimgxyz'>`)
        }
    } catch (error) {
        console.log(error)
        res.end('There was an error. Please try again.')
    }
})

module.exports = router
